# 🚀 Quick Start Guide - Alajo Savings App

This guide will help you set up the development environment and start building the Alajo savings application.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

```bash
# Check Node.js version (should be 20.x or higher)
node --version

# Check npm version
npm --version

# Check Git
git --version

# Check PostgreSQL (optional for local dev)
psql --version
```

### Required Software
- **Node.js** 20.x LTS or higher ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **VSCode** (recommended) ([Download](https://code.visualstudio.com/))
- **PostgreSQL** 15+ (or use Supabase for cloud) ([Download](https://www.postgresql.org/))
- **Redis** (or use Upstash for cloud) ([Download](https://redis.io/))

---

## 🏗️ Project Initialization

### Step 1: Initialize Monorepo Structure

```bash
# Create the main project directories
mkdir -p apps/web apps/api packages/types packages/utils docs .github/workflows

# Initialize root package.json
npm init -y

# Create workspace configuration
cat > package.json << 'EOF'
{
  "name": "alajo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces",
    "build": "npm run build --workspaces",
    "lint": "npm run lint --workspaces",
    "test": "npm run test --workspaces"
  },
  "devDependencies": {
    "prettier": "^3.3.3",
    "eslint": "^8.57.0"
  }
}
EOF
```

---

## 🎨 Frontend Setup (React + TypeScript + Vite)

### Step 2: Create React App with Vite

```bash
cd apps
npm create vite@latest web -- --template react-ts
cd web

# Install dependencies
npm install

# Install additional packages
npm install react-router-dom @reduxjs/toolkit react-redux
npm install react-hook-form zod @hookform/resolvers
npm install date-fns recharts lucide-react framer-motion
npm install clsx tailwind-merge

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install PWA plugin
npm install -D vite-plugin-pwa
```

### Step 3: Configure Tailwind CSS

```bash
# Update tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
    },
  },
  plugins: [],
}
EOF

# Update src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
EOF
```

### Step 4: Create Folder Structure

```bash
cd src
mkdir -p components/{auth,dashboard,savings,transactions,common}
mkdir -p pages/{auth,dashboard,savings,withdrawal,profile}
mkdir -p hooks store/{slices,api} utils types config assets/images
```

### Step 5: Setup Redux Store

```bash
# Create store configuration
cat > store/index.ts << 'EOF'
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    // Add reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
EOF
```

### Step 6: Create Environment File

```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
VITE_APP_NAME=Alajo
VITE_APP_VERSION=1.0.0
EOF
```

---

## ⚙️ Backend Setup (Node.js + Express + Prisma)

### Step 7: Initialize Backend

```bash
cd ../../
mkdir apps/api && cd apps/api

# Initialize package.json
npm init -y

# Install dependencies
npm install express @prisma/client
npm install bcrypt jsonwebtoken zod
npm install dotenv cors helmet express-rate-limit
npm install multer node-cron bull ioredis
npm install axios resend date-fns

# Install dev dependencies
npm install -D typescript tsx prisma
npm install -D @types/node @types/express @types/bcrypt
npm install -D @types/jsonwebtoken @types/cors @types/multer
npm install -D @types/node-cron eslint
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Step 8: Initialize TypeScript

```bash
npx tsc --init

# Update tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOF
```

### Step 9: Initialize Prisma

```bash
npx prisma init

# Update prisma/schema.prisma with your database schema
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(uuid())
  email           String    @unique
  phone           String?   @unique
  passwordHash    String    @map("password_hash")
  firstName       String    @map("first_name")
  lastName        String    @map("last_name")
  dateOfBirth     DateTime? @map("date_of_birth")
  avatarUrl       String?   @map("avatar_url")
  emailVerified   Boolean   @default(false) @map("email_verified")
  phoneVerified   Boolean   @default(false) @map("phone_verified")
  kycStatus       KycStatus @default(PENDING) @map("kyc_status")
  role            UserRole  @default(USER)
  status          UserStatus @default(ACTIVE)
  twoFactorEnabled Boolean  @default(false) @map("two_factor_enabled")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  lastLoginAt     DateTime? @map("last_login_at")

  savingsPlans    SavingsPlan[]
  transactions    Transaction[]
  paymentMethods  PaymentMethod[]
  withdrawals     Withdrawal[]
  notifications   Notification[]
  auditLogs       AuditLog[]

  @@map("users")
}

enum KycStatus {
  PENDING
  VERIFIED
  REJECTED
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  CLOSED
}

model SavingsPlan {
  id                String          @id @default(uuid())
  userId            String          @map("user_id")
  name              String
  type              SavingsType
  amountPerCycle    Decimal         @map("amount_per_cycle") @db.Decimal(10, 2)
  frequency         Frequency
  startDate         DateTime        @map("start_date")
  endDate           DateTime?       @map("end_date")
  targetAmount      Decimal?        @map("target_amount") @db.Decimal(10, 2)
  currentBalance    Decimal         @default(0) @map("current_balance") @db.Decimal(10, 2)
  status            PlanStatus      @default(ACTIVE)
  autoDebitEnabled  Boolean         @default(false) @map("auto_debit_enabled")
  preferredDebitDay Int?            @map("preferred_debit_day")
  reminderEnabled   Boolean         @default(true) @map("reminder_enabled")
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @updatedAt @map("updated_at")

  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions     Transaction[]
  withdrawals      Withdrawal[]

  @@map("savings_plans")
}

enum SavingsType {
  DAILY
  WEEKLY
  MONTHLY
  CUSTOM
  GOAL_BASED
  GROUP
}

enum Frequency {
  DAILY
  WEEKLY
  MONTHLY
  CUSTOM
}

enum PlanStatus {
  ACTIVE
  PAUSED
  COMPLETED
  CANCELLED
}

model Transaction {
  id                String            @id @default(uuid())
  userId            String            @map("user_id")
  savingsPlanId     String?           @map("savings_plan_id")
  type              TransactionType
  amount            Decimal           @db.Decimal(10, 2)
  currency          String            @default("NGN")
  status            TransactionStatus @default(PENDING)
  paymentMethod     PaymentMethodType @map("payment_method")
  paymentGateway    PaymentGateway?   @map("payment_gateway")
  gatewayReference  String?           @unique @map("gateway_reference")
  description       String?
  metadata          Json?
  processedAt       DateTime?         @map("processed_at")
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")

  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  savingsPlan   SavingsPlan? @relation(fields: [savingsPlanId], references: [id], onDelete: SetNull)

  @@map("transactions")
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  TRANSFER
  REFUND
  FEE
}

enum TransactionStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}

enum PaymentMethodType {
  CARD
  BANK_TRANSFER
  WALLET
  AUTO_DEBIT
}

enum PaymentGateway {
  PAYSTACK
  FLUTTERWAVE
  STRIPE
}

model PaymentMethod {
  id                      String              @id @default(uuid())
  userId                  String              @map("user_id")
  type                    PaymentMethodType
  isDefault               Boolean             @default(false) @map("is_default")
  cardLast4               String?             @map("card_last4")
  cardBrand               String?             @map("card_brand")
  bankName                String?             @map("bank_name")
  accountNumber           String?             @map("account_number")
  accountName             String?             @map("account_name")
  gatewayAuthorizationCode String?            @unique @map("gateway_authorization_code")
  status                  PaymentMethodStatus @default(ACTIVE)
  createdAt               DateTime            @default(now()) @map("created_at")
  updatedAt               DateTime            @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("payment_methods")
}

enum PaymentMethodStatus {
  ACTIVE
  EXPIRED
  REVOKED
}

model Withdrawal {
  id              String           @id @default(uuid())
  userId          String           @map("user_id")
  savingsPlanId   String?          @map("savings_plan_id")
  amount          Decimal          @db.Decimal(10, 2)
  fee             Decimal          @default(0) @db.Decimal(10, 2)
  netAmount       Decimal          @map("net_amount") @db.Decimal(10, 2)
  withdrawalType  WithdrawalType   @map("withdrawal_type")
  destinationType DestinationType  @map("destination_type")
  bankAccountId   String?          @map("bank_account_id")
  status          WithdrawalStatus @default(PENDING)
  reason          String?
  processedAt     DateTime?        @map("processed_at")
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @updatedAt @map("updated_at")

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  savingsPlan SavingsPlan? @relation(fields: [savingsPlanId], references: [id], onDelete: SetNull)

  @@map("withdrawals")
}

enum WithdrawalType {
  INSTANT
  SCHEDULED
}

enum DestinationType {
  BANK_ACCOUNT
  WALLET
}

enum WithdrawalStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}

model Notification {
  id        String           @id @default(uuid())
  userId    String           @map("user_id")
  type      NotificationType
  title     String
  message   String
  data      Json?
  isRead    Boolean          @default(false) @map("is_read")
  sentAt    DateTime?        @map("sent_at")
  createdAt DateTime         @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notifications")
}

enum NotificationType {
  SAVINGS_REMINDER
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  WITHDRAWAL_COMPLETE
  GOAL_ACHIEVED
  SYSTEM
}

model AuditLog {
  id         String   @id @default(uuid())
  userId     String?  @map("user_id")
  action     String
  entityType String   @map("entity_type")
  entityId   String   @map("entity_id")
  oldValues  Json?    @map("old_values")
  newValues  Json?    @map("new_values")
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("audit_logs")
}
EOF
```

### Step 10: Create Backend Folder Structure

```bash
mkdir -p src/{controllers,services,routes,middleware,utils,types,config,jobs}

# Create basic server file
cat > src/server.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Alajo API Server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
EOF
```

### Step 11: Create Environment File

```bash
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
API_VERSION=v1
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/alajo

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=7d

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@alajo.app

# Misc
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Add .env to .gitignore
echo ".env" >> .gitignore
echo "node_modules" >> .gitignore
echo "dist" >> .gitignore
```

### Step 12: Update package.json Scripts

```bash
cat > package.json << 'EOF'
{
  "name": "alajo-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
EOF
```

---

## 🗄️ Database Setup

### Step 13: Set Up Local PostgreSQL

#### Option A: Local PostgreSQL Installation

```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15
createdb alajo

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb alajo

# Set password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'your_password';
\q
```

#### Option B: Using Supabase (Recommended for beginners)

1. Go to [supabase.com](https://supabase.com/)
2. Create a new project
3. Copy the connection string from Settings > Database
4. Update `DATABASE_URL` in `.env`

#### Option C: Using Docker

```bash
# docker-compose.yml in project root
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: alajo
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Start services
docker-compose up -d
```

### Step 14: Run Prisma Migrations

```bash
cd apps/api

# Generate Prisma Client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

---

## 🚀 Running the Application

### Step 15: Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

Your app should now be running at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Prisma Studio**: http://localhost:5555 (if running)

---

## 🧪 Testing the Setup

### Step 16: Test Backend API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"status":"ok","timestamp":"2025-11-13T..."}
```

### Step 17: Test Frontend

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the default Vite + React page.

---

## 📝 Next Steps

Now that your development environment is set up, you can start building features:

### Phase 1: Authentication (Week 1)
1. [ ] Create user registration endpoint
2. [ ] Create login endpoint
3. [ ] Implement JWT authentication
4. [ ] Build registration form (frontend)
5. [ ] Build login form (frontend)
6. [ ] Create protected route wrapper

### Phase 2: User Profile (Week 1-2)
1. [ ] Create profile endpoints (GET, PUT)
2. [ ] Build profile page
3. [ ] Implement file upload for avatar
4. [ ] Add email verification

### Phase 3: Savings Plans (Week 2-3)
1. [ ] Create savings plan endpoints (CRUD)
2. [ ] Build savings plan creation form
3. [ ] Build savings plan list page
4. [ ] Build savings plan details page

### Phase 4: Payments (Week 3-4)
1. [ ] Integrate Paystack
2. [ ] Create payment endpoints
3. [ ] Build payment form
4. [ ] Implement webhook handler
5. [ ] Create transaction history page

### Phase 5: Withdrawals (Week 4-5)
1. [ ] Create withdrawal endpoints
2. [ ] Build withdrawal request form
3. [ ] Implement bank transfer
4. [ ] Build withdrawal history page

### Phase 6: Dashboard & Analytics (Week 5-6)
1. [ ] Create analytics endpoints
2. [ ] Build dashboard with charts
3. [ ] Implement savings progress tracking
4. [ ] Add goal visualization

---

## 🛠️ Useful Commands

### Frontend Commands
```bash
cd apps/web
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Commands
```bash
cd apps/api
npm run dev                  # Start dev server with watch mode
npm run build                # Compile TypeScript
npm run start                # Start production server
npm run prisma:migrate       # Run database migrations
npm run prisma:generate      # Generate Prisma Client
npm run prisma:studio        # Open Prisma Studio
```

### Database Commands
```bash
# Create a new migration
npx prisma migrate dev --name add_new_field

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Apply migrations in production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

## 📚 Documentation Resources

### Official Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Paystack API](https://paystack.com/docs/api/)

### Learning Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Prisma Tutorial](https://www.prisma.io/docs/getting-started)

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Port already in use**
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=5001 npm run dev
```

**Issue: Prisma Client not found**
```bash
# Regenerate Prisma Client
npx prisma generate
```

**Issue: Database connection failed**
```bash
# Check if PostgreSQL is running
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Check connection string in .env
echo $DATABASE_URL
```

**Issue: Node modules issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 You're Ready to Build!

Your development environment is now fully set up. Start building amazing features for Alajo!

### Quick Reference

```bash
# Project structure
alajo/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Node.js backend
├── packages/         # Shared packages
└── docs/             # Documentation

# Start development
Terminal 1: cd apps/api && npm run dev
Terminal 2: cd apps/web && npm run dev

# Access applications
Frontend: http://localhost:5173
Backend: http://localhost:5000
Database UI: npm run prisma:studio (from apps/api)
```

Happy coding! 🚀

