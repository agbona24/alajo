# 🏗️ Alajo - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────┬──────────────────┬────────────────────────────┤
│   Web Browser   │   Mobile PWA     │   Native Apps (Phase 2)   │
│   (React)       │   (React + PWA)  │   (React Native)          │
└────────┬────────┴────────┬─────────┴──────────┬─────────────────┘
         │                 │                     │
         └─────────────────┼─────────────────────┘
                           │
                    HTTPS/REST API
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Load Balancer (Nginx/AWS ALB)                             │ │
│  │  - SSL Termination                                         │ │
│  │  - Rate Limiting                                           │ │
│  │  - Request Routing                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │           Node.js + Express/Fastify Servers                 ││
│  │                                                             ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ││
│  │  │Auth Service  │  │Savings Svc   │  │Payment Svc   │    ││
│  │  │- JWT         │  │- Plans       │  │- Gateway     │    ││
│  │  │- 2FA         │  │- Deposits    │  │- Webhooks    │    ││
│  │  │- Sessions    │  │- Analytics   │  │- Refunds     │    ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘    ││
│  │                                                             ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ││
│  │  │Withdrawal    │  │Notification  │  │Analytics     │    ││
│  │  │Service       │  │Service       │  │Service       │    ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘    ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    MIDDLEWARE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │Authentication│  │Authorization │  │  Validation  │          │
│  │  Middleware  │  │  Middleware  │  │  Middleware  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │Rate Limiting │  │    Logging   │  │Error Handling│          │
│  │  Middleware  │  │  Middleware  │  │  Middleware  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      DATA LAYER                                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                PostgreSQL (Primary DB)                     │ │
│  │  - User data                                               │ │
│  │  - Savings plans                                           │ │
│  │  - Transactions                                            │ │
│  │  - Audit logs                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                Redis (Cache & Sessions)                    │ │
│  │  - Session storage                                         │ │
│  │  - Rate limiting counters                                  │ │
│  │  - Temporary data (OTPs, etc.)                            │ │
│  │  - Job queues                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              S3/Cloudinary (File Storage)                  │ │
│  │  - Profile pictures                                        │ │
│  │  - KYC documents                                           │ │
│  │  - Transaction receipts                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                  BACKGROUND JOBS LAYER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           Cron Jobs / Bull Queue (Redis-backed)            │ │
│  │                                                            │ │
│  │  - Daily savings deductions                               │ │
│  │  - Payment reminders                                      │ │
│  │  - Scheduled withdrawals                                  │ │
│  │  - Analytics calculations                                 │ │
│  │  - Report generation                                      │ │
│  │  - Email/SMS sending queue                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                               │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Paystack   │  │ Flutterwave │  │   Stripe    │            │
│  │  (Payment)  │  │  (Payment)  │  │  (Payment)  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  SendGrid   │  │   Twilio    │  │    Termii   │            │
│  │   (Email)   │  │    (SMS)    │  │    (SMS)    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Sentry    │  │  Mixpanel   │  │Google Analyt│            │
│  │ (Monitoring)│  │ (Analytics) │  │  (Analytics)│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

### User Authentication Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ 1. POST /api/auth/login
     │    { email, password }
     ▼
┌────────────┐
│ API Server │
└─────┬──────┘
      │
      │ 2. Validate credentials
      ▼
┌─────────────┐
│ PostgreSQL  │
└──────┬──────┘
       │
       │ 3. User found
       ▼
┌────────────┐
│ JWT Service│ 4. Generate access + refresh tokens
└─────┬──────┘
      │
      │ 5. Store refresh token in Redis
      ▼
┌────────┐
│ Redis  │
└────┬───┘
     │
     │ 6. Return tokens + user data
     ▼
┌─────────┐
│ Client  │ 7. Store tokens (localStorage/secure)
└─────────┘
```

### Automated Savings Flow

```
┌──────────────┐
│  Cron Job    │ Runs daily at 6:00 AM
│ (Daily Saver)│
└──────┬───────┘
       │
       │ 1. Find all active plans due today
       ▼
