<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title', $appName ?? 'Alajo')</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f0f4f8; -webkit-font-smoothing: antialiased;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f4f8;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">
                    <!-- Card Container -->
                    <tr>
                        <td style="background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            <!-- Header -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); padding: 40px 32px; text-align: center;">
                                        <!-- Logo Circle -->
                                        <div style="display: inline-block; width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; margin-bottom: 16px; line-height: 60px;">
                                            <span style="font-size: 28px; color: #ffffff;">&#128176;</span>
                                        </div>
                                        <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">{{ $appName ?? 'Alajo' }}</h1>
                                        <p style="margin: 8px 0 0 0; font-size: 15px; color: rgba(255,255,255,0.9); font-weight: 500;">@yield('subtitle', 'Your Savings Partner')</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Content -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 40px 32px;">
                                        @yield('content')
                                    </td>
                                </tr>
                            </table>

                            <!-- Footer -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 24px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                                        <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">&copy; {{ date('Y') }} {{ $appName ?? 'Alajo' }}. All rights reserved.</p>
                                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">This is an automated message. Please do not reply directly to this email.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Bottom Branding -->
                    <tr>
                        <td style="padding: 24px; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8;">Powered by {{ $appName ?? 'Alajo' }} - Save Smart, Live Better</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
