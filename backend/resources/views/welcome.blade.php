<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alajo - Your Digital Savings Partner</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #667eea;
            --secondary: #764ba2;
            --accent: #10b981;
            --dark: #1a202c;
            --light: #f7fafc;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: var(--light);
            overflow-x: hidden;
        }

        /* Navbar */
        .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 20px 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
            z-index: 1000;
            animation: slideDown 0.5s ease;
        }

        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nav-links {
            display: flex;
            gap: 30px;
            align-items: center;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--dark);
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--primary);
        }

        .btn {
            padding: 12px 28px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .btn-outline {
            border: 2px solid var(--primary);
            color: var(--primary);
        }

        .btn-outline:hover {
            background: var(--primary);
            color: white;
        }

        /* Hero Section */
        .hero {
            padding: 150px 20px 100px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 600px;
            height: 600px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(10deg); }
        }

        .hero-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
            position: relative;
        }

        .hero-content {
            animation: fadeInLeft 0.8s ease;
        }

        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .hero h1 {
            font-size: 56px;
            font-weight: 800;
            line-height: 1.2;
            color: var(--dark);
            margin-bottom: 20px;
        }

        .hero h1 .gradient-text {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p {
            font-size: 20px;
            color: #64748b;
            margin-bottom: 40px;
            line-height: 1.6;
        }

        .hero-buttons {
            display: flex;
            gap: 20px;
        }

        .hero-image {
            position: relative;
            animation: fadeInRight 0.8s ease;
        }

        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .phone-mockup {
            width: 100%;
            max-width: 400px;
            height: 600px;
            background: white;
            border-radius: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            padding: 20px;
            position: relative;
            margin: 0 auto;
            animation: phoneFloat 3s ease-in-out infinite;
        }

        @keyframes phoneFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        .phone-screen {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: 700;
        }

        /* Features Section */
        .features {
            padding: 100px 20px;
            background: white;
        }

        .section-header {
            text-align: center;
            margin-bottom: 60px;
            animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .section-header h2 {
            font-size: 42px;
            font-weight: 800;
            color: var(--dark);
            margin-bottom: 15px;
        }

        .section-header p {
            font-size: 18px;
            color: #64748b;
        }

        .features-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }

        .feature-card {
            padding: 40px;
            background: var(--light);
            border-radius: 20px;
            transition: all 0.3s;
            animation: fadeInUp 0.8s ease;
            animation-fill-mode: both;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }
        .feature-card:nth-child(5) { animation-delay: 0.5s; }
        .feature-card:nth-child(6) { animation-delay: 0.6s; }

        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-bottom: 20px;
        }

        .feature-card h3 {
            font-size: 22px;
            color: var(--dark);
            margin-bottom: 10px;
        }

        .feature-card p {
            color: #64748b;
            line-height: 1.6;
        }

        /* How It Works */
        .how-it-works {
            padding: 100px 20px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        }

        .steps-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
        }

        .step {
            text-align: center;
            animation: fadeInUp 0.8s ease;
            animation-fill-mode: both;
        }

        .step:nth-child(1) { animation-delay: 0.2s; }
        .step:nth-child(2) { animation-delay: 0.4s; }
        .step:nth-child(3) { animation-delay: 0.6s; }
        .step:nth-child(4) { animation-delay: 0.8s; }

        .step-number {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: 800;
            margin: 0 auto 20px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .step h3 {
            font-size: 20px;
            color: var(--dark);
            margin-bottom: 10px;
        }

        .step p {
            color: #64748b;
            line-height: 1.6;
        }

        /* CTA Section */
        .cta {
            padding: 100px 20px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            text-align: center;
            color: white;
        }

        .cta h2 {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 20px;
            animation: fadeInUp 0.8s ease;
        }

        .cta p {
            font-size: 20px;
            margin-bottom: 40px;
            opacity: 0.9;
            animation: fadeInUp 0.8s ease 0.2s;
            animation-fill-mode: both;
        }

        .cta-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            animation: fadeInUp 0.8s ease 0.4s;
            animation-fill-mode: both;
        }

        .btn-white {
            background: white;
            color: var(--primary);
        }

        .btn-white:hover {
            background: var(--light);
            transform: translateY(-2px);
        }

        /* Footer */
        .footer {
            padding: 40px 20px;
            background: var(--dark);
            color: white;
            text-align: center;
        }

        .footer p {
            opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero-container {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .hero h1 {
                font-size: 36px;
            }

            .hero-buttons {
                justify-content: center;
                flex-wrap: wrap;
            }

            .hero-image {
                order: -1;
            }

            .phone-mockup {
                max-width: 300px;
                height: 500px;
            }

            .nav-links {
                gap: 15px;
            }

            .section-header h2 {
                font-size: 32px;
            }

            .cta h2 {
                font-size: 32px;
            }

            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">💰 Alajo</div>
            <div class="nav-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="/login" class="btn btn-outline">Login</a>
                <a href="/register" class="btn btn-primary">Get Started</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1>Save Smarter with <span class="gradient-text">Digital Ajo</span></h1>
                <p>Traditional savings meet modern technology. Join thousands saving together through our trusted digital platform.</p>
                <div class="hero-buttons">
                    <a href="/register" class="btn btn-primary">Start Saving Now</a>
                    <a href="#how-it-works" class="btn btn-outline">Learn More</a>
                </div>
            </div>
            <div class="hero-image">
                <div class="phone-mockup">
                    <div class="phone-screen">
                        <div>💰</div>
                        <div style="margin-top: 20px;">Alajo</div>
                        <div style="font-size: 16px; margin-top: 10px; opacity: 0.9;">Your Savings Partner</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="section-header">
            <h2>Why Choose Alajo?</h2>
            <p>Everything you need to grow your savings, digitally</p>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3>Goal-Based Savings</h3>
                <p>Set your financial goals and watch your savings grow automatically with our smart savings plans.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3>Track Progress</h3>
                <p>Monitor your savings journey with beautiful analytics and detailed contribution history.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>100% Secure</h3>
                <p>Bank-level encryption and security measures to keep your money and data safe.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>Instant Withdrawals</h3>
                <p>Access your savings anytime with quick withdrawal processing and approval.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h3>Mobile First</h3>
                <p>Save on the go with our responsive platform that works on any device.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">👥</div>
                <h3>Community Savings</h3>
                <p>Join traditional ajo groups digitally and save together with friends and family.</p>
            </div>
        </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works" id="how-it-works">
        <div class="section-header">
            <h2>How It Works</h2>
            <p>Start your savings journey in 4 simple steps</p>
        </div>
        <div class="steps-container">
            <div class="step">
                <div class="step-number">1</div>
                <h3>Create Account</h3>
                <p>Sign up in seconds with just your email and password</p>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <h3>Set Your Goal</h3>
                <p>Create savings plans with target amounts and frequencies</p>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <h3>Start Saving</h3>
                <p>Make contributions daily, weekly, or monthly</p>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <h3>Reach Your Goal</h3>
                <p>Withdraw anytime or let your savings grow</p>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <h2>Ready to Start Saving?</h2>
        <p>Join thousands of Nigerians achieving their financial goals with Alajo</p>
        <div class="cta-buttons">
            <a href="/register" class="btn btn-white">Create Free Account</a>
            <a href="/login" class="btn btn-outline" style="border-color: white; color: white;">Login to Dashboard</a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; 2024 Alajo. Savings Saves Life. All rights reserved.</p>
    </footer>
</body>
</html>
