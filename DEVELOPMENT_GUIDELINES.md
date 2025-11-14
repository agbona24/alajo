# Hajo - Development Guidelines

## Project Overview

**Hajo** is a modern digital ajo (contribution savings) platform that brings traditional Nigerian savings culture into the digital age. The platform enables both personal savings goals and community-based group ajo with a mobile-native experience.

**Slogan**: "Savings Saves Life" 💚

---

## 🎯 Development Philosophy

### UI/UX First Approach

**CRITICAL**: We are focusing on getting the UI/UX 100% complete before moving to backend/API development.

**Why?**
- Perfect the user experience first
- Get all flows and interactions right
- Build with real passbook insights
- Ensure mobile-native feel throughout
- Validate design with potential users

**Workflow**:
1. ✅ Design & build all UI screens
2. ✅ Add animations and interactions
3. ✅ Test user flows end-to-end
4. ⏳ Connect to backend APIs
5. ⏳ Deploy to production

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useContext)
- **PWA**: Service workers, manifest.json
- **Animations**: CSS keyframes, Tailwind transitions

### Backend (Future)
- **Framework**: Laravel 10+
- **Database**: MySQL/PostgreSQL
- **Authentication**: Laravel Sanctum
- **APIs**: RESTful JSON APIs
- **SMS/WhatsApp**: Twilio or similar

---

## 🎨 Design Principles

### 1. Mobile-Native Experience
- Bottom navigation for primary actions
- Touch feedback on all interactive elements (`active:scale-95`)
- iOS safe areas support (`pt-safe`, `pb-safe`)
- Gesture support (swipe, pull-to-refresh)
- Native-like header with back button
- Floating Action Buttons (FAB) for primary actions

### 2. Nigerian Ajo Vibes
- **Language**: Mix of English and Nigerian Pidgin
  - Examples: "Small small, e go plenty!", "Wetin you wan save for?", "No wahala, just results!"
- **Cultural References**: Owambe, kobo, ajo, passbook
- **Real Goals**: iPhone, school fees, rent, wedding, business
- **Trust Elements**: Collector signatures, passbook validation
- **Community Focus**: Save with your people, group accountability

### 3. Visual Design
- **Gradients**: Vibrant purple-to-blue primary gradient
- **Emojis**: Liberal use of emojis for warmth and personality
- **Cards**: Rounded corners (rounded-2xl, rounded-3xl)
- **Shadows**: Soft shadows for depth
- **Animations**: Float, bounce, fade-in, slide-in
- **Colors**: Purple/blue (trust), Green (money/success), Orange (alerts)

### 4. Accessibility
- Clear font sizes (text-base minimum on mobile)
- High contrast text
- Touch targets minimum 44x44px
- Descriptive labels and placeholders
- Error messages in context

---

## 📱 Feature Phases

### Phase 1: Core User Journey (CURRENT)
**Status**: In Progress

#### Completed ✅
- [x] Landing page with ajo vibes
- [x] Onboarding carousel (4 steps)
- [x] Login page (unique aesthetic)
- [x] Register page (green theme)
- [x] Dashboard (mobile-native)
- [x] Savings page (plan list)
- [x] Create Savings Plan (3-step wizard)

#### Next Up 🔨
- [ ] Savings Plan Details page
- [ ] Make Contribution interface
- [ ] User Profile & Settings
- [ ] Payment Methods management

### Phase 2: Complete Savings Experience
- [ ] Transaction History
- [ ] Withdrawal Request
- [ ] Withdrawal Approval flow
- [ ] Digital Passbook view
- [ ] Receipt generation

### Phase 3: Group Ajo Features
- [ ] Create Ajo Group
- [ ] Join Group (invite codes)
- [ ] Group Dashboard
- [ ] Member Management
- [ ] Contribution rotation schedule
- [ ] Collector Dashboard
- [ ] Group passbook view

### Phase 4: Automation & Intelligence
- [ ] Auto daily record logging
- [ ] Missed contribution detection
- [ ] Auto total computation
- [ ] SMS/WhatsApp reminders
- [ ] Payment notifications
- [ ] Withdrawal verification (collector signature)
- [ ] Analytics & insights

