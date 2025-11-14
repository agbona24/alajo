<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Alajo Savings</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f3f4f6;
            min-height: 100vh;
        }
        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .navbar-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .navbar h1 {
            font-size: 24px;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .logout-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        .logout-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        .card h2 {
            color: #333;
            margin-bottom: 10px;
        }
        .card p {
            color: #666;
            line-height: 1.6;
        }
        .success-message {
            background: #d1fae5;
            color: #065f46;
            padding: 15px 20px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="navbar">
        <div class="navbar-content">
            <h1>💰 Alajo Savings</h1>
            <div class="user-info">
                <span>Welcome, {{ Auth::user()->name }}!</span>
                <form method="POST" action="{{ url('/logout') }}" style="margin: 0;">
                    @csrf
                    <button type="submit" class="logout-btn">Logout</button>
                </form>
            </div>
        </div>
    </div>

    <div class="container">
        @if(session('success'))
            <div class="success-message">
                {{ session('success') }}
            </div>
        @endif

        <div class="card">
            <h2>🎉 Welcome to Your Dashboard!</h2>
            <p>You are now logged in to Alajo Savings Application.</p>
            <p style="margin-top: 10px;"><strong>Email:</strong> {{ Auth::user()->email }}</p>
            <p style="margin-top: 10px;"><strong>Member since:</strong> {{ Auth::user()->created_at->format('F d, Y') }}</p>
        </div>

        <div class="card">
            <h2>📊 Quick Stats</h2>
            <p>Your savings dashboard will be available here soon!</p>
        </div>

        <div class="card">
            <h2>💡 Getting Started</h2>
            <p>This is a pure Laravel application. You can now:</p>
            <ul style="margin-top: 15px; margin-left: 20px; color: #666;">
                <li style="margin-bottom: 8px;">✓ Create API endpoints in <code>routes/api.php</code></li>
                <li style="margin-bottom: 8px;">✓ Build your savings features</li>
                <li style="margin-bottom: 8px;">✓ Connect a separate frontend (React, Vue, etc.)</li>
                <li style="margin-bottom: 8px;">✓ Or continue building with Laravel Blade templates</li>
            </ul>
        </div>
    </div>
</body>
</html>
