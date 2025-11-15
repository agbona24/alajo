# 🤝 Group Savings (Ajo/Esusu) Feature Plan

## Overview

Group Savings (Ajo/Esusu) is a traditional rotating savings and credit association where members pool money together and take turns receiving the collective pot.

---

## 📋 Feature Requirements

### Core Concepts

1. **Group (Ajo Circle)**
   - A collection of members saving together
   - Fixed contribution amount per cycle
   - Fixed duration and rotation schedule
   - Has an organizer/admin

2. **Members**
   - Users who join a group
   - Each member gets one turn to collect
   - Can be in multiple groups simultaneously

3. **Rotation**
   - Order in which members receive payouts
   - Can be: sequential, random, or bid-based
   - One member receives per cycle

4. **Contributions**
   - Fixed amount per member per cycle
   - All members must contribute before payout
   - Late contributions are tracked

---

## 🗄️ Database Schema

### groups Table
```sql
id                      bigint PRIMARY KEY
name                    varchar(255)
description             text
organizer_id            bigint (FK: users)
contribution_amount     decimal(10,2)
frequency               enum(daily, weekly, monthly)
total_members           int
max_members             int
start_date              date
end_date                date
rotation_type           enum(sequential, random, bid_based)
status                  enum(recruiting, active, completed, cancelled)
current_cycle           int
total_cycles            int
is_public               boolean
join_code               varchar(10) UNIQUE
settings                json (rules, penalties, etc.)
created_at              timestamp
updated_at              timestamp
```

### group_members Table
```sql
id                      bigint PRIMARY KEY
group_id                bigint (FK: groups)
user_id                 bigint (FK: users)
position                int (rotation position)
role                    enum(organizer, member)
status                  enum(pending, active, suspended, left)
join_date               date
payout_received         boolean
payout_cycle            int (which cycle they received payout)
payout_date             date
total_contributed       decimal(10,2)
missed_contributions    int
penalty_fees            decimal(10,2)
created_at              timestamp
updated_at              timestamp

UNIQUE(group_id, user_id)
UNIQUE(group_id, position)
```

### group_contributions Table
```sql
id                      bigint PRIMARY KEY
group_id                bigint (FK: groups)
member_id               bigint (FK: group_members)
user_id                 bigint (FK: users)
cycle_number            int
amount                  decimal(10,2)
status                  enum(pending, paid, missed, late)
due_date                date
paid_date               timestamp
payment_method          varchar(50)
transaction_id          bigint (FK: transactions)
is_late                 boolean
late_fee                decimal(10,2)
created_at              timestamp
updated_at              timestamp

UNIQUE(group_id, member_id, cycle_number)
```

### group_payouts Table
```sql
id                      bigint PRIMARY KEY
group_id                bigint (FK: groups)
recipient_id            bigint (FK: group_members)
user_id                 bigint (FK: users)
cycle_number            int
payout_amount           decimal(10,2)
organizer_fee           decimal(10,2)
net_amount              decimal(10,2)
status                  enum(pending, completed, failed)
scheduled_date          date
completed_date          timestamp
transaction_id          bigint (FK: transactions)
notes                   text
created_at              timestamp
updated_at              timestamp

UNIQUE(group_id, cycle_number)
```

### group_activities Table
```sql
id                      bigint PRIMARY KEY
group_id                bigint (FK: groups)
user_id                 bigint (FK: users)
action                  varchar(100)
description             text
metadata                json
created_at              timestamp
```

---

## 🔄 Business Rules

### Group Creation
- ✅ Minimum 3 members, maximum 50 members
- ✅ Contribution amount minimum: ₦500
- ✅ Organizer automatically becomes first member
- ✅ Auto-calculate total_cycles = max_members
- ✅ Generate unique 6-digit join code
- ✅ Organizer can set joining fee (0-10% of contribution)