### Phase 5: Advanced Features
- [ ] Savings challenges
- [ ] Leaderboards
- [ ] Referral system
- [ ] Rewards & badges
- [ ] Goal milestones
- [ ] Financial tips & education

---

## 📘 Digital Passbook Requirements

### Inspired by Traditional Y-DEE VENTURES Passbook

#### Front Cover Elements
- **Platform Name**: Hajo
- **Slogan**: "Savings Saves Life"
- **Services Listed**:
  - Daily contribution
  - Weekly contribution
  - Monthly contribution
  - Loans (future)
- **Customer Support**: WhatsApp, Phone
- **Account Details**: Bank, Account Number, Account Name

#### Inside Pages (Contribution Tracker)
**Layout**: 31-day monthly view

**Columns**:
- Month
- Year
- Serial No (day 1-31)
- Date
- Amount (₦)
- Naira.Kobo columns
- Signature (collector validation)
- Total

**Features**:
- Left page: Days 1-15
- Right page: Days 16-31
- Monthly total at bottom
- Depositor signature
- Collector signature

#### Saving Account Regulations

1. Report loss of passbook immediately
2. One day's contribution may be deducted from month's total
3. Lost card replacement: ₦200
4. Work days: Monday–Saturday
5. Month ends on last day (no carryover)
6. Verify passbook after payment
7. **Minimum contribution: ₦300**
8. Do not tamper with entries
9. Return card for verification after withdrawal

---

## 🤖 Automation Features to Implement

### 1. Auto Daily Record
- Collector enters amount → app logs date automatically
- No manual date entry needed
- Prevents backdating or future dating

### 2. Missed Day Detection
- Track contribution schedule
- Notify user if they miss any day in a month
- Show missed days in red in passbook view
- Calculate penalties if configured

### 3. Auto Total Computation
- Real-time monthly total calculation
- Display running total
- Show contributions per day/week/month average
- Project completion date based on current pace

### 4. Passbook Summary View
- Digital replica of physical passbook layout
- Month-by-month view
- Print/export to PDF
- Share via WhatsApp

### 5. Collector Dashboard
- View all assigned users
- Daily collection list
- Mark contributions as collected
- Signature pad for verification
- Daily collection summary
- Send reminders to defaulters

### 6. Withdrawal Verification
- Collector must approve withdrawal
- Digital signature required
- OTP verification
- Bank transfer confirmation
- Update passbook automatically

### 7. SMS/WhatsApp Reminders
- Daily reminders to pay ajo
- Missed contribution alerts
- Payout rotation notifications
- Goal milestone celebrations
- Group activity updates

---

## 📂 Project Structure

```
alajo/
├── frontend/                    # Next.js frontend
│   ├── app/
│   │   ├── (auth)/             # Auth pages group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/          # Main dashboard
│   │   ├── savings/            # Savings management
│   │   │   ├── create/         # Create plan
│   │   │   └── [id]/           # Plan details
│   │   ├── transactions/       # Transaction history
│   │   ├── profile/            # User profile
│   │   ├── groups/             # Ajo groups
│   │   │   ├── create/
│   │   │   └── [id]/
│   │   ├── passbook/           # Digital passbook
│   │   ├── onboarding/         # New user onboarding
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── MobileNav.tsx       # Bottom navigation
│   │   ├── AppHeader.tsx       # Native-style header
│   │   └── ...
│   ├── public/
│   │   ├── manifest.json       # PWA manifest
│   │   └── icons/
│   └── package.json
│
├── backend/                     # Laravel backend (future)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   └── migrations/
│   └── routes/
│       └── api.php
│
└── DEVELOPMENT_GUIDELINES.md   # This file
```

---

## 🎯 Page-by-Page Specifications

### 1. Landing Page (/)
**Status**: ✅ Complete

**Elements**:
- Hero with "Na Digital Ajo!" headline
- Floating background animations
- Social proof (10,000+ savers, ₦2.5B+ saved)
- Features section with Pidgin descriptions
- How It Works (4 steps)
- Testimonials (Chioma, Emeka, Aisha)
- CTA sections
- Footer

