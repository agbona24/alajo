<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $appName }} - Download App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
        }

        @keyframes floatSlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes shine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .animate-float {
            animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
            animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-slide-up {
            animation: slideInUp 0.8s ease-out forwards;
        }

        .animate-slide-left {
            animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-right {
            animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-fade-in {
            animation: fadeIn 1s ease-out forwards;
        }

        .animate-pulse-slow {
            animation: pulse 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
            animation: bounce 2s ease-in-out infinite;
        }

        .animate-wiggle {
            animation: wiggle 1s ease-in-out infinite;
        }

        .animate-scale-in {
            animation: scaleIn 0.6s ease-out forwards;
        }

        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-bg {
            background-image: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%), url('/images/8.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }

        .animate-gradient {
            background: linear-gradient(270deg, #667eea, #764ba2, #f093fb, #4facfe);
            background-size: 800% 800%;
            animation: gradientShift 8s ease infinite;
        }

        .shine-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            background-size: 200% 100%;
            animation: shine 3s infinite;
        }

        .download-btn {
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .download-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .download-btn:hover::before {
            width: 300px;
            height: 300px;
        }

        .download-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .download-btn:active {
            transform: translateY(0) scale(0.98);
        }

        .image-grid-item {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .image-grid-item:hover {
            transform: scale(1.08) rotate(2deg);
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            z-index: 10;
        }

        .feature-card {
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-10px);
        }

        /* Parallax effect */
        .parallax {
            transform: translateZ(0);
            will-change: transform;
        }
    </style>
</head>
<body class="bg-white overflow-x-hidden">

    <!-- Hero Section with Background Image -->
    <section class="hero-bg relative min-h-screen flex flex-col items-center justify-center px-4 py-20 text-white">
        <!-- Animated Floating Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-20 left-10 text-6xl animate-float">💰</div>
            <div class="absolute top-40 right-20 text-5xl animate-float-slow" style="animation-delay: 1s;">📱</div>
            <div class="absolute bottom-40 left-20 text-7xl animate-float" style="animation-delay: 2s;">🎯</div>
            <div class="absolute bottom-20 right-40 text-4xl animate-float-slow" style="animation-delay: 0.5s;">💸</div>
            <div class="absolute top-1/2 left-1/4 text-5xl animate-pulse-slow" style="animation-delay: 1.5s;">✨</div>
            <div class="absolute top-1/3 right-1/3 text-6xl animate-bounce-slow" style="animation-delay: 2.5s;">🚀</div>
        </div>

        <!-- Overlay Pattern -->
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px); background-size: 60px 60px;"></div>

        <div class="relative z-10 max-w-6xl mx-auto text-center">
            <!-- Logo with Animation -->
            @if($logo)
                <div class="w-32 h-32 mx-auto mb-8 rounded-3xl shadow-2xl overflow-hidden bg-white p-4 animate-scale-in">
                    <img src="{{ asset('storage/' . $logo) }}" alt="{{ $appName }}" class="w-full h-full object-contain animate-pulse-slow">
                </div>
            @else
                <div class="w-32 h-32 mx-auto mb-8 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-scale-in">
                    <span class="text-6xl animate-wiggle">💰</span>
                </div>
            @endif

            <!-- Main Heading with Gradient Animation -->
            <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-slide-up drop-shadow-2xl">
                Save Smarter with <span class="text-yellow-300 animate-pulse-slow">{{ $appName }}</span>
            </h1>

            <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-4 animate-slide-up drop-shadow-lg" style="animation-delay: 0.1s;">
                {{ $appDescription }}
            </p>

            <p class="text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-slide-up opacity-90 drop-shadow-lg" style="animation-delay: 0.2s;">
                Traditional Ajo meets modern technology. Join thousands achieving their financial dreams! 🌟
            </p>

            <!-- Primary Download Button (Large & Animated) -->
            <div class="mb-8 animate-scale-in" style="animation-delay: 0.3s;">
                @if($androidApkUrl)
                <a href="{{ $androidApkUrl }}" download
                   class="download-btn inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-gray-900 rounded-3xl shadow-2xl text-xl md:text-2xl font-bold">
                    <span class="relative z-10 flex items-center gap-3">
                        <svg class="w-10 h-10 animate-bounce-slow" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z"/>
                        </svg>
                        Download Android App Now!
                        <svg class="w-8 h-8 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                    </span>
                </a>
                @else
                <button disabled class="inline-flex items-center gap-4 px-12 py-6 bg-gray-400 text-gray-700 rounded-3xl shadow-xl text-xl md:text-2xl font-bold opacity-60 cursor-not-allowed">
                    <span>Coming Very Soon! 🚀</span>
                </button>
                @endif
                <div class="mt-4 text-lg font-semibold animate-pulse">
                    ⚡ 100% FREE • No Hidden Charges • Start Saving Today!
                </div>
            </div>

            <!-- Trust Indicators with Animation -->
            <div class="flex flex-wrap justify-center gap-6 text-sm animate-fade-in" style="animation-delay: 0.5s;">
                <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <span class="text-green-300 text-2xl animate-pulse-slow">✓</span>
                    <span class="font-bold text-lg">100% Secure</span>
                </div>
                <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <span class="text-green-300 text-2xl animate-pulse-slow">✓</span>
                    <span class="font-bold text-lg">Free Forever</span>
                </div>
                <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <span class="text-green-300 text-2xl animate-pulse-slow">✓</span>
                    <span class="font-bold text-lg">Trusted Community</span>
                </div>
            </div>
        </div>

        <!-- Animated Scroll Indicator -->
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>
    </section>

    <!-- Real Community Members Section with Images -->
    <section class="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 opacity-5 pointer-events-none">
            <div class="absolute top-10 left-10 text-9xl animate-float">💰</div>
            <div class="absolute bottom-10 right-10 text-9xl animate-float-slow">📊</div>
        </div>

        <div class="max-w-7xl mx-auto px-4 relative z-10">
            <div class="text-center mb-16">
                <div class="inline-block px-6 py-3 bg-purple-100 text-purple-600 rounded-full mb-6 font-bold text-sm animate-pulse-slow">
                    ✨ REAL PEOPLE, REAL RESULTS ✨
                </div>
                <h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
                    Join Our <span class="gradient-text">Thriving Community</span>
                </h2>
                <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto animate-slide-up" style="animation-delay: 0.1s;">
                    See how {{ $appName }} is transforming lives of market women and traders across Nigeria! 🇳🇬
                </p>
            </div>

            <!-- Image Grid with Animations -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                @for($i = 1; $i <= 7; $i++)
                    <div class="image-grid-item relative rounded-3xl overflow-hidden shadow-2xl aspect-square animate-scale-in" style="animation-delay: {{ $i * 0.1 }}s;">
                        <img src="{{ asset('images/' . $i . '.jpg') }}"
                             alt="Community Member {{ $i }}"
                             class="w-full h-full object-cover"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="hidden w-full h-full animate-gradient items-center justify-center">
                            <span class="text-7xl">💰</span>
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                            <div class="text-center">
                                <span class="text-white font-bold text-lg block mb-2">Success Story #{{ $i }}</span>
                                <span class="text-yellow-300 text-sm">⭐⭐⭐⭐⭐</span>
                            </div>
                        </div>
                    </div>
                @endfor
            </div>

            <!-- Second Download CTA -->
            <div class="text-center animate-scale-in">
                @if($androidApkUrl)
                <a href="{{ $androidApkUrl }}" download
                   class="download-btn inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl shadow-2xl text-lg font-bold">
                    <span class="relative z-10 flex items-center gap-3">
                        <span class="text-3xl animate-bounce-slow">📱</span>
                        Start Your Journey - Download Free!
                        <span class="text-3xl animate-bounce-slow">🚀</span>
                    </span>
                </a>
                @endif
                <div class="mt-4 text-gray-600 font-semibold">
                    Join 5,000+ happy savers today! 🎉
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section with Advanced Animations -->
    <section class="py-20 bg-white relative overflow-hidden">
        <!-- Animated Background -->
        <div class="absolute inset-0 opacity-5">
            <div class="absolute top-20 right-20 text-9xl animate-float">🎯</div>
            <div class="absolute bottom-20 left-20 text-9xl animate-float-slow">💎</div>
        </div>

        <div class="max-w-7xl mx-auto px-4 relative z-10">
            <div class="text-center mb-16">
                <div class="inline-block px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 rounded-full mb-6 font-bold text-sm animate-pulse-slow">
                    🌟 POWERFUL FEATURES 🌟
                </div>
                <h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
                    Everything You Need to <span class="gradient-text">Save Smartly</span>
                </h2>
                <p class="text-xl text-gray-600 animate-slide-up" style="animation-delay: 0.1s;">
                    Designed specifically for Nigerian market women and traders
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature Cards with Staggered Animation -->
                @php
                $features = [
                    ['icon' => '🏦', 'title' => 'Group Savings (Ajo)', 'desc' => 'Traditional rotating savings meet modern tech. Save together, prosper together!', 'gradient' => 'from-purple-500 to-purple-600', 'delay' => '0s'],
                    ['icon' => '📊', 'title' => 'Track Every Kobo', 'desc' => 'Real-time tracking of contributions, collections, and payouts. Full transparency!', 'gradient' => 'from-blue-500 to-blue-600', 'delay' => '0.1s'],
                    ['icon' => '🔒', 'title' => '100% Secure', 'desc' => 'Bank-level security protects your money and data. Your trust, our priority!', 'gradient' => 'from-green-500 to-green-600', 'delay' => '0.2s'],
                    ['icon' => '📱', 'title' => 'Super Easy to Use', 'desc' => 'Simple interface in English and local languages. No tech skills needed!', 'gradient' => 'from-yellow-500 to-orange-600', 'delay' => '0.3s'],
                    ['icon' => '💬', 'title' => 'Group Chat', 'desc' => 'Stay connected with your savings group. Discuss, plan, support each other!', 'gradient' => 'from-pink-500 to-rose-600', 'delay' => '0.4s'],
                    ['icon' => '🎯', 'title' => 'Goal Tracking', 'desc' => 'Set savings goals and watch your dreams become reality, step by step!', 'gradient' => 'from-indigo-500 to-purple-600', 'delay' => '0.5s']
                ];
                @endphp

                @foreach($features as $feature)
                <div class="feature-card p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 animate-scale-in" style="animation-delay: {{ $feature['delay'] }};">
                    <div class="w-20 h-20 bg-gradient-to-br {{ $feature['gradient'] }} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-xl animate-pulse-slow hover:animate-bounce-slow">
                        {{ $feature['icon'] }}
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ $feature['title'] }}</h3>
                    <p class="text-gray-600 leading-relaxed">{{ $feature['desc'] }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 animate-gradient text-white relative overflow-hidden">
        <!-- Floating Icons -->
        <div class="absolute inset-0 opacity-20 pointer-events-none">
            <div class="absolute top-10 left-10 text-6xl animate-float">💰</div>
            <div class="absolute top-20 right-20 text-5xl animate-float-slow">📱</div>
            <div class="absolute bottom-10 left-20 text-6xl animate-float" style="animation-delay: 1s;">🎯</div>
            <div class="absolute bottom-20 right-10 text-5xl animate-float-slow" style="animation-delay: 2s;">✨</div>
        </div>

        <div class="max-w-6xl mx-auto px-4 relative z-10">
            <div class="text-center mb-16">
                <div class="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6 font-bold text-sm animate-pulse-slow">
                    ⚡ SIMPLE & FAST ⚡
                </div>
                <h2 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-slide-up">
                    Get Started in 3 Easy Steps
                </h2>
                <p class="text-xl md:text-2xl opacity-90 animate-slide-up" style="animation-delay: 0.1s;">
                    Your financial freedom is just minutes away!
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 mb-12">
                @php
                $steps = [
                    ['num' => '1', 'title' => 'Download & Register', 'desc' => 'Get the app and create your FREE account in under 2 minutes!', 'delay' => '0s'],
                    ['num' => '2', 'title' => 'Join a Group', 'desc' => 'Connect with your ajo group or start fresh with friends!', 'delay' => '0.2s'],
                    ['num' => '3', 'title' => 'Start Saving!', 'desc' => 'Watch your money grow as you save with your community!', 'delay' => '0.4s']
                ];
                @endphp

                @foreach($steps as $step)
                <div class="text-center animate-scale-in" style="animation-delay: {{ $step['delay'] }};">
                    <div class="w-24 h-24 bg-white text-purple-600 rounded-3xl flex items-center justify-center text-4xl font-bold mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform duration-300 animate-pulse-slow">
                        {{ $step['num'] }}
                    </div>
                    <h3 class="text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">{{ $step['title'] }}</h3>
                    <p class="text-lg md:text-xl opacity-90">{{ $step['desc'] }}</p>
                </div>
                @endforeach
            </div>

            <!-- Third Download CTA -->
            <div class="text-center animate-scale-in" style="animation-delay: 0.6s;">
                @if($androidApkUrl)
                <a href="{{ $androidApkUrl }}" download
                   class="download-btn inline-flex items-center gap-4 px-12 py-6 bg-white text-purple-600 rounded-3xl shadow-2xl text-xl md:text-2xl font-bold">
                    <span class="relative z-10 flex items-center gap-3">
                        <span class="text-4xl animate-wiggle">🎉</span>
                        Download Now - Transform Your Life!
                        <span class="text-4xl animate-wiggle">💰</span>
                    </span>
                </a>
                @endif
                <div class="mt-6 text-2xl font-bold animate-pulse">
                    ⚡ No Credit Card Required • 100% Free Forever ⚡
                </div>
            </div>
        </div>
    </section>

    <!-- Final Massive CTA Section -->
    <section class="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute top-20 left-20 text-9xl animate-float">💎</div>
            <div class="absolute bottom-20 right-20 text-9xl animate-float-slow">🚀</div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl animate-pulse-slow">✨</div>
        </div>

        <div class="max-w-5xl mx-auto px-4 text-center relative z-10">
            <div class="text-7xl md:text-8xl mb-8 animate-bounce-slow">💰✨🚀</div>
            <h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
                Ready to Transform Your Financial Future?
            </h2>
            <p class="text-xl md:text-2xl text-gray-600 mb-12 animate-slide-up" style="animation-delay: 0.1s;">
                Join thousands of smart savers achieving their dreams with {{ $appName }}!
                <br>
                <span class="font-bold text-purple-600">Your success story starts today!</span>
            </p>

            @if($androidApkUrl)
            <div class="space-y-6 animate-scale-in" style="animation-delay: 0.2s;">
                <a href="{{ $androidApkUrl }}" download
                   class="download-btn inline-flex items-center gap-5 px-16 py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-full shadow-2xl text-2xl md:text-3xl font-bold">
                    <span class="relative z-10 flex items-center gap-4">
                        <span class="text-5xl animate-bounce-slow">📱</span>
                        GET THE APP NOW!
                        <span class="text-5xl animate-bounce-slow">🎉</span>
                    </span>
                </a>

                <div class="flex flex-wrap justify-center gap-6 text-lg font-bold text-gray-700">
                    <div class="flex items-center gap-2 animate-pulse-slow">
                        <span class="text-3xl">⚡</span>
                        <span>Instant Setup</span>
                    </div>
                    <div class="flex items-center gap-2 animate-pulse-slow" style="animation-delay: 0.5s;">
                        <span class="text-3xl">🔒</span>
                        <span>Bank-Level Security</span>
                    </div>
                    <div class="flex items-center gap-2 animate-pulse-slow" style="animation-delay: 1s;">
                        <span class="text-3xl">💯</span>
                        <span>100% FREE</span>
                    </div>
                </div>
            </div>
            @else
            <div class="text-2xl text-gray-500 font-bold animate-pulse">
                🚀 Launching Very Soon! Stay Tuned! 🚀
            </div>
            @endif
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-12 mb-12">
                <div>
                    <div class="flex items-center gap-3 mb-6">
                        @if($logo)
                            <img src="{{ asset('storage/' . $logo) }}" alt="{{ $appName }}" class="w-12 h-12 object-contain animate-pulse-slow">
                        @else
                            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center animate-pulse-slow">
                                <span class="text-2xl">💰</span>
                            </div>
                        @endif
                        <span class="text-3xl font-bold">{{ $appName }}</span>
                    </div>
                    <p class="text-gray-400 text-lg leading-relaxed">
                        Your trusted partner for community savings and financial growth. 🌟
                    </p>
                </div>

                <div>
                    <h3 class="font-bold mb-6 text-xl">Product</h3>
                    <ul class="space-y-3 text-gray-400">
                        <li><a href="#" class="hover:text-white transition text-lg">Features</a></li>
                        <li><a href="#" class="hover:text-white transition text-lg">How It Works</a></li>
                        <li><a href="#" class="hover:text-white transition text-lg">Download</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-bold mb-6 text-xl">Company</h3>
                    <ul class="space-y-3 text-gray-400">
                        <li><a href="#" class="hover:text-white transition text-lg">About Us</a></li>
                        <li><a href="#" class="hover:text-white transition text-lg">Contact</a></li>
                        <li><a href="#" class="hover:text-white transition text-lg">Support</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-bold mb-6 text-xl">Legal</h3>
                    <ul class="space-y-3 text-gray-400">
                        <li><a href="#" class="hover:text-white transition text-lg">Privacy Policy</a></li>
                        <li><a href="#" class="hover:text-white transition text-lg">Terms of Service</a></li>
                        <li><a href="#" class="hover:text-white transition text-lg">Security</a></li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-gray-800 pt-8 text-center">
                <p class="text-gray-400 text-lg">© {{ date('Y') }} {{ $appName }}. All rights reserved.</p>
                <p class="text-gray-500 mt-2">Built with ❤️ in Nigeria By Harzotech 🇳🇬</p>
            </div>
        </div>
    </footer>
</body>
</html>
