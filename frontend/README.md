# Hajo Frontend - Next.js PWA

Modern, mobile-first Progressive Web App for Hajo savings platform.

## 🚀 Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ PWA Support (installable, offline-capable)
- ✅ Mobile-first responsive design
- ✅ Beautiful animations
- ✅ Optimized for performance

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ installed
- Laravel backend running on port 8000

### Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

## 📱 PWA Features

The app includes:
- Service worker for offline support
- App manifest for installation
- Mobile-optimized UI
- Push notification support (coming soon)

## 🔧 Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🌐 Deployment to Vercel

### One-Click Deploy

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure environment variables
6. Deploy!

### Manual Deploy

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel
npm install -g vercel
vercel
```

## 📁 Project Structure

```
frontend/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   ├── globals.css      # Global styles
│   ├── login/           # Login page (coming)
│   ├── register/        # Register page (coming)
│   └── dashboard/       # User dashboard (coming)
├── public/              # Static assets
│   └── manifest.json    # PWA manifest
├── next.config.js       # Next.js config
├── tailwind.config.ts   # Tailwind config
└── package.json         # Dependencies
```

## 🔗 API Integration

The app connects to Laravel backend at:
- Development: `http://localhost:8000/api`
- Production: `https://api.yourdomain.com/api`

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

## 🎯 Coming Soon

- [x] Landing page
- [ ] Authentication pages (login/register)
- [ ] User dashboard
- [ ] Savings management
- [ ] Transactions
- [ ] Withdrawals
- [ ] Digital passbook
- [ ] Analytics charts

## 🤝 Backend Integration

This frontend works with the Laravel backend located in `/backend` directory.

Make sure Laravel is running on port 8000 before starting the frontend.

## 📝 License

Proprietary - All rights reserved

---

**Need help?** Check the main project README in the root directory.