**Mobile**: Fully responsive with touch feedback

---

### 2. Onboarding (/onboarding)
**Status**: ✅ Complete

**Flow**: 4 swipeable slides
- Slide 1: Welcome (ajo philosophy)
- Slide 2: Goals (real savings targets)
- Slide 3: Tracking (transparency)
- Slide 4: Security (trust)

**Features**:
- Quotes on each slide
- Highlight badges
- Floating animations
- Touch gestures
- Skip option

---

### 3. Login (/login)
**Status**: ✅ Complete

**Theme**: Purple/blue gradient
**Elements**:
- Floating coins animation
- Animated badge with ping
- Email & password fields
- Show/hide password
- Remember me checkbox
- Forgot password link
- Register link

---

### 4. Register (/register)
**Status**: ✅ Complete

**Theme**: Green/teal gradient (different from login)
**Elements**:
- Full name, email, phone, password
- Emoji labels (👤, 📧, 📱, 🔐)
- Show/hide on both password fields
- Terms & Privacy badge
- Login link

---

### 5. Dashboard (/dashboard)
**Status**: ✅ Complete (mobile-first)

**Elements**:
- Gradient header with welcome message
- Horizontal scrolling stats cards
- Quick actions grid
- Recent transactions
- Savings plans preview
- Mobile navigation

---

### 6. Savings (/savings)
**Status**: ✅ Complete

**Elements**:
- Summary cards (total saved, target, active plans)
- Plan cards with progress bars
- FAB to create new plan
- Mobile horizontal scroll for stats

---

### 7. Create Savings Plan (/savings/create)
**Status**: ✅ Complete

**Flow**: 3-step wizard
- Step 1: Type (Personal/Group), Name, Emoji
- Step 2: Target, Frequency, Duration
- Step 3: Review & Create

**Features**:
- Progress bar
- Emoji selector (16 options)
- Quick amount buttons
- Real-time contribution calculation
- Pro tips
- Nigerian Pidgin labels

---

### 8. Savings Plan Details (/savings/[id])
**Status**: ⏳ Next

**Must Have**:
- Plan hero card (gradient, emoji, name)
- Progress bar with percentage
- Current vs Target amounts
- Contribution frequency badge
- Recent contributions timeline
- Quick actions: Contribute, Withdraw, Edit, Share
- Charts: Daily/Weekly/Monthly view
- Milestones tracker

**Nice to Have**:
- Projected completion date
- Savings streak
- Achievement badges
- Comparison with similar goals

---

### 9. Make Contribution (/savings/[id]/contribute)
**Status**: ⏳ Pending

**Elements**:
- Amount input (large, centered)
- Quick amount suggestions
- Payment method selector
- Add note (optional)
- Confirmation screen
- Success animation (confetti, celebration)
- Receipt view
- Share achievement

---

### 10. Transaction History (/transactions)
**Status**: ⏳ Pending

**Elements**:
- Filter by: Date range, Type, Plan
- Search bar
- Transaction cards (date, amount, plan, status)
- Download as PDF/CSV
- Receipt view for each transaction
- Monthly summaries

---

### 11. Profile & Settings (/profile)
**Status**: ⏳ Pending

**Sections**:
- Profile Photo & Name
- Personal Info (email, phone, address)
- Security (password, 2FA, biometric)
- Notifications preferences
- Payment methods
- Language preference
- Help & Support
- Privacy Policy, Terms
- Logout

---

### 12. Digital Passbook (/passbook)
**Status**: ⏳ Pending

**Must Replicate Physical Passbook**:
- Front cover design
- Monthly pages (31 days)
- Contribution columns
- Signature section
- Monthly totals
- Account regulations
- Export to PDF
- Print view

---

### 13. Withdrawal Request (/withdraw)
**Status**: ⏳ Pending

**Flow**:
- Select plan to withdraw from
- Choose amount (partial/full)
- Select bank account
- Reason (optional)
- Collector approval required
- Track status (pending → approved → completed)
- Receive confirmation

---

### 14. Create Ajo Group (/groups/create)
**Status**: ⏳ Pending

