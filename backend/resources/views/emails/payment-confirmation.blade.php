@extends('emails.layout')

@section('subtitle', 'Payment Confirmed')

@section('content')
    <!-- Success Icon -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="text-align: center; padding-bottom: 24px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; line-height: 80px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);">
                    <span style="font-size: 40px; color: #ffffff;">&#10004;</span>
                </div>
            </td>
        </tr>
    </table>

    <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1f2937; text-align: center;">Payment Confirmed!</h2>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #6b7280; text-align: center;">Your savings are growing stronger</p>

    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">Hello <strong>{{ $user->name }}</strong>,</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.7;">Great news! Your payment has been confirmed and successfully added to your savings. Keep up the amazing progress!</p>

    <!-- Amount Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 8px 24px rgba(99, 102, 241, 0.25);">
                <p style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.8); font-weight: 600;">Amount Saved</p>
                <p style="margin: 0; font-size: 42px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">&#8358;{{ number_format($contribution->amount, 0) }}</p>
            </td>
        </tr>
    </table>

    <!-- Details Card -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
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
                            <span style="float: right; font-size: 13px; font-weight: 600; color: #1e293b; font-family: 'Courier New', monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">{{ $contribution->reference }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Payment Method</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ ucfirst(str_replace('_', ' ', $contribution->payment_method)) }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Date</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $contribution->completed_at ? $contribution->completed_at->format('M d, Y \a\t g:i A') : now()->format('M d, Y \a\t g:i A') }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <span style="font-size: 14px; color: #64748b;">New Balance</span>
                            <span style="float: right; font-size: 16px; font-weight: 700; color: #059669;">&#8358;{{ number_format($plan->current_amount, 0) }}</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    @if($plan->target_amount > 0)
    <!-- Progress Bar -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 20px; border: 1px solid #bbf7d0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #166534;">
                    <span style="font-size: 18px;">&#127919;</span> Progress to Goal
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="background: #d1fae5; border-radius: 8px; height: 12px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); width: {{ min(round(($plan->current_amount / $plan->target_amount) * 100), 100) }}%; height: 12px; border-radius: 8px;"></div>
                        </td>
                    </tr>
                </table>
                <p style="margin: 12px 0 0 0; font-size: 14px; color: #166534;">
                    <strong>{{ round(($plan->current_amount / $plan->target_amount) * 100, 1) }}%</strong> complete
                    <span style="float: right; color: #4ade80;">&#8358;{{ number_format($plan->current_amount, 0) }} / &#8358;{{ number_format($plan->target_amount, 0) }}</span>
                </p>
            </td>
        </tr>
    </table>
    @endif

    <!-- Motivational Message -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #fcd34d;">
                <p style="margin: 0; font-size: 15px; color: #92400e;">
                    <span style="font-size: 20px;">&#128170;</span> Keep up the great work! Every contribution brings you closer to your goal.
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
@endsection
