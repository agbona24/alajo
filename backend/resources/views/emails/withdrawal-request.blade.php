@extends('emails.layout')

@section('subtitle', 'Withdrawal Request Received')

@section('content')
    <!-- Processing Icon -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="text-align: center; padding-bottom: 24px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 50%; line-height: 80px; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);">
                    <span style="font-size: 40px; color: #ffffff;">&#128230;</span>
                </div>
            </td>
        </tr>
    </table>

    <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1f2937; text-align: center;">Withdrawal Request Received</h2>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #6b7280; text-align: center;">We're processing your request</p>

    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">Hello <strong>{{ $user->name }}</strong>,</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.7;">We've received your withdrawal request and it's now being processed. Our team will review and approve it shortly.</p>

    <!-- Amount Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);">
                <p style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.8); font-weight: 600;">Withdrawal Amount</p>
                <p style="margin: 0; font-size: 42px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">&#8358;{{ number_format($withdrawal->amount, 0) }}</p>
            </td>
        </tr>
    </table>

    <!-- Request Details -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1e293b;">
                    <span style="font-size: 20px;">&#128203;</span> Request Details
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
                        <td style="padding: 12px 0;">
                            <span style="font-size: 14px; color: #64748b;">Status</span>
                            <span style="float: right;">
                                <span style="display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #d97706;">&#9679; Pending Review</span>
                            </span>
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
                    <span style="font-size: 20px;">&#127974;</span> Destination Bank Account
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

    @if($withdrawal->reason)
    <!-- Reason -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #1e40af;">
                    <span style="font-size: 18px;">&#128172;</span> Your Reason
                </p>
                <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.6;">{{ $withdrawal->reason }}</p>
            </td>
        </tr>
    </table>
    @endif

    <!-- What's Next -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #fcd34d;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #92400e;">
                    <span style="font-size: 18px;">&#128337;</span> What's Next?
                </p>
                <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                    You will receive another email once your withdrawal has been processed and sent to your bank account.
                </p>
            </td>
        </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
        <tr>
            <td style="text-align: center;">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/transactions" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);">
                    View Transactions &rarr;
                </a>
            </td>
        </tr>
    </table>
@endsection