**Elements**:
- Group name & description
- Contribution amount (fixed)
- Frequency
- Number of members
- Payout rotation schedule
- Invite members (phone, email, link)
- Group rules configuration
- Admin selection

---

### 15. Group Details (/groups/[id])
**Status**: ⏳ Pending

**Elements**:
- Group card (name, members, total saved)
- Member list with contribution status
- Payout schedule/rotation
- Group passbook
- Chat/announcements
- Admin controls (if admin)

---

### 16. Collector Dashboard (/collector)
**Status**: ⏳ Pending

**Elements**:
- Today's collections list
- Mark as collected
- Digital signature pad
- Daily summary
- Send reminders
- Defaulters list
- Collection history

---

## 🎨 Component Library

### Reusable Components

#### MobileNav
- Bottom navigation
- Active state with floating effect
- Icons: Home, Savings, Transactions, Profile
- Z-index: 50

#### AppHeader
- Native-style header
- Back button (optional)
- Title & subtitle
- Action button (optional)
- Gradient background option

#### Cards
- PlanCard (savings plan)
- TransactionCard (transaction item)
- MemberCard (group member)
- StatCard (statistics)

#### Forms
- FormInput (text, email, tel, number)
- FormTextarea
- FormSelect
- FormCheckbox
- FormRadio

#### Buttons
- PrimaryButton (gradient)
- SecondaryButton (outline)
- FAB (floating action button)
- IconButton

#### Modals
- BottomSheet (mobile)
- CenterModal (desktop)
- FullScreenModal

---

## 🧪 Testing Checklist

### Before Backend Integration

- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] All touch feedback working
- [ ] Animations smooth (60fps)
- [ ] Forms validate correctly
- [ ] Navigation flows work
- [ ] Back button behavior correct
- [ ] Bottom nav persists on right pages
- [ ] PWA installable
- [ ] Offline mode works
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Success states with animations

---

## 📝 Code Standards

### TypeScript
- Use interfaces for props
- Avoid `any` type
- Use enums for constants
- Type all function parameters and returns

### React
- Use functional components
- Use hooks (useState, useEffect, useContext)
- Extract reusable logic to custom hooks
- Keep components focused (single responsibility)

### CSS/Tailwind
- Mobile-first approach
- Use design system classes
- Custom animations in globals.css
- Avoid inline styles (use Tailwind)

### File Naming
- Components: PascalCase (e.g., `MobileNav.tsx`)
- Pages: lowercase (e.g., `page.tsx`)
- Utils: camelCase (e.g., `formatCurrency.ts`)

### Git Commits
- Use descriptive commit messages
- Include emoji for context (🎨, 🐛, ✨, 📱)
- Reference feature/issue if applicable

---

## 🚀 Deployment Strategy

### Frontend (Vercel)
1. Push to GitHub
2. Vercel auto-deploys
3. Environment variables in Vercel dashboard
4. Custom domain configuration

### Backend (Future)
1. Laravel Forge or DigitalOcean
2. Database migrations
3. Queue worker for notifications
4. CORS configuration for frontend

---

## 📞 Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Laravel: https://laravel.com/docs

### Design Inspiration
- Traditional passbooks (Y-DEE VENTURES style)
- Nigerian fintech apps (Kuda, PiggyVest)
- Native mobile apps (iOS/Android patterns)

---

## 🎯 Success Metrics

### UI/UX Phase
- All pages built and interactive
- Mobile-native feel achieved
- User testing completed
- Design approved

### Backend Integration Phase
- API endpoints working
- Authentication flow complete
- Data persistence working
- Notifications sending

### Launch Phase
- 100 beta users onboarded
- 10 active ajo groups
- ₦1M+ in savings
- 95%+ positive feedback

---

## 🤝 Contributing

When adding new features:
1. Check this guideline first
2. Maintain ajo vibes and Nigerian context
3. Keep mobile-native feel
4. Add animations where appropriate
5. Test on mobile devices
6. Update this document if needed

---

**Remember**: "Small small, e go plenty!" - Build consistently, test thoroughly, and deliver quality. 💪💚

---

**Last Updated**: 2024
**Version**: 1.0
**Maintained By**: Hajo Development Team
