# 🏦 Alajo - Contribution Savings & Withdrawal Platform

**A modern, full-featured savings application with daily, weekly, and monthly contribution plans.**

---

## 🎯 What is Alajo?

Alajo (meaning "savings" in Yoruba) is a comprehensive digital savings platform that helps users:
- Save money on flexible schedules (daily, weekly, monthly)
- Track savings progress with beautiful analytics
- Withdraw funds anytime with instant or scheduled options
- Join group savings (Ajo/Esusu) with friends and family
- Achieve financial goals with automated reminders and gamification

---

## ✨ Key Features

### Core Features
- ✅ **Flexible Savings Plans** - Daily, weekly, monthly, or custom schedules
- ✅ **Goal-Based Savings** - Set targets and track progress
- ✅ **Automated Deductions** - Set it and forget it
- ✅ **Instant Withdrawals** - Access your money anytime
- ✅ **Group Savings (Ajo)** - Traditional rotating savings with friends
- ✅ **Multiple Payment Methods** - Cards, bank transfers, USSD

### Amazing Features
- 🤖 **Smart Savings Advisor** - AI suggests optimal savings plans
- 🎯 **Goal Progress Tracking** - Visual progress with charts
- 🏆 **Gamification** - Badges, streaks, and achievements
- 📊 **Analytics Dashboard** - Insights into your savings behavior
- 🔔 **Smart Reminders** - Never miss a savings day
- 💰 **Round-up Savings** - Save the change from purchases
- 👥 **Family Pools** - Save together towards shared goals

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with Laravel Vite Plugin
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Deployment**: Static build (cPanel-friendly)

### Backend
- **Framework**: Laravel 12 (PHP 8.2+)
- **Authentication**: Laravel Sanctum (SPA authentication)
- **ORM**: Eloquent
- **API**: RESTful with JSON responses
- **Jobs**: Laravel Queue + Scheduler
- **Validation**: Form Requests + Rules
- **Deployment**: cPanel shared hosting or VPS

### Database
- **Primary**: MySQL 8.0 / MariaDB 10.6+
- **Cache**: File-based (Laravel Cache)
- **Storage**: Local or Cloudinary for uploads

### Payment Integration
- **Gateways**: Paystack (primary), Flutterwave (backup)
- **Verification**: Webhook signature validation
- **Security**: PCI DSS compliant (tokenized)

---

## 📁 Project Structure

```
alajo/
├── backend/              # Laravel + React integrated application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # API controllers
│   │   │   └── Middleware/    # Custom middleware
│   │   ├── Models/            # Eloquent models
│   │   ├── Services/          # Business logic
│   │   └── Jobs/              # Background jobs
│   ├── database/
│   │   └── migrations/        # Database migrations
│   ├── routes/
│   │   ├── api.php           # API routes
│   │   └── web.php           # Web routes (SPA)
│   ├── resources/
│   │   ├── js/               # React application
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── pages/        # Page components
│   │   │   │   ├── admin/    # Admin dashboard pages
│   │   │   │   ├── analytics/ # Analytics page
│   │   │   │   ├── auth/     # Authentication pages
│   │   │   │   ├── dashboard/ # User dashboard
│   │   │   │   ├── landing/  # Landing page
│   │   │   │   ├── profile/  # Profile page
│   │   │   │   ├── savings/  # Savings pages
│   │   │   │   ├── settings/ # Settings page
│   │   │   │   ├── transactions/ # Transactions page
│   │   │   │   └── withdrawal/ # Withdrawal pages
│   │   │   ├── store/        # Redux store
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   └── app.tsx       # React entry point
│   │   ├── css/              # Tailwind CSS
│   │   └── views/            # Blade templates
│   ├── package.json          # Node dependencies
│   ├── composer.json         # PHP dependencies
│   └── vite.config.ts        # Vite configuration
│
├── docs/                 # Documentation
├── PROJECT_PLAN.md       # Detailed project plan
├── ARCHITECTURE.md       # System architecture
├── TECH_STACK.md         # Technology decisions
└── CPANEL_DEPLOYMENT.md  # cPanel deployment guide
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **PHP** 8.2 or higher ([Download](https://www.php.net/downloads))
- **Composer** 2.x ([Download](https://getcomposer.org/))
- **MySQL** 8.0+ or **MariaDB** 10.6+ ([Download](https://www.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/))

### Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/alajo.git
cd alajo/backend
```