### Joining Groups
- ✅ Public groups: anyone can join with code
- ✅ Private groups: invitation only
- ✅ Cannot join if group is full
- ✅ Cannot join if group already started
- ✅ Position assigned automatically or by organizer

### Contributions
- ✅ All members must contribute before payout
- ✅ Late contribution fee: 5% after due date
- ✅ Missed contribution (>7 days): member suspended
- ✅ 3 missed contributions: auto-removal from group

### Payouts
- ✅ Payout happens when all members contribute for cycle
- ✅ Organizer fee: 2% of total pot (configurable)
- ✅ Payout amount = (contribution × members) - organizer_fee
- ✅ Cannot receive payout twice
- ✅ Rotation position determines order

### Group Status
- **Recruiting**: Waiting for members to join
- **Active**: Cycles running, contributions happening
- **Completed**: All members received payouts
- **Cancelled**: Terminated early (refunds required)

---

## 🚀 API Endpoints

### Group Management

#### Create Group
```
POST /api/groups
Auth: Required
Body: {
  name, description, contribution_amount, frequency,
  max_members, start_date, rotation_type, is_public
}
Returns: Group object with join_code
```

#### List Groups
```
GET /api/groups
Auth: Required
Query: ?status=active&is_public=true&search=vacation
Returns: Paginated groups list
```

#### Get Group Details
```
GET /api/groups/{id}
Auth: Required
Returns: Group with members, current cycle, statistics
```

#### Update Group (Organizer Only)
```
PUT /api/groups/{id}
Auth: Required (organizer)
Body: { name, description, settings }
Returns: Updated group
```

#### Cancel Group (Organizer Only)
```
POST /api/groups/{id}/cancel
Auth: Required (organizer)
Body: { reason }
Returns: Success, triggers refund process
```

#### Start Group (Organizer Only)
```
POST /api/groups/{id}/start
Auth: Required (organizer)
Validation: min_members met, all positions filled
Returns: Success, creates contribution schedules
```

### Member Management

#### Join Group
```
POST /api/groups/{id}/join
Auth: Required
Body: { join_code }
Returns: Membership object
```

#### Leave Group
```
POST /api/groups/{id}/leave
Auth: Required
Validation: Haven't received payout yet
Returns: Success
```

#### List My Groups
```
GET /api/groups/my-groups
Auth: Required
Returns: All groups user is member of
```

#### Get Member Details
```
GET /api/groups/{id}/members/{memberId}
Auth: Required
Returns: Member stats, contribution history
```

#### Update Member Position (Organizer Only)
```
PUT /api/groups/{id}/members/{memberId}
Auth: Required (organizer)
Body: { position }
Returns: Updated member
```

#### Remove Member (Organizer Only)
```
DELETE /api/groups/{id}/members/{memberId}
Auth: Required (organizer)
Returns: Success
```

### Contributions

#### Make Group Contribution
```
POST /api/groups/{id}/contribute
Auth: Required (member)
Body: { amount, payment_method, payment_reference }
Validation: Amount matches group contribution_amount
Returns: Contribution record
```

#### Get Group Contributions
```
GET /api/groups/{id}/contributions
Auth: Required
Query: ?cycle_number=5&status=paid
Returns: Paginated contributions
```

#### Get My Contribution Status
```
GET /api/groups/{id}/my-contributions
Auth: Required (member)
Returns: All user's contributions for group
```

### Payouts

#### Process Payout (System/Organizer)
```
POST /api/groups/{id}/payouts
Auth: Required (organizer)
Body: { recipient_member_id, cycle_number }
Validation: All contributions paid for cycle
Returns: Payout record
```

#### Get Payout History
```
GET /api/groups/{id}/payouts
Auth: Required
Returns: All payouts for group
```

### Statistics

#### Group Statistics
```
GET /api/groups/{id}/statistics
Auth: Required
Returns: {
  total_contributed, total_paid_out, completion_percentage,
  active_members, pending_contributions, next_payout
}
```

