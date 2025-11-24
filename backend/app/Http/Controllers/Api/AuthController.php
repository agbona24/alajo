<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * @group Authentication
 *
 * APIs for user authentication, registration, and session management.
 */
class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * Create a new user account and receive an authentication token.
     *
     * @unauthenticated
     *
     * @bodyParam name string required The user's full name. Example: John Doe
     * @bodyParam phone string required The user's phone number (must be unique). Example: 08012345678
     * @bodyParam email string optional The user's email address. Example: john@example.com
     * @bodyParam password string required The password (minimum 8 characters). Example: password123
     * @bodyParam password_confirmation string required Password confirmation. Example: password123
     * @bodyParam collector_id int optional ID of the collector who registered this user. Example: 5
     *
     * @response 201 {
     *   "message": "Registration successful",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "phone": "08012345678",
     *     "email": "john@example.com",
     *     "role": "user",
     *     "status": "active"
     *   },
     *   "token": "1|abc123..."
     * }
     * @response 422 {
     *   "message": "The phone has already been taken.",
     *   "errors": {
     *     "phone": ["The phone has already been taken."]
     *   }
     * }
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:users',
            'email' => 'nullable|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'collector_id' => 'nullable|exists:users,id',
        ]);

        // If collector_id is provided, verify the user is actually a collector
        if ($request->collector_id) {
            $collector = User::find($request->collector_id);
            if (!$collector || !$collector->isCollector()) {
                return response()->json([
                    'message' => 'Invalid collector selected',
                    'errors' => ['collector_id' => ['The selected collector is invalid.']]
                ], 422);
            }
        }

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'collector_id' => $request->collector_id,
        ]);

        // Load the collector relationship for the response
        $user->load('collector:id,name');

        $token = $user->createToken('auth-token')->plainTextToken;

        // Send welcome email
        try {
            $notificationService = app(NotificationService::class);
            $notificationService->sendWelcomeEmail($user);
        } catch (\Exception $e) {
            // Log but don't fail registration
            \Log::warning('Failed to send welcome email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Get list of collectors
     *
     * Retrieve a list of active collectors for user registration.
     *
     * @unauthenticated
     *
     * @response 200 [
     *   {"id": 1, "name": "Collector One"},
     *   {"id": 2, "name": "Collector Two"}
     * ]
     */
    public function getCollectors()
    {
        $collectors = User::where('role', User::ROLE_COLLECTOR)
            ->where('status', User::STATUS_ACTIVE)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json($collectors);
    }

    /**
     * Login user
     *
     * Authenticate a user with phone number and password. If 2FA is enabled, a verification code will be sent to the user's email.
     *
     * @unauthenticated
     *
     * @bodyParam phone string required The user's phone number. Example: 08012345678
     * @bodyParam password string required The user's password. Example: password123
     *
     * @response 200 {
     *   "message": "Login successful",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "phone": "08012345678",
     *     "email": "john@example.com"
     *   },
     *   "token": "1|abc123..."
     * }
     * @response 200 scenario="2FA Required" {
     *   "message": "Two-factor authentication required",
     *   "requires_2fa": true,
     *   "email_masked": "jo***@example.com",
     *   "phone": "08012345678"
     * }
     * @response 422 {
     *   "message": "The provided credentials are incorrect.",
     *   "errors": {
     *     "phone": ["The provided credentials are incorrect."]
     *   }
     * }
     */
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'phone' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if 2FA is enabled
        if ($user->two_factor_enabled) {
            // Generate and send 2FA code
            $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->update([
                'two_factor_code' => $code,
                'two_factor_code_expires_at' => now()->addMinutes(10),
            ]);

            // Send code via email
            if ($user->email) {
                try {
                    \Mail::raw(
                        "Your login verification code is: {$code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.",
                        function ($mail) use ($user) {
                            $mail->to($user->email)->subject('Alajo - Login Verification Code');
                        }
                    );
                } catch (\Exception $e) {
                    \Log::error('Failed to send 2FA code: ' . $e->getMessage());
                }
            }

            // Mask email for response
            $maskedEmail = null;
            if ($user->email) {
                $parts = explode('@', $user->email);
                $name = $parts[0];
                $domain = $parts[1];
                $maskedEmail = substr($name, 0, 2) . str_repeat('*', max(strlen($name) - 2, 3)) . '@' . $domain;
            }

            return response()->json([
                'message' => 'Two-factor authentication required',
                'requires_2fa' => true,
                'email_masked' => $maskedEmail,
                'phone' => $user->phone,
            ]);
        }

        // Update last login time
        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout user
     *
     * Revoke all authentication tokens for the current user.
     *
     * @response 200 {
     *   "message": "Logged out successfully"
     * }
     */
    public function logout(Request $request)
    {
        // Revoke all tokens...
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated user
     *
     * Retrieve the currently authenticated user's profile information.
     *
     * @response 200 {
     *   "id": 1,
     *   "name": "John Doe",
     *   "phone": "08012345678",
     *   "email": "john@example.com",
     *   "role": "user",
     *   "status": "active",
     *   "two_factor_enabled": false
     * }
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Biometric login
     *
     * Authenticate a user using device biometrics. The biometric verification is done on the client side (WebAuthn),
     * and this endpoint trusts the client's verification and issues a token.
     *
     * @unauthenticated
     *
     * @bodyParam phone string required The user's phone number. Example: 08012345678
     * @bodyParam biometric_token string required The biometric verification token from the device. Example: abc123xyz
     *
     * @response 200 {
     *   "message": "Biometric login successful",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "phone": "08012345678"
     *   },
     *   "token": "1|abc123..."
     * }
     * @response 422 {
     *   "message": "User not found. Please login with password.",
     *   "errors": {
     *     "phone": ["User not found. Please login with password."]
     *   }
     * }
     */
    public function biometricLogin(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'biometric_token' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'phone' => ['User not found. Please login with password.'],
            ]);
        }

        // Update last login time
        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('biometric-auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Biometric login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }
}