#### Step 2: Install PHP Dependencies

```bash
composer install
```

#### Step 3: Install Node Dependencies

```bash
npm install
```

#### Step 4: Environment Configuration

```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Step 5: Configure Database

Edit the `.env` file and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=alajo
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create the database:

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE alajo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Step 6: Run Database Migrations

```bash
php artisan migrate
```

#### Step 7: Start Development Servers

**Option A: Use the dev script (Recommended)**
```bash
./dev.sh
```
This starts both Laravel and Vite automatically.

**Option B: Manual start (Two terminals)**

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server (React Frontend):**
```bash
npm run dev
```

#### Step 8: Access the Application

Open your browser and visit:

- **Application**: http://localhost:8000 ⭐ **← Visit THIS URL**
- **Backend API**: http://localhost:8000/api

⚠️ **IMPORTANT:**
- Visit **http://localhost:8000** (Laravel serves React + API)
- Do NOT visit http://localhost:5173 (that's just Vite's dev server)
- Vite runs in the background for hot-reloading only

### 🐛 Troubleshooting

**Problem: I see "Vite + Laravel" default page**
- **Solution**: You're visiting the wrong URL. Close http://localhost:5173 and visit http://localhost:8000

**Problem: Blank page or errors**
```bash
# Clear cache
php artisan optimize:clear

# Restart servers
# Terminal 1: php artisan serve
# Terminal 2: npm run dev
```

**Problem: "Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 🎉 You're Ready!

The application should now be running with:
- ✅ Laravel backend serving the API
- ✅ React frontend with hot module replacement
- ✅ Database connected and migrated
- ✅ Tailwind CSS configured
- ✅ Redux store ready

### 📝 Additional Configuration

#### Sanctum Configuration (for API authentication)

The app uses Laravel Sanctum for SPA authentication. Update your `.env`:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:8000,localhost:5173
SESSION_DOMAIN=localhost
```

#### Mail Configuration (for email notifications)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@alajo.app
MAIL_FROM_NAME="${APP_NAME}"
```

### 🏗️ Building for Production

When you're ready to deploy:

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

The built assets will be placed in `public/build/` and automatically loaded by Laravel.

For detailed deployment instructions, see [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PROJECT_PLAN.md](./PROJECT_PLAN.md) | Complete project plan with features, phases, and timeline |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture diagrams and technical design |
| [TECH_STACK.md](./TECH_STACK.md) | Technology stack decisions and comparisons |
| [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) | Step-by-step cPanel deployment guide |
| [QUICK_START.md](./QUICK_START.md) | Developer setup and getting started |

---

## 🌟 Why This Stack?

### React + Laravel + MySQL on cPanel

✅ **Cost-Effective**: Deploy on $5/month shared hosting
✅ **Easy Deployment**: Simple FTP/file upload
✅ **Modern Frontend**: React with TypeScript
✅ **Powerful Backend**: Laravel's elegant syntax and features
✅ **Scalable**: Start small, grow to VPS/cloud when needed
✅ **Well-Supported**: Both React and Laravel have huge communities
✅ **Mobile-Ready**: Responsive design + PWA capabilities

---

## 🎯 Development Phases

### Phase 1: MVP (4-6 weeks) ⚡
- User authentication and profiles
- Basic savings plans (daily, weekly, monthly)
- Manual deposits via Paystack
- Transaction history
- Simple dashboard
- Mobile-responsive UI

### Phase 2: Enhanced Features (3-4 weeks) 🚀
- Goal-based savings with progress tracking
- Analytics and charts
- Email/SMS notifications
- Automated recurring payments
- Withdrawal functionality
- KYC verification

### Phase 3: Advanced Features (4-6 weeks) 💎
- Group savings (Ajo) functionality
- Gamification (badges, streaks, leaderboards)
- Referral program
- Auto-save rules
- Budget planner
- Admin dashboard

### Phase 4: Mobile & Scale (4-6 weeks) 📱
- Progressive Web App (PWA)
- APK generation
- Performance optimization
- Load testing
- Security audit
- App store deployment

---

## 💰 Estimated Hosting Costs

### Starter (0-1,000 users)
```
Shared cPanel hosting: $5-10/month
Domain name: $12/year
SMS service: $10-20/month
Email service: Included with hosting

