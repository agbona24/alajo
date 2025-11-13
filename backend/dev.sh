#!/bin/bash

echo "🚀 Starting Alajo Development Environment..."
echo ""

# Check if we're in the backend directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "   cd backend && ./dev.sh"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "vendor" ]; then
    echo "📦 Installing PHP dependencies..."
    composer install
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Setting up environment..."
    cp .env.example .env
    php artisan key:generate
fi

echo ""
echo "✅ Starting servers..."
echo ""
echo "📍 Visit: http://localhost:8000"
echo "   (NOT http://localhost:5173 - that's just Vite's dev server)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start Laravel in background
php artisan serve > /dev/null 2>&1 &
LARAVEL_PID=$!

# Wait a moment for Laravel to start
sleep 2

echo "✅ Laravel started (PID: $LARAVEL_PID)"

# Start Vite (this will run in foreground)
echo "✅ Starting Vite..."
echo ""

# Trap Ctrl+C to kill both processes
trap "echo ''; echo 'Stopping servers...'; kill $LARAVEL_PID 2>/dev/null; exit" INT TERM

npm run dev

# If npm run dev exits, kill Laravel
kill $LARAVEL_PID 2>/dev/null
