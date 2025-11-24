<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

/**
 * @group Two-Factor Authentication
 *
 * APIs for managing two-factor authentication. 2FA adds an extra layer of security by requiring a verification code sent to your email.
 */
class TwoFactorController extends Controller
{
    /**
     * Get 2FA status
     *
     * Check if two-factor authentication is enabled for the authenticated user.
     *
     * @response 200 {
     *   "enabled": false,
     *   "verified_at": null
     * }
     * @response 200 scenario="Enabled" {
     *   "enabled": true,
     *   "verified_at": "2024-01-15T10:30:00.000000Z"
     * }
     */
    public function status()
    {
        $user = Auth::user();

        return response()->json([
            'enabled' => $user->two_factor_enabled,
            'verified_at' => $user->two_factor_verified_at,
        ]);
    }

    /**
     * Enable 2FA
     *
     * Start the process to enable 2FA. A verification code will be sent to the user's email.
     *
     * @bodyParam password string required Current password to confirm identity. Example: password123
     *
     * @response 200 {
     *   "message": "Verification code sent to your email. Please verify to enable 2FA.",
     *   "email_masked": "jo***@example.com"
     * }
     * @response 400 {
     *   "message": "Please add an email address to your profile before enabling 2FA."
     * }
     * @response 422 {
     *   "message": "The given data was invalid.",
     *   "errors": {"password": ["Password is incorrect."]}
     * }
     */
    public function enable(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        // Verify current password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Password is incorrect.'],
            ]);
        }

        // Check if user has email
        if (!$user->email) {
            return response()->json([
                'message' => 'Please add an email address to your profile before enabling 2FA.',
            ], 400);
        }

        // Generate and send verification code
        $code = $this->generateCode();
        $user->update([
            'two_factor_code' => $code,
            'two_factor_code_expires_at' => now()->addMinutes(10),
        ]);

        // Send code via email
        $this->sendCodeEmail($user, $code, 'enable');

        return response()->json([
            'message' => 'Verification code sent to your email. Please verify to enable 2FA.',
            'email_masked' => $this->maskEmail($user->email),
        ]);
    }

    /**
     * Verify enable code
     *
     * Verify the code sent to email to complete 2FA enablement.
     *
     * @bodyParam code string required The 6-digit verification code. Example: 123456
     *
     * @response 200 {
     *   "message": "Two-factor authentication has been enabled successfully.",
     *   "enabled": true
     * }
     * @response 400 {
     *   "message": "Verification code has expired. Please request a new one."
     * }
     */
    public function verifyEnable(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();

        if (!$user->two_factor_code) {
            return response()->json([
                'message' => 'No verification code requested. Please start the 2FA setup again.',
            ], 400);
        }

        if (now()->isAfter($user->two_factor_code_expires_at)) {
            $user->update([
                'two_factor_code' => null,
                'two_factor_code_expires_at' => null,
            ]);
            return response()->json([
                'message' => 'Verification code has expired. Please request a new one.',
            ], 400);
        }

        if ($user->two_factor_code !== $request->code) {
            return response()->json([
                'message' => 'Invalid verification code.',
            ], 400);
        }

        // Enable 2FA
        $user->update([
            'two_factor_enabled' => true,
            'two_factor_code' => null,
            'two_factor_code_expires_at' => null,
            'two_factor_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Two-factor authentication has been enabled successfully.',
            'enabled' => true,
        ]);
    }

    /**
     * Disable 2FA
     *
     * Disable two-factor authentication for the account.
     *
     * @bodyParam password string required Current password to confirm identity. Example: password123
     *
     * @response 200 {
     *   "message": "Two-factor authentication has been disabled.",
     *   "enabled": false
     * }
     * @response 422 {
     *   "message": "The given data was invalid.",
     *   "errors": {"password": ["Password is incorrect."]}
     * }
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        // Verify current password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Password is incorrect.'],
            ]);
        }

        $user->update([
            'two_factor_enabled' => false,
            'two_factor_code' => null,
            'two_factor_code_expires_at' => null,
        ]);

        return response()->json([
            'message' => 'Two-factor authentication has been disabled.',
            'enabled' => false,
        ]);
    }

    /**
     * Send login code
     *
     * Request a 2FA verification code to be sent during the login process.
     *
     * @unauthenticated
     *
     * @bodyParam phone string required The user's phone number. Example: 08012345678
     *
     * @response 200 {
     *   "message": "Verification code sent to your email.",
     *   "email_masked": "jo***@example.com",
     *   "expires_in": 600
     * }
     * @response 400 {
     *   "message": "2FA is not enabled for this account."
     * }
     * @response 404 {
     *   "message": "User not found."
     * }
     */
    public function sendLoginCode(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if (!$user->two_factor_enabled) {
            return response()->json([
                'message' => '2FA is not enabled for this account.',
            ], 400);
        }

        if (!$user->email) {
            return response()->json([
                'message' => 'No email address on file. Cannot send verification code.',
            ], 400);
        }

        // Generate and send code
        $code = $this->generateCode();
        $user->update([
            'two_factor_code' => $code,
            'two_factor_code_expires_at' => now()->addMinutes(10),
        ]);

        $this->sendCodeEmail($user, $code, 'login');

        return response()->json([
            'message' => 'Verification code sent to your email.',
            'email_masked' => $this->maskEmail($user->email),
            'expires_in' => 600, // 10 minutes in seconds
        ]);
    }

    /**
     * Verify login code
     *
     * Verify the 2FA code to complete the login process and receive an authentication token.
     *
     * @unauthenticated
     *
     * @bodyParam phone string required The user's phone number. Example: 08012345678
     * @bodyParam code string required The 6-digit verification code. Example: 123456
     *
     * @response 200 {
     *   "message": "Login successful",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "phone": "08012345678"
     *   },
     *   "token": "1|abc123..."
     * }
     * @response 400 {
     *   "message": "Verification code has expired. Please request a new one."
     * }
     */
    public function verifyLoginCode(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if (!$user->two_factor_code) {
            return response()->json([
                'message' => 'No verification code requested.',
            ], 400);
        }

        if (now()->isAfter($user->two_factor_code_expires_at)) {
            $user->update([
                'two_factor_code' => null,
                'two_factor_code_expires_at' => null,
            ]);
            return response()->json([
                'message' => 'Verification code has expired. Please request a new one.',
            ], 400);
        }

        if ($user->two_factor_code !== $request->code) {
            return response()->json([
                'message' => 'Invalid verification code.',
            ], 400);
        }

        // Clear the code
        $user->update([
            'two_factor_code' => null,
            'two_factor_code_expires_at' => null,
        ]);

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Generate token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Resend verification code
     *
     * Request a new verification code to be sent to the user's email.
     *
     * @response 200 {
     *   "message": "New verification code sent.",
     *   "email_masked": "jo***@example.com"
     * }
     * @response 429 {
     *   "message": "Please wait before requesting a new code."
     * }
     */
    public function resendCode(Request $request)
    {
        $user = Auth::user();

        if (!$user->email) {
            return response()->json([
                'message' => 'No email address on file.',
            ], 400);
        }

        // Rate limiting - don't resend if last code was sent within 1 minute
        if ($user->two_factor_code_expires_at &&
            now()->diffInSeconds($user->two_factor_code_expires_at->subMinutes(9)) < 60) {
            return response()->json([
                'message' => 'Please wait before requesting a new code.',
            ], 429);
        }

        $code = $this->generateCode();
        $user->update([
            'two_factor_code' => $code,
            'two_factor_code_expires_at' => now()->addMinutes(10),
        ]);

        $this->sendCodeEmail($user, $code, 'enable');

        return response()->json([
            'message' => 'New verification code sent.',
            'email_masked' => $this->maskEmail($user->email),
        ]);
    }

    /**
     * Generate 6-digit code
     */
    private function generateCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Mask email for privacy
     */
    private function maskEmail(string $email): string
    {
        $parts = explode('@', $email);
        $name = $parts[0];
        $domain = $parts[1];

        $maskedName = substr($name, 0, 2) . str_repeat('*', max(strlen($name) - 2, 3));

        return $maskedName . '@' . $domain;
    }

    /**
     * Send verification code via email
     */
    private function sendCodeEmail(User $user, string $code, string $type = 'login'): void
    {
        $subject = $type === 'login'
            ? 'Alajo - Login Verification Code'
            : 'Alajo - Enable Two-Factor Authentication';

        $message = $type === 'login'
            ? "Your login verification code is: {$code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email and ensure your account is secure."
            : "Your verification code to enable Two-Factor Authentication is: {$code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.";

        try {
            Mail::raw($message, function ($mail) use ($user, $subject) {
                $mail->to($user->email)
                    ->subject($subject);
            });
        } catch (\Exception $e) {
            \Log::error('Failed to send 2FA code email: ' . $e->getMessage());
            throw new \Exception('Failed to send verification code. Please try again.');
        }
    }
}
