@extends('emails.layout')

@section('subtitle', 'Welcome to ' . $appName)

@section('content')
    <!-- Welcome Icon -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="text-align: center; padding-bottom: 24px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; line-height: 80px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);">
                    <span style="font-size: 40px; color: #ffffff;">&#127881;</span>
                </div>
            </td>
        </tr>
    </table>

    <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1f2937; text-align: center;">Welcome to {{ $appName }}!</h2>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #6b7280; text-align: center;">Your savings journey starts here</p>

    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">Hello <strong>{{ $user->name }}</strong>,</p>
    <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.7;">Congratulations on joining {{ $appName }}! We're excited to have you on board and help you achieve your savings goals. Let's build your financial future together!</p>

    <!-- Success Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);">
                <p style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.8); font-weight: 600;">Account Status</p>
                <p style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff;">&#10004; Created Successfully</p>
            </td>
        </tr>
    </table>

    <!-- Account Details -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1e293b;">
                    <span style="font-size: 20px;">&#128100;</span> Your Account Details
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Full Name</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $user->name }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="font-size: 14px; color: #64748b;">Phone Number</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $user->phone }}</span>
                        </td>
                    </tr>
                    @if($user->email)
                    <tr>
                        <td style="padding: 12px 0;">
                            <span style="font-size: 14px; color: #64748b;">Email</span>
                            <span style="float: right; font-size: 14px; font-weight: 600; color: #1e293b;">{{ $user->email }}</span>
                        </td>
                    </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <!-- Getting Started Steps -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 24px; border: 1px solid #bfdbfe;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1e40af;">
                    <span style="font-size: 20px;">&#128640;</span> Getting Started
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #93c5fd;">
                            <span style="display: inline-block; width: 28px; height: 28px; background: #3b82f6; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 700; margin-right: 12px;">1</span>
                            <span style="font-size: 14px; color: #1e40af; font-weight: 600;">Create a Savings Plan</span>
                            <span style="float: right; font-size: 13px; color: #3b82f6;">Set your goals</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #93c5fd;">
                            <span style="display: inline-block; width: 28px; height: 28px; background: #3b82f6; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 700; margin-right: 12px;">2</span>
                            <span style="font-size: 14px; color: #1e40af; font-weight: 600;">Start Contributing</span>
                            <span style="float: right; font-size: 13px; color: #3b82f6;">Daily savings</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #93c5fd;">
                            <span style="display: inline-block; width: 28px; height: 28px; background: #3b82f6; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 700; margin-right: 12px;">3</span>
                            <span style="font-size: 14px; color: #1e40af; font-weight: 600;">Track Your Progress</span>
                            <span style="float: right; font-size: 13px; color: #3b82f6;">Watch it grow</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <span style="display: inline-block; width: 28px; height: 28px; background: #10b981; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 700; margin-right: 12px;">&#10004;</span>
                            <span style="font-size: 14px; color: #1e40af; font-weight: 600;">Achieve Your Goals</span>
                            <span style="float: right; font-size: 13px; color: #10b981; font-weight: 700;">Success!</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Tips -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; border: 1px solid #fcd34d;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #92400e;">
                    <span style="font-size: 18px;">&#128161;</span> Pro Tip
                </p>
                <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                    Start with a small daily contribution (minimum &#8358;300) and stay consistent. Small amounts add up to big savings over time!
                </p>
            </td>
        </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
        <tr>
            <td style="text-align: center;">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);">
                    Go to Dashboard &rarr;
                </a>
            </td>
        </tr>
    </table>

    <!-- Support -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
        <tr>
            <td style="text-align: center; padding-top: 16px;">
                <p style="margin: 0; font-size: 15px; color: #6b7280;">
                    Need help getting started? Our support team is here for you! <span style="font-size: 18px;">&#128075;</span>
                </p>
            </td>
        </tr>
    </table>
@endsection
