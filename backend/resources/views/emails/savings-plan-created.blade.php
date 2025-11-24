@extends('emails.layout')

@section('subtitle', 'New Savings Plan Created')

@section('content')
    <!-- Celebration Icon -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="text-align: center; padding-bottom: 24px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; line-height: 80px; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);">
                    <span style="font-size: 40px; color: #ffffff;">&#127881;</span>
                </div>
            </td>
        </tr>
    </table>

    <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1f2937; text-align: center;">Congratulations!</h2>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #6b7280; text-align: center;">Your savings journey begins now</p>

    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">Hello <strong>{{ $user->name }}</strong>,</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.7;">Your new savings plan has been created successfully! You're one step closer to achieving your financial goals. Let's make it happen!</p>

    <!-- Daily Amount Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 8px 24px rgba(99, 102, 241, 0.25);">
                <p style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.8); font-weight: 600;">Daily Contribution</p>
                <p style="margin: 0; font-size: 42px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">&#8358;{{ number_format($plan->daily_contribution) }}</p>
            </td>
        </tr>
    </table>

    <!-- Plan Details Card -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1e293b;">
                    <span style="font-size: 20px;">&#128203;</span> Plan Details
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Plan Name</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $plan->emoji ?? '💰' }} {{ $plan->name }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Target Amount</span>
                            <span style="float: right; font-size: 14px; font-weight: 700; color: #059669;">&#8358;{{ number_format($plan->target_amount) }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Duration</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $plan->duration }} month(s)</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Frequency</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ ucfirst($plan->frequency) }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Start Date</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $plan->start_date ? $plan->start_date->format('F j, Y') : 'Immediately' }}</span>
                        </td>
                    </tr>
                    @if($plan->target_date)
                    <tr>
                        <td style="padding: 12px 0;">
                            <span style="font-size: 14px; color: #64748b;">Target Date</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $plan->target_date->format('F j, Y') }}</span>
                        </td>
                    </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <!-- Important Note -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #92400e;">
                    <span style="font-size: 18px;">&#9888;&#65039;</span> Important Note
                </p>
                <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                    The first day's contribution (<strong>&#8358;{{ number_format($plan->daily_contribution) }}</strong>) will be used as the company service fee. This is a one-time charge to maintain our platform and services.
                </p>
            </td>
        </tr>
    </table>

    <!-- Tips Section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 20px; border: 1px solid #bfdbfe;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #1e40af;">
                    <span style="font-size: 18px;">&#128161;</span> Tips for Success
                </p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af; line-height: 1.6;">&#10004; Stay consistent with your daily contributions</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af; line-height: 1.6;">&#10004; Set reminders to make your payments on time</p>
                <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.6;">&#10004; Track your progress regularly in the app</p>
            </td>
        </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
        <tr>
            <td style="text-align: center;">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/savings/{{ $plan->id }}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);">
                    Start Saving Now &rarr;
                </a>
            </td>
        </tr>
    </table>

    <!-- Motivational Footer -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="text-align: center; padding-top: 16px;">
                <p style="margin: 0; font-size: 15px; color: #6b7280; font-style: italic;">
                    "A journey of a thousand miles begins with a single step." <br>
                    <span style="font-weight: 600;">We believe in you!</span> &#128077;
                </p>
            </td>
        </tr>
    </table>
@endsection
