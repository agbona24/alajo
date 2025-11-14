<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel - Alajo Savings App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 18px;
        }
        .status {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .status.success {
            background: #f0fdf4;
            border-left-color: #10b981;
        }
        .status-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }
        .status-text {
            color: #666;
            font-size: 14px;
        }
        .info-box {
            background: #fefce8;
            border: 1px solid #fde047;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
        }
        .info-title {
            font-weight: 600;
            color: #854d0e;
            margin-bottom: 10px;
        }
        .info-text {
            color: #713f12;
            font-size: 14px;
            line-height: 1.6;
        }
        code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
        .version {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 14px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✅ Laravel is Running!</h1>
        <p class="subtitle">Alajo Savings Application</p>
        
        <div class="status success">
            <div class="status-title">✓ Backend Ready</div>
            <div class="status-text">Laravel {{ app()->version() }} is running successfully</div>
        </div>
        
        <div class="status success">
            <div class="status-title">✓ Database Connected</div>
            <div class="status-text">{{ config('database.default') }} - Ready to use</div>
        </div>
        
        <div class="status success">
            <div class="status-title">✓ Clean Installation</div>
            <div class="status-text">Pure Laravel - No Vite, No React</div>
        </div>

        <div class="info-box">
            <div class="info-title">🚀 Get Started</div>
            <div class="info-text">
                Ready to manage your savings?<br><br>
                <a href="/login" style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-right: 10px; margin-top: 10px;">Login</a>
                <a href="/register" style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 10px;">Create Account</a>
            </div>
        </div>

        <div class="version">
            Laravel v{{ app()->version() }} | PHP v{{ PHP_VERSION }}
        </div>
    </div>
</body>
</html>