┌─────────────┐
│ PostgreSQL  │ SELECT * FROM savings_plans
└──────┬──────┘ WHERE status = 'active'
       │        AND next_debit_date = TODAY
       │
       │ 2. For each plan
       ▼
┌─────────────────┐
│ Payment Service │
└────────┬────────┘
         │
         │ 3. Get user's default payment method
         ▼
┌─────────────┐
│ PostgreSQL  │
└──────┬──────┘
       │
       │ 4. Initiate charge via Paystack
       ▼
┌──────────────┐
│   Paystack   │ 5. Process payment
└──────┬───────┘
       │
       │ 6. Payment successful
       ▼
┌─────────────────┐
│Transaction Svc  │ 7. Create transaction record
└────────┬────────┘
         │
         │ 8. Update savings plan balance
         ▼
┌─────────────┐
│ PostgreSQL  │ UPDATE savings_plans
└──────┬──────┘ SET current_balance += amount
       │
       │ 9. Queue notification
       ▼
┌──────────────┐
│ Notification │ 10. Send email/SMS/push
│   Service    │     "₦500 saved successfully!"
└──────────────┘
```

### Withdrawal Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. POST /api/withdrawals
     │    { amount, type: "instant", bank_account_id }
     ▼
┌─────────────────┐
│ API Server      │
│ (Middleware)    │
└────────┬────────┘
         │
         │ 2. Authenticate user (JWT)
         │ 3. Validate request
         ▼
┌──────────────────┐
│Withdrawal Service│
└────────┬─────────┘
         │
         │ 4. Check user balance
         ▼
┌─────────────┐
│ PostgreSQL  │ SELECT SUM(current_balance)
└──────┬──────┘ FROM savings_plans
       │        WHERE user_id = ?
       │
       │ 5. Balance sufficient
       ▼
┌──────────────────┐
│Withdrawal Service│ 6. Calculate fees (if instant)
└────────┬─────────┘    amount: 10,000
         │               fee: 200 (2%)
         │               net: 9,800
         │
         │ 7. Create withdrawal record
         ▼
┌─────────────┐
│ PostgreSQL  │ INSERT INTO withdrawals
└──────┬──────┘ (user_id, amount, fee, status: 'processing')
       │
       │ 8. Initiate bank transfer
       ▼
┌──────────────┐
│  Paystack    │ POST /transferrecipient
│  Transfer    │ POST /transfer
└──────┬───────┘
       │
       │ 9. Transfer initiated
       ▼
┌──────────────────┐
│Withdrawal Service│ 10. Update withdrawal status
└────────┬─────────┘     status: 'completed'
         │
         │ 11. Deduct from savings balance
         ▼
┌─────────────┐
│ PostgreSQL  │ UPDATE savings_plans
└──────┬──────┘ SET current_balance -= amount
       │
       │ 12. Create transaction record
       ▼
┌─────────────┐
│ PostgreSQL  │ INSERT INTO transactions
└──────┬──────┘ (type: 'withdrawal', amount, status: 'completed')
       │
       │ 13. Send notification
       ▼
┌──────────────┐
│ Notification │ Email: "Your withdrawal of ₦9,800 is complete!"
│   Service    │
└──────────────┘
```

---

## Database Architecture

### Entity Relationship Diagram (ERD)

