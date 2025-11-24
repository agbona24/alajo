@extends('emails.layout')

@section('subtitle', 'Withdrawal Completed')

@section('content')
    <!-- Success Icon -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="text-align: center; padding-bottom: 24px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; line-height: 80px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);">
                    <span style="font-size: 40px; color: #ffffff;">&#128184;</span>
                </div>
            </td>
        </tr>
    </table>

    <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1f2937; text-align: center;">Withdrawal Completed!</h2>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #6b7280; text-align: center;">Your funds are on the way</p>

    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">Hello <strong>{{ $user->name }}</strong>,</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.7;">Great news! Your withdrawal has been successfully processed and the funds have been sent to your bank account.</p>

    <!-- Amount Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);">
                <p style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.8); font-weight: 600;">Amount Sent</p>
                <p style="margin: 0; font-size: 42px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">&#8358;{{ number_format($withdrawal->amount, 0) }}</p>
            </td>
        </tr>
    </table>

    <!-- Transfer Details -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1e293b;">
                    <span style="font-size: 20px;">&#128203;</span> Transfer Details
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Savings Plan</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $plan->emoji ?? '💰' }} {{ $plan->name }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Reference</span>
                            <span style="float: right; font-size: 13px; font-weight: 600; color: #1e293b; font-family: 'Courier New', monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">{{ $withdrawal->reference }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Status</span>
                            <span style="float: right;">
                                <span style="display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #059669;">&#10004; Completed</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Completed Date</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $withdrawal->completed_at ? $withdrawal->completed_at->format('M d, Y \a\t g:i A') : now()->format('M d, Y \a\t g:i A') }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <span style="font-size: 14px; color: #64748b;">Remaining Balance</span>
                            <span style="float: right; font-size: 16px; font-weight: 700; color: #059669;">&#8358;{{ number_format($plan->current_amount, 0) }}</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Bank Details -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 24px; border: 1px solid #bbf7d0;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #166534;">
                    <span style="font-size: 20px;">&#127974;</span> Funds Sent To
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 8px 0;">
                            <span style="font-size: 14px; color: #166534;">Bank Name</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #166534;">{{ $bankAccount->bank_name ?? 'N/A' }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;">
                            <span style="font-size: 14px; color: #166534;">Account Number</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #166534; font-family: 'Courier New', monospace;">{{ $bankAccount->account_number ?? 'N/A' }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;">
                            <span style="font-size: 14px; color: #166534;">Account Name</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #166534;">{{ $bankAccount->account_name ?? $user->name }}</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Processing Note -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #bfdbfe;">
                <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.6;">
                    <span style="font-size: 18px;">&#128165;</span> The funds should reflect in your bank account shortly. Processing time may vary depending on your bank (usually within 24 hours).
                </p>
            </td>
        </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
        <tr>
            <td style="text-align: center;">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/savings/{{ $plan->id }}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);">
                    View Savings Plan &rarr;
                </a>
            </td>
        </tr>
    </table>

    <!-- Thank You -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="text-align: center; padding-top: 16px;">
                <p style="margin: 0; font-size: 15px; color: #6b7280;">
                    Thank you for saving with us! <span style="font-size: 18px;">&#128079;</span><br>
                    <span style="font-weight: 600;">Keep up the great work!</span>
                </p>
            </td>
        </tr>
    </table>
@endsection