#### Member Statistics
```
GET /api/groups/my-statistics
Auth: Required
Returns: {
  total_groups, active_groups, total_contributed,
  payouts_received, pending_contributions
}
```

---

## 📱 Frontend Components

### Pages

1. **Group Discovery** (`/groups`)
   - List public groups
   - Search and filter
   - Join with code button

2. **My Groups** (`/my-groups`)
   - Groups I'm member of
   - Quick stats per group
   - Current cycle status

3. **Group Details** (`/groups/{id}`)
   - Group information
   - Member list with positions
   - Current cycle progress
   - Contribution status
   - Payout schedule
   - Activity feed

4. **Create Group** (`/groups/create`)
   - Group setup form
   - Member invitation
   - Settings configuration

5. **Group Dashboard** (`/groups/{id}/dashboard`)
   - Organizer view
   - Member management
   - Contribution tracking
   - Payout processing
   - Analytics

### Components

- **GroupCard** - Summary card for group list
- **MemberList** - Display members with positions
- **ContributionTracker** - Visual progress of contributions
- **PayoutSchedule** - Rotation calendar view
- **GroupSettings** - Configuration panel
- **InviteModal** - Share join code
- **ContributeModal** - Make contribution
- **ActivityFeed** - Recent group activities

---

## 🔒 Security Considerations

1. **Authorization**
   - Only organizer can modify group settings
   - Only members can contribute
   - Only organizer can process payouts

2. **Validation**
   - Prevent duplicate contributions per cycle
   - Verify payment amounts match
   - Ensure fair rotation (no position skipping)

3. **Fraud Prevention**
   - Track contribution sources
   - Audit payout processes
   - Flag suspicious patterns (organizer receiving early)

4. **Data Privacy**
   - Hide member financial details from non-members
   - Secure join codes
   - Encrypted payment information

---

## 🎯 User Stories

### As a User
- I want to create a savings group with friends
- I want to join existing groups
- I want to see my rotation position
- I want to contribute to my groups easily
- I want to track when I'll receive my payout
- I want to see group activity history

### As an Organizer
- I want to manage group members
- I want to set group rules and penalties
- I want to track all contributions
- I want to process payouts when due
- I want to communicate with members
- I want to handle disputes

### As a System
- Auto-calculate payout amounts
- Send reminders for due contributions
- Notify members of payouts
- Track late/missed payments
- Generate group reports

---

## 📊 Metrics to Track

- Total groups created
- Active groups
- Average group size
- Total value in group savings
- Completion rate
- Average contribution amount
- On-time contribution rate
- Member satisfaction

---

## 🚦 Implementation Phases

### Phase 1: Core Group Functionality (Week 1)
- Database migrations
- Eloquent models
- Basic CRUD APIs
- Group creation/joining

### Phase 2: Contributions & Payouts (Week 2)
- Contribution tracking
- Payout processing
- Rotation logic
- Member management

### Phase 3: Frontend Implementation (Week 3)
- Group discovery UI
- Group details page
- Contribution interface
- Member dashboard

### Phase 4: Advanced Features (Week 4)
- Activity feed
- Notifications
- Analytics dashboard
- Organizer tools

---

## 🧪 Testing Scenarios

1. **Group Lifecycle**
   - Create → Recruit → Start → Cycles → Complete

2. **Contribution Scenarios**
   - On-time contributions
   - Late contributions
   - Missed contributions
   - Overpayments

3. **Payout Scenarios**
   - Sequential rotation
   - Random rotation
   - Partial contributions (edge case)

4. **Edge Cases**
   - Member leaves before payout
   - Group cancellation with refunds
   - Organizer leaves
   - Payment failures

---

## 📝 Notes

- Consider integrating with existing savings_plans for unified tracking
- Group contributions should create regular transactions
- Payouts should create withdrawal records
- Notifications are critical for group engagement
- Mobile experience is key for adoption

---

**Ready to implement!** 🚀