```
┌──────────────────┐
│      USERS       │
│──────────────────│
│ id (PK)          │───┐
│ email            │   │
│ phone            │   │
│ password_hash    │   │
│ kyc_status       │   │
│ role             │   │
│ created_at       │   │
└──────────────────┘   │
                       │
                       │ 1:N
                       │
       ┌───────────────┴──────────────────┐
       │                                  │
       │                                  │
┌──────▼──────────────┐         ┌────────▼────────────┐
│   SAVINGS_PLANS     │         │  PAYMENT_METHODS    │
│─────────────────────│         │─────────────────────│
│ id (PK)             │───┐     │ id (PK)             │
│ user_id (FK)        │   │     │ user_id (FK)        │
│ name                │   │     │ type                │
│ type                │   │     │ is_default          │
│ amount_per_cycle    │   │     │ card_last4          │
│ frequency           │   │     │ bank_name           │
│ target_amount       │   │     │ status              │
│ current_balance     │   │     └─────────────────────┘
│ status              │   │
│ created_at          │   │
└─────────────────────┘   │
                          │
                          │ 1:N
                          │
                    ┌─────▼──────────────┐
                    │   TRANSACTIONS     │
                    │────────────────────│
                    │ id (PK)            │
                    │ user_id (FK)       │
                    │ savings_plan_id(FK)│
                    │ type               │
                    │ amount             │
                    │ status             │
                    │ payment_method     │
                    │ gateway_reference  │
                    │ created_at         │
                    └────────────────────┘

┌──────────────────┐
│  GROUP_SAVINGS   │
│──────────────────│
│ id (PK)          │───┐
│ name             │   │
│ creator_id (FK)  │   │
│ total_members    │   │
│ contribution_amt │   │
│ frequency        │   │
│ rotation_order   │   │
│ status           │   │
└──────────────────┘   │
                       │ 1:N
                       │
                ┌──────▼──────────────┐
                │  GROUP_MEMBERS      │
                │─────────────────────│
                │ id (PK)             │
                │ group_id (FK)       │
                │ user_id (FK)        │
                │ position            │
                │ total_contributed   │
                │ has_received        │
                │ status              │
                └─────────────────────┘

┌──────────────────┐
│   WITHDRAWALS    │
│──────────────────│
│ id (PK)          │
│ user_id (FK)     │
│ savings_plan_id  │
│ amount           │
│ fee              │
│ net_amount       │
│ withdrawal_type  │
│ status           │
│ processed_at     │
└──────────────────┘

┌──────────────────┐
│  NOTIFICATIONS   │
│──────────────────│
│ id (PK)          │
│ user_id (FK)     │
│ type             │
│ title            │
│ message          │
│ is_read          │
│ sent_at          │
└──────────────────┘

┌──────────────────┐
│   AUDIT_LOGS     │
│──────────────────│
│ id (PK)          │
│ user_id (FK)     │
│ action           │
│ entity_type      │
│ entity_id        │
│ old_values       │
│ new_values       │
│ ip_address       │
│ created_at       │
└──────────────────┘
```

---

## Security Architecture

### Multi-Layer Security

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: Network Security                 │
│  - Cloudflare DDoS protection                               │
│  - WAF (Web Application Firewall)                           │
│  - SSL/TLS certificates                                      │
│  - IP whitelisting for admin endpoints                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                 LAYER 2: Application Security                │
│  - Rate limiting (100 req/min per IP)                       │
│  - CORS policies                                            │
│  - Helmet.js security headers                               │
│  - Input validation (Zod/Joi)                               │
│  - XSS protection                                           │
│  - CSRF tokens                                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              LAYER 3: Authentication & Authorization         │
│  - JWT access tokens (15 min expiry)                        │
│  - Refresh tokens (7 days expiry)                           │
│  - 2FA for sensitive operations                             │
│  - Role-based access control (RBAC)                         │
│  - Session management                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  LAYER 4: Data Security                      │
│  - Encryption at rest (AES-256)                             │
│  - Encryption in transit (TLS 1.3)                          │
│  - Password hashing (bcrypt, cost: 12)                      │
│  - PII data masking in logs                                 │
│  - Database access controls                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                LAYER 5: Payment Security                     │
│  - PCI DSS Level 1 compliance                               │
│  - Never store card details (tokenization)                  │
│  - Webhook signature verification                           │
│  - 3D Secure (3DS) authentication                           │
│  - Transaction fraud detection                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│            LAYER 6: Monitoring & Incident Response           │
│  - Real-time error tracking (Sentry)                        │
│  - Audit logs for all actions                               │
│  - Automated security scanning                              │
│  - Incident response plan                                   │
│  - Regular penetration testing                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Scalability Architecture

### Horizontal Scaling Strategy