Total: ~$20-40/month
```

### Growth (1,000-10,000 users)
```
VPS with cPanel: $20-40/month
Domain + SSL: $15/year
SMS service: $50-100/month
Email service: $20/month
Cloudinary: $10/month

Total: ~$100-170/month
```

### Scale (10,000+ users)
```
Cloud VPS: $80-200/month
Domain + SSL: $15/year
SMS service: $200-500/month
Email service: $80/month
CDN + Storage: $50/month
Monitoring: $80/month

Total: ~$490-910/month
```

---

## 🔐 Security Features

- 🔒 **JWT Authentication** - Secure token-based auth
- 🛡️ **Laravel Sanctum** - SPA authentication
- 🔑 **Password Hashing** - Bcrypt with salt
- ✅ **Input Validation** - Server-side validation
- 🚫 **SQL Injection Protection** - Eloquent ORM
- 🌐 **CORS Configuration** - Proper cross-origin setup
- 📝 **Audit Logging** - Track all user actions
- 🔐 **2FA Support** - Two-factor authentication ready
- 💳 **PCI Compliance** - Never store card details
- ✅ **Webhook Verification** - Paystack signature validation

---

## 📊 Success Metrics

### MVP Success
- 100+ registered users in first month
- 50+ active savings plans
- 90%+ transaction success rate
- <2s page load time

### Long-term Success
- 10,000+ monthly active users in 6 months
- ₦10M+ total value locked
- 70%+ user retention (30 days)
- 4.5+ app rating

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register    # Register new user
POST   /api/auth/login        # Login user
POST   /api/auth/logout       # Logout user
GET    /api/auth/me           # Get current user
```

### Savings Endpoints

```
GET    /api/savings           # List all savings plans
POST   /api/savings           # Create new savings plan
GET    /api/savings/{id}      # Get single savings plan
PUT    /api/savings/{id}      # Update savings plan
DELETE /api/savings/{id}      # Delete savings plan
```

### Transaction Endpoints

```
GET    /api/transactions      # List all transactions
GET    /api/transactions/{id} # Get single transaction
POST   /api/transactions      # Create deposit
```

### Withdrawal Endpoints

```
POST   /api/withdrawals       # Request withdrawal
GET    /api/withdrawals       # List withdrawals
GET    /api/withdrawals/{id}  # Get withdrawal status
```

For complete API documentation, run the application and visit:
```
http://localhost:8000/api/documentation
```

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
php artisan test
```

---

## 📱 Mobile App

### Progressive Web App (PWA)
The web app is installable as a PWA:
1. Visit the website on mobile
2. Tap "Add to Home Screen"
3. App installs like a native app

### Future: React Native
A native mobile app using React Native is planned for Phase 4, sharing the same API.

---

## 🌍 Roadmap

- [x] Project planning and architecture
- [x] Technology stack selection
- [x] Frontend UI/UX design and implementation
- [x] User dashboard and pages (Dashboard, Savings, Transactions, Withdrawals, Analytics, Profile, Settings)
- [x] Admin dashboard and user management
- [ ] Backend API development (In Progress)
- [ ] Database migrations and models
- [ ] Authentication system
- [ ] Payment integration (Paystack)
- [ ] Testing and quality assurance
- [ ] Beta testing
- [ ] Public launch
- [ ] Group savings feature
- [ ] Mobile app development (PWA/APK)
- [ ] International expansion

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Name]
- **Frontend Developer**: [Name]
- **UI/UX Designer**: [Name]

---

## 📞 Support

- **Email**: support@alajo.app
- **Website**: https://alajo.app
- **Documentation**: https://docs.alajo.app

---

## 🙏 Acknowledgments

- Inspired by successful Nigerian fintech companies: Piggyvest, Cowrywise
- Built with amazing open-source technologies
- Thanks to the Laravel and React communities

---

## ⭐ Star Us!

If you find this project useful, please give it a star! It helps us reach more developers and grow the community.

---

**Built with ❤️ for financial inclusion and savings culture in Africa**

---

## 🎉 Let's Build Together!

Ready to revolutionize savings in Africa? Let's make Alajo the #1 savings platform!

```
   ___    __          _
  / _ |  / /___ __ _ (_)___
 / __ | / // _ / // // // _ \
/_/ |_|/_/ \___/\_,_//_/ \___/

  💰 Save Today, Prosper Tomorrow
```

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0-alpha
**Status**: UI Development Complete - Backend API In Progress
