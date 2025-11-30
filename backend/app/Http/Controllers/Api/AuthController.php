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
            'email' => 'required|string|email|max:255|unique:users', // NOW REQUIRED
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

        // Generate 6-digit email verification code
        $verificationCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'collector_id' => $request->collector_id,
            'email_verification_code' => $verificationCode,
            'email_verification_code_expires_at' => now()->addMinutes(15),
            'email_verified' => false,
        ]);

        // Load the collector relationship for the response
        $user->load('collector:id,name');

        // Send verification code email
        try {
            \Mail::raw(
                "Welcome to Alajo!\n\nYour email verification code is: {$verificationCode}\n\nThis code will expire in 15 minutes.\n\nIf you didn't create this account, please ignore this email.",
                function ($mail) use ($user) {
                    $mail->to($user->email)->subject('Alajo - Verify Your Email');
                }
            );
        } catch (\Exception $e) {
            // Log but don't fail registration
            \Log::error('Failed to send verification email: ' . $e->getMessage());
        }

        // Don't create token yet - user needs to verify email first
        return response()->json([
            'message' => 'Registration successful. Please verify your email.',
            'user' => $user,
            'requires_verification' => true,
            'email_masked' => $this->maskEmail($user->email),
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

    /**
     * Request password reset
     *
     * Request a password reset using phone number. If the user has an email, a reset code will be sent.
     * If no email is registered, the user will need to contact their collector or admin.
     *
     * @unauthenticated
     *
     * @bodyParam phone string required The user's phone number. Example: 08012345678
     *
     * @response 200 scenario="Email Available" {
     *   "message": "Password reset code sent to your email",
     *   "has_email": true,
     *   "email_masked": "jo***@example.com"
     * }
     * @response 200 scenario="No Email" {
     *   "message": "No email registered. Please contact your collector or admin for password reset.",
     *   "has_email": false,
     *   "collector": {
     *     "name": "Collector Name",
     *     "phone": "08012345678"
     *   }
     * }
     * @response 404 {
     *   "message": "User not found with this phone number"
     * }
     */
    public function requestPasswordReset(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->with('collector')->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found with this phone number',
            ], 404);
        }

        // If user has email, send reset code
        if ($user->email) {
            // Generate 6-digit reset code
            $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $user->update([
                'password_reset_token' => $code,
                'password_reset_token_expires_at' => now()->addMinutes(15),
            ]);

            // Send code via email
            try {
                \Mail::raw(
                    "Your password reset code is: {$code}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this email and your password will remain unchanged.",
                    function ($mail) use ($user) {
                        $mail->to($user->email)->subject('Alajo - Password Reset Code');
                    }
                );
            } catch (\Exception $e) {
                \Log::error('Failed to send password reset email: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Failed to send reset code. Please try again.',
                ], 500);
            }

            // Mask email for response
            $parts = explode('@', $user->email);
            $name = $parts[0];
            $domain = $parts[1];
            $maskedEmail = substr($name, 0, 2) . str_repeat('*', max(strlen($name) - 2, 3)) . '@' . $domain;

            return response()->json([
                'message' => 'Password reset code sent to your email',
                'has_email' => true,
                'email_masked' => $maskedEmail,
            ]);
        }

        // No email - user needs to contact collector or admin
        $collectorInfo = null;
        if ($user->collector) {
            $collectorInfo = [
                'name' => $user->collector->name,
                'phone' => $user->collector->phone,
            ];
        }

        return response()->json([
            'message' => 'No email registered. Please contact your collector or admin for password reset.',
            'has_email' => false,
            'collector' => $collectorInfo,
        ]);
    }

    /**
     * Reset password
     *
     * Reset user password using the reset code sent via email.
     *
     * @unauthenticated
     *
     * @bodyParam phone string required The user's phone number. Example: 08012345678
     * @bodyParam reset_code string required The 6-digit reset code sent to email. Example: 123456
     * @bodyParam password string required The new password (minimum 8 characters). Example: newpassword123
     * @bodyParam password_confirmation string required Password confirmation. Example: newpassword123
     *
     * @response 200 {
     *   "message": "Password reset successful. You can now login with your new password."
     * }
     * @response 422 {
     *   "message": "Invalid or expired reset code"
     * }
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'reset_code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'phone' => ['User not found with this phone number.'],
            ]);
        }

        // Verify reset code
        if (!$user->password_reset_token ||
            $user->password_reset_token !== $request->reset_code ||
            !$user->password_reset_token_expires_at ||
            now()->isAfter($user->password_reset_token_expires_at)) {
            throw ValidationException::withMessages([
                'reset_code' => ['Invalid or expired reset code.'],
            ]);
        }

        // Reset password
        $user->update([
            'password' => Hash::make($request->password),
            'password_reset_token' => null,
            'password_reset_token_expires_at' => null,
        ]);

        return response()->json([
            'message' => 'Password reset successful. You can now login with your new password.',
        ]);
    }

    /**
     * Verify email with code
     *
     * Verify user email using the verification code sent during registration.
     *
     * @unauthenticated
     *
     * @bodyParam phone string required The user's phone number. Example: 08012345678
     * @bodyParam verification_code string required The 6-digit verification code. Example: 123456
     *
     * @response 200 {
     *   "message": "Email verified successfully",
     *   "user": {...},
     *   "token": "1|abc123..."
     * }
     */
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'verification_code' => 'required|string|size:6',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'phone' => ['User not found.'],
            ]);
        }

        // Check if already verified
        if ($user->email_verified) {
            $token = $user->createToken('auth-token')->plainTextToken;
            return response()->json([
                'message' => 'Email already verified',
                'user' => $user,
                'token' => $token,
            ]);
        }

        // Verify code
        if (!$user->email_verification_code ||
            $user->email_verification_code !== $request->verification_code ||
            !$user->email_verification_code_expires_at ||
            now()->isAfter($user->email_verification_code_expires_at)) {
            throw ValidationException::withMessages([
                'verification_code' => ['Invalid or expired verification code.'],
            ]);
        }

        // Mark email as verified
        $user->update([
            'email_verified' => true,
            'email_verification_code' => null,
            'email_verification_code_expires_at' => null,
            'email_verified_at' => now(),
        ]);

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Send welcome email
        try {
            $notificationService = app(NotificationService::class);
            $notificationService->sendWelcomeEmail($user);
        } catch (\Exception $e) {
            \Log::warning('Failed to send welcome email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Email verified successfully',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Resend verification code
     *
     * Resend email verification code to user's email.
     *
     * @unauthenticated
     *
     * @bodyParam phone string required The user's phone number. Example: 08012345678
     *
     * @response 200 {
     *   "message": "Verification code sent to your email",
     *   "email_masked": "jo***@example.com"
     * }
     */
    public function resendVerificationCode(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        if ($user->email_verified) {
            return response()->json([
                'message' => 'Email already verified',
            ], 400);
        }

        // Generate new code
        $verificationCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'email_verification_code' => $verificationCode,
            'email_verification_code_expires_at' => now()->addMinutes(15),
        ]);

        // Send code
        try {
            \Mail::raw(
                "Your new email verification code is: {$verificationCode}\n\nThis code will expire in 15 minutes.",
                function ($mail) use ($user) {
                    $mail->to($user->email)->subject('Alajo - Email Verification Code');
                }
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send verification code. Please try again.',
            ], 500);
        }

        return response()->json([
            'message' => 'Verification code sent to your email',
            'email_masked' => $this->maskEmail($user->email),
        ]);
    }

    /**
     * Mask email for privacy
     */
    private function maskEmail($email)
    {
        $parts = explode('@', $email);
        $name = $parts[0];
        $domain = $parts[1];
        return substr($name, 0, 2) . str_repeat('*', max(strlen($name) - 2, 3)) . '@' . $domain;
    }
}