```
                    ┌──────────────┐
                    │  CDN (Cloud- │
                    │   flare)     │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │Load Balancer │
                    │   (Nginx)    │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ App     │       │ App     │       │ App     │
   │ Server 1│       │ Server 2│       │ Server N│
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        ┌─────▼─────┐           ┌──────▼──────┐
        │PostgreSQL │           │    Redis    │
        │  Primary  │           │   Cluster   │
        └─────┬─────┘           └─────────────┘
              │
        ┌─────▼─────┐
        │PostgreSQL │
        │  Replica  │
        └───────────┘

Capacity Planning:
- Start: 1 server, handles ~1000 concurrent users
- Growth: Add servers as needed
- Database: Read replicas for queries
- Cache: Redis cluster for sessions
- Storage: S3 for files (unlimited)
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL/NETLIFY                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Static)                  │  │
│  │  - SSR/SSG for SEO                                   │  │
│  │  - Edge caching                                       │  │
│  │  - Automatic HTTPS                                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    RAILWAY/RENDER/AWS                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Node.js API Server                       │  │
│  │  - Auto-scaling                                       │  │
│  │  - Health checks                                      │  │
│  │  - Zero-downtime deploys                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Background Workers                       │  │
│  │  - Cron jobs                                         │  │
│  │  - Queue processing                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
┌───────────────────▼──────┐   ┌────────▼─────────┐
│  PostgreSQL (Supabase)   │   │  Redis (Upstash) │
│  - Managed service       │   │  - Managed cache │
│  - Automatic backups     │   │  - Global CDN    │
│  - Point-in-time recovery│   │                  │
└──────────────────────────┘   └──────────────────┘
```

---

## Monitoring & Observability

```
┌──────────────────────────────────────────────────────────────┐
│                    APPLICATION METRICS                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Sentry (Error Tracking)                                │  │
│  │ - Exceptions & stack traces                           │  │
│  │ - Performance monitoring                              │  │
│  │ - User context                                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     USER ANALYTICS                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Mixpanel / Google Analytics                            │  │
│  │ - User journeys                                        │  │
│  │ - Feature adoption                                     │  │
│  │ - Conversion funnels                                   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE METRICS                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Platform-native monitoring (Railway/Render)            │  │
│  │ - CPU & Memory usage                                   │  │
│  │ - Request latency                                      │  │
│  │ - Database connections                                 │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      BUSINESS METRICS                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Custom Dashboard (Metabase/Grafana)                    │  │
│  │ - Total value locked (TVL)                            │  │
│  │ - Active users                                         │  │
│  │ - Transaction volume                                   │  │
│  │ - Revenue metrics                                      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Disaster Recovery Plan

### Backup Strategy
```
Daily Backups:
├── Database (Full) - Automated by Supabase/Railway
│   ├── Retention: 30 days
│   └── Location: Multiple regions
│
├── Redis Snapshots - Automated by Upstash
│   ├── Retention: 7 days
│   └── RDB + AOF persistence
│
└── File Storage - S3 versioning enabled
    ├── Retention: Indefinite
    └── Cross-region replication

Point-in-Time Recovery:
└── PostgreSQL: Restore to any point in last 30 days
```

### Recovery Time Objectives (RTO)
- Critical services (Auth, API): < 1 hour
- Database restoration: < 2 hours
- Full system recovery: < 4 hours

### Recovery Point Objectives (RPO)
- Database: < 5 minutes (continuous replication)
- Files: < 1 hour (S3 replication)
- Cache: Acceptable loss (rebuilds automatically)

---

## Performance Targets

### Frontend Performance
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

### API Performance
- Average response time: < 200ms (95th percentile)
- Database queries: < 50ms (95th percentile)
- Payment processing: < 3s (end-to-end)
- Background jobs: Process within scheduled window

### Scalability Targets
- Support 10,000 concurrent users
- Handle 1,000 transactions per minute
- 99.9% uptime SLA
- Auto-scale from 1 to 10 servers based on load

---

This architecture is designed to be:
✅ **Scalable** - Grows with your user base
✅ **Reliable** - Multiple layers of redundancy
✅ **Secure** - Defense in depth strategy
✅ **Cost-effective** - Start small, scale as needed
✅ **Maintainable** - Clear separation of concerns
✅ **Observable** - Comprehensive monitoring

