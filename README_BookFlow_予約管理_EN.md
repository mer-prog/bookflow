# BookFlow — AI-Powered Smart Booking Management Platform

> **What:** A booking management SaaS for salons, clinics, and appointment-based businesses. Combines a rule-based scoring engine with Claude AI to predict cancellation risk and prevent revenue loss before it happens.
> **Who:** Business operators running appointment-based services, and customers booking appointments online.
> **Tech:** Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / PostgreSQL (Neon) / Prisma 7 / Claude Haiku 4.5 / next-intl

**Live Demo:** [https://bookflow-five.vercel.app](https://bookflow-five.vercel.app)

| Role | Email | Password |
|:---|:---|:---|
| Admin | `admin@bloom.com` | `password123` |
| Customer | `customer@bloom.com` | `password123` |

**Source Code:** [https://github.com/mer-prog/bookflow](https://github.com/mer-prog/bookflow)

---

## Skills Demonstrated

| Skill | Implementation |
|:---|:---|
| **Full-Stack Development** | End-to-end implementation using Next.js 16 App Router — frontend, API routes, authentication, and database operations in a single codebase. Leverages React Server Components to eliminate the need for a BFF layer. |
| **AI Integration (Claude API)** | Hybrid approach combining a 4-factor rule-based scoring engine (lead time, cancellation history, day of week, time of day) with Claude Haiku 4.5 for natural language risk explanation and action recommendation. Graceful fallback to rule-based templates when API key is not configured. |
| **Authentication & Authorization** | NextAuth.js v5 with JWT sessions and role-based access control (ADMIN/CUSTOMER). Middleware-level route protection. Password hashing with bcryptjs at 12 salt rounds. |
| **Database Design** | Normalized schema with 7 models using Prisma 7 ORM. Many-to-many relationship via StaffService junction table. Enum types for BookingStatus and CancelRisk. Compatible with Neon Serverless PostgreSQL. |
| **Internationalization (i18n)** | Full Japanese/English language switching with next-intl. Accept-Language header auto-detection for public pages. Dual persistence via Cookie + localStorage. Dynamic switching without page reload. Locale-aware date/time formatting (24h vs 12h AM/PM, Monday vs Sunday week start). |
| **UI/UX Design** | Design system built on Tailwind CSS 4 custom properties. 6 reusable UI components. 4-step guided booking wizard. Responsive dashboard and calendar views. |
| **Security** | 5 security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy). Automatic SQL injection prevention via Prisma ORM. Whitelist-based field updates for PATCH endpoints. |

---

## Feature List

| Feature | Description | Status |
|:---|:---|:---|
| **Dashboard** | Real-time display of 4 KPIs: today's bookings, weekly bookings, weekly revenue, and cancellation rate. Today's booking list and at-risk (HIGH/MEDIUM) booking highlights. 4-week cancellation rate trend chart (Recharts). | Implemented |
| **Calendar View** | Toggle between week and day views. Staff-based filtering, automatic grayout for closed days, color-coded booking status badges. | Implemented |
| **Booking Management** | Full booking list with status filters (Pending / Confirmed / Cancelled / Completed / No Show). Status update actions (confirm, cancel, complete). Cancel risk badge display. | Implemented |
| **Online Booking Flow** | 4-step guided wizard: Service Selection → Date/Time/Staff → Customer Info → Confirmation. Automatic time slot generation at 30-minute intervals with conflict detection. | Implemented |
| **Service Management** | Create, edit, and toggle services active/inactive. Configure name, description, duration (minutes), and price (JPY). | Implemented |
| **Business Settings** | Edit shop name, description, address, phone, and email. Flexible per-day business hours and closed day configuration. | Implemented |
| **AI Cancellation Risk Prediction** | Rule-based engine scores risk (LOW/MEDIUM/HIGH) at booking creation. Admin panel provides on-demand AI analysis via Claude Haiku 4.5 for natural language risk explanation and recommended actions. | Implemented |
| **Multilingual Support (JP/EN)** | Full Japanese/English switching across admin panel and public booking pages. Language toggle in sidebar and header. Auto-detection via Accept-Language header on public booking pages. | Implemented |
| **Authentication & Authorization** | Email/password login. Role separation between Admin and Customer. Access control for admin pages. | Implemented |
| **Booking Details & Cancellation** | Post-booking detail page. Self-service cancellation by customers. | Implemented |

---

## Tech Stack

| Category | Technology | Purpose |
|:---|:---|:---|
| Framework | Next.js 16.1.6 (App Router) | Server Components, API Routes, and Middleware in one |
| UI | React 19.2.3 | Component-based user interface |
| Language | TypeScript 5 | Type-safe development |
| Styling | Tailwind CSS 4 | Utility-first CSS with design tokens via CSS custom properties |
| Database | PostgreSQL (Neon Serverless) | Serverless connection via @prisma/adapter-pg |
| ORM | Prisma 7.4.1 | Type-safe database operations with schema-driven type generation |
| Auth | NextAuth.js v5 (beta.30) | Credentials Provider with JWT sessions |
| Password | bcryptjs 3.0.3 | 12-round salt hashing |
| AI | Anthropic Claude Haiku 4.5 | Natural language risk analysis and action recommendation |
| AI SDK | @anthropic-ai/sdk 0.78.0 | Anthropic API client |
| Charts | Recharts 3.7.0 | Cancel rate trend line chart |
| i18n | next-intl 4.8.3 | App Router i18n with Cookie/Accept-Language based locale |
| Deployment | Vercel | Edge Network delivery |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                          │
│                                                                   │
│  ┌──────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Landing Page     │  │  Public Booking  │  │  Admin Panel    │  │
│  │  (Public)         │  │  Flow (Public)   │  │  (Protected)    │  │
│  └──────────────────┘  └─────────────────┘  └─────────────────┘  │
└──────────────────────────────┬────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼────────────────────────────────────┐
│                      Next.js 16 (App Router)                      │
│                                                                   │
│  ┌──────────────┐  ┌────────────────┐  ┌───────────────────────┐  │
│  │  Middleware   │  │  API Routes    │  │  Server Components    │  │
│  │  (Auth Gate)  │  │  (15 endpoints)│  │  (SSR / RSC)         │  │
│  └──────┬───────┘  └──────┬─────────┘  └───────────────────────┘  │
│         │                 │                                       │
│  ┌──────▼───────┐  ┌──────▼─────────┐  ┌───────────────────────┐  │
│  │  NextAuth    │  │  Prisma ORM    │  │  Cancel Risk Engine   │  │
│  │  (JWT/RBAC)  │  │  (Type-safe)   │  │  (Rule-Based + AI)   │  │
│  └──────────────┘  └──────┬─────────┘  └──────────┬────────────┘  │
│                           │                       │               │
│  ┌────────────────────────┼───────────────────────┼────────────┐  │
│  │  next-intl (i18n)      │                       │            │  │
│  │  Cookie / Accept-Language Based Locale Resolution           │  │
│  └────────────────────────┼───────────────────────┼────────────┘  │
└───────────────────────────┼───────────────────────┼───────────────┘
                            │                       │
               ┌────────────▼────────┐   ┌──────────▼──────────┐
               │   PostgreSQL        │   │   Anthropic API     │
               │   (Neon Serverless) │   │   (Claude Haiku 4.5)│
               └─────────────────────┘   └─────────────────────┘
```

---

## AI Cancellation Risk Prediction

### Scoring Algorithm

At booking creation, the engine computes a risk score from 4 factors. The total score determines one of 3 risk levels.

```
┌─────────────────────────────────────────────────────────────┐
│                    Risk Scoring Engine                        │
│                                                              │
│  Factor              Points    Condition                     │
│  ──────────────      ──────    ─────────────────────────     │
│  Lead Time           0-40      Time between creation         │
│                                  and appointment             │
│                                  < 2 hours  → 40 pts         │
│                                  < 24 hours → 25 pts         │
│                                  < 72 hours → 10 pts         │
│                                                              │
│  Cancellation        0-35      Same customer's past          │
│  History                         cancellation rate            │
│                                  > 30% → 35 pts              │
│                                  > 15% → 20 pts              │
│                                  > 0%  → 5 pts               │
│                                                              │
│  Day of Week         0-10      Booking date                  │
│                                  Monday or Friday → 10 pts   │
│                                                              │
│  Time of Day         0-15      Appointment start time        │
│                                  Before 10:00 or             │
│                                  17:00 or later → 15 pts     │
│                                                              │
│  ────────────────────────────────────────────────────────    │
│  Total:  >= 60 → HIGH  |  >= 30 → MEDIUM  |  < 30 → LOW    │
└─────────────────────────────────────────────────────────────┘
```

### Risk Level Actions

| Level | Score | Recommended Action |
|:---|:---|:---|
| **HIGH** | 60+ | Send a reminder 24 hours before the appointment. If past cancellation rate exceeds 30%, consider requiring a deposit. |
| **MEDIUM** | 30-59 | Send a reminder the day before and confirm the booking. For same-day bookings, send a message to confirm attendance. |
| **LOW** | Below 30 | Standard reminder procedures are sufficient. |

### AI Analysis (Claude Haiku 4.5)

On top of the rule-based scoring, Claude Haiku 4.5 generates:

- **Risk Explanation** — A 2-3 sentence natural language summary of why the booking is flagged.
- **Recommended Action** — A concrete 1-2 sentence suggestion for what the operator should do.

When no API key is configured, the system falls back to rule-based template responses. AI analysis supports both Japanese and English — the response language switches based on the `locale` parameter in the request body.

---

## Key Features

### Dashboard (Admin)

The admin landing page after login. Displays 4 stat cards (today's bookings, this week's bookings, weekly revenue, cancellation rate) fetched from `/api/admin/stats`. Shows today's booking list and highlights HIGH/MEDIUM risk bookings. Visualizes the past 4 weeks of cancellation rate trends using a Recharts line chart.

### Calendar View

Supports week and day view toggling. The `getWeekDates()` function calculates the week start based on locale (Japanese: Monday start, English: Sunday start). Includes staff-based filtering, grayout for off-hours and closed days, and color-coded status badges on each booking.

### Online Booking Flow

A 4-step wizard interface. Step 1: Service selection with assigned staff display. Step 2: Date, staff, and time slot selection (`/api/timeslots` generates 30-minute interval slots and checks for conflicts with existing bookings). Step 3: Customer information input. Step 4: Review and confirm. On confirmation, the rule-based engine instantly calculates and stores the cancellation risk.

### Internationalization (i18n)

Integrates next-intl 4.8.3 with the Next.js App Router. Uses cookie-based locale management without adding locale prefixes to URLs. Locale resolution priority: (1) `locale` cookie → (2) Accept-Language header parsing → (3) Default `ja`.

Language switching writes to both Cookie and localStorage, then calls `router.refresh()` for instant updates without a full page reload. The admin sidebar has a JP/EN toggle tab, while auth pages and the public booking page have a globe icon toggle button.

Date and time formatting adapts to locale:

| Element | Japanese | English |
|:---|:---|:---|
| Full date | 2026年2月28日土曜日 | Sat, February 28, 2026 |
| Short date | 2月28日(土) | Sat, Feb 28 |
| Time | 14:00 | 2:00 PM |
| Time range | 14:00〜15:00 | 2:00 PM – 3:00 PM |
| Duration | 60分 / 1時間30分 | 60 min / 1 hr 30 min |
| Calendar week start | Monday | Sunday |

Translation files are stored in `src/messages/ja.json` and `src/messages/en.json`, organized into 22 namespaces (metadata, common, header, footer, home, auth, sidebar, dashboard, bookingList, status, risk, calendar, services, settings, booking, bookingDetail, ai, riskFactors, riskActions, riskExplanation, languageToggle).

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  Business    │       │   Service    │       │    Staff    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id     (PK) │◄──┐   │ id     (PK)  │   ┌──►│ id    (PK)  │
│ name         │   │   │ businessId   │───┘   │ businessId  │
│ description  │   │   │ name         │       │ name        │
│ address      │   │   │ description  │       │ email       │
│ phone        │   │   │ duration     │       │ active      │
│ email        │   │   │ price        │       └──────┬──────┘
│ businessHours│   │   │ active       │              │
│   (Json)     │   │   └──────┬───────┘              │
└──────┬───────┘   │          │                      │
       │           │   ┌──────▼───────┐              │
       │           │   │ StaffService │              │
       │           │   ├──────────────┤              │
       │           │   │ staffId  (FK)│──────────────┘
       │           │   │ serviceId(FK)│
       │           │   │ @@unique     │
       │           │   └──────────────┘
       │           │
┌──────▼───────┐   │   ┌──────────────┐       ┌─────────────┐
│    User      │   │   │   Booking    │       │  TimeSlot   │
├──────────────┤   │   ├──────────────┤       ├─────────────┤
│ id     (PK)  │   ├───┤ businessId   │       │ id    (PK)  │
│ email (uniq) │   │   │ serviceId(FK)│       │ staffId(FK) │
│ password     │   │   │ staffId  (FK)│       │ date        │
│ name         │   │   │ customerId   │──►User│ startTime   │
│ phone        │   │   │ customerName │       │ endTime     │
│ role  (Enum) │   │   │ customerEmail│       │ isAvailable │
│ businessId   │───┘   │ date         │       └─────────────┘
└──────────────┘       │ startTime    │
                       │ endTime      │
                       │ status (Enum)│
                       │ cancelRisk   │
                       │   (Enum)     │
                       │ cancelReason │
                       │ notes        │
                       └──────────────┘
```

### Enum Definitions

| Enum | Values |
|:---|:---|
| `Role` | `ADMIN` / `CUSTOMER` |
| `BookingStatus` | `PENDING` / `CONFIRMED` / `CANCELLED` / `COMPLETED` / `NO_SHOW` |
| `CancelRisk` | `LOW` / `MEDIUM` / `HIGH` |

### Booking Status Flow

```
 Created → PENDING → CONFIRMED → COMPLETED
                         │
                         ├──→ CANCELLED (by customer or admin)
                         │
                         └──→ NO_SHOW (unattended)
```

Note: Bookings created through the public booking flow are set to `CONFIRMED` status directly.

---

## Seed Data

A seed script (`prisma/seed.mjs`) populates the database with 70 test bookings for development and demonstration.

### Business

| Field | Value |
|:---|:---|
| Name | BLOOM Beauty Studio |
| Address | 3-15-8 Jingumae, Shibuya-ku, Tokyo |
| Phone | 03-1234-5678 |
| Hours | Mon-Fri 10:00-19:00 (Thu-Fri until 20:00), Sat 9:00-19:00, Sun closed |

### Services (5)

| Service | Duration | Price |
|:---|:---|:---|
| Cut | 60 min | ¥4,500 |
| Color | 90 min | ¥8,000 |
| Treatment | 45 min | ¥3,500 |
| Perm | 120 min | ¥10,000 |
| Head Spa | 60 min | ¥5,000 |

### Staff (3) and Service Assignments

| Staff | Assigned Services |
|:---|:---|
| Tanaka Misaki | All services (Cut, Color, Treatment, Perm, Head Spa) |
| Sato Kenta | Cut, Color, Perm |
| Suzuki Hanako | Cut, Treatment, Head Spa |

### Repeat Customers (5)

| Customer | Bookings | Cancellations | Cancel Rate | Risk Tendency |
|:---|:---|:---|:---|:---|
| Tanaka Hanako | 6 | 0 | 0% | LOW (loyal) |
| Yamada Taro | 5 | 2 | 40% | HIGH |
| Sasaki Yuko | 4 | 0 | 0% | LOW |
| Takahashi Ken | 4 | 2 | 50% | HIGH |
| Nakamura Mai | 3 | 0 | 0% | LOW |

### One-Time Customers

48 bookings generated from 48 unique one-time customers (no customerId linked).

### Booking Status Distribution

| Status | Count |
|:---|:---|
| CONFIRMED | 28 |
| COMPLETED | 24 |
| CANCELLED | 11 |
| NO_SHOW | 7 |
| **Total** | **70** |

---

## Project Structure

```
bookflow/
├── prisma/
│   ├── schema.prisma                 # Data model definition (7 models, 3 enums)
│   └── seed.mjs                      # Test data (70 bookings, 5 customers, 48 one-time)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (NextIntlClientProvider integration)
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Design tokens (Tailwind CSS custom properties)
│   │   │
│   │   ├── api/                      # REST API (15 endpoints)
│   │   │   ├── auth/[...nextauth]/   #   NextAuth authentication
│   │   │   ├── register/             #   User registration
│   │   │   ├── bookings/             #   Booking CRUD (list/create/detail/update/cancel)
│   │   │   ├── services/             #   Service listing (public)
│   │   │   ├── staff/                #   Staff listing (public)
│   │   │   ├── timeslots/            #   Availability query (public)
│   │   │   ├── admin/                #   Admin-only APIs
│   │   │   │   ├── stats/            #     Dashboard statistics
│   │   │   │   ├── cancel-trend/     #     Cancel rate trend data
│   │   │   │   ├── services/         #     Service management (CRUD)
│   │   │   │   └── settings/         #     Business settings (GET/PUT)
│   │   │   └── ai/
│   │   │       └── cancel-risk/      #   AI risk analysis (JP/EN)
│   │   │
│   │   ├── admin/                    # Admin panel (protected)
│   │   │   ├── layout.tsx            #   Layout with sidebar
│   │   │   ├── page.tsx              #   Dashboard
│   │   │   ├── bookings/page.tsx     #   Booking list
│   │   │   ├── calendar/page.tsx     #   Calendar
│   │   │   ├── services/page.tsx     #   Service management
│   │   │   └── settings/page.tsx     #   Business settings
│   │   │
│   │   ├── book/page.tsx             # Public booking flow (4 steps)
│   │   ├── booking/[id]/page.tsx     # Booking detail & cancellation
│   │   ├── login/page.tsx            # Login
│   │   └── register/page.tsx         # Registration
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable UI components (6)
│   │   │   ├── button.tsx            #   4 variants (primary/secondary/outline/ghost)
│   │   │   ├── card.tsx              #   Container card
│   │   │   ├── input.tsx             #   Form input
│   │   │   ├── badge.tsx             #   Status badge
│   │   │   ├── modal.tsx             #   Modal dialog
│   │   │   └── select.tsx            #   Select dropdown
│   │   │
│   │   ├── admin/                    # Admin components (9)
│   │   │   ├── stats-cards.tsx       #   4 KPI stat cards
│   │   │   ├── today-bookings.tsx    #   Today's booking list
│   │   │   ├── at-risk-bookings.tsx  #   At-risk booking list
│   │   │   ├── cancel-rate-chart.tsx #   Cancel rate trend chart
│   │   │   ├── booking-table.tsx     #   Booking data table
│   │   │   ├── cancel-risk-badge.tsx #   Risk level badge
│   │   │   ├── calendar-view.tsx     #   Calendar view component
│   │   │   ├── service-form.tsx      #   Service edit form
│   │   │   └── hours-form.tsx        #   Business hours form
│   │   │
│   │   ├── booking/                  # Booking flow components (5)
│   │   │   ├── step-indicator.tsx    #   4-step progress indicator
│   │   │   ├── service-select.tsx    #   Service selection
│   │   │   ├── datetime-select.tsx   #   Date, staff, and time selection
│   │   │   ├── customer-form.tsx     #   Customer info form
│   │   │   └── booking-confirm.tsx   #   Booking confirmation
│   │   │
│   │   ├── ai/
│   │   │   └── risk-explanation.tsx  # AI risk analysis display
│   │   │
│   │   └── layout/                   # Layout components
│   │       ├── header.tsx            #   Common header (nav + language toggle)
│   │       ├── footer.tsx            #   Common footer
│   │       ├── admin-sidebar.tsx     #   Admin sidebar (language toggle)
│   │       ├── language-toggle.tsx   #   Language switcher (sidebar/header variants)
│   │       └── session-provider.tsx  #   NextAuth session provider
│   │
│   ├── i18n/                         # Internationalization
│   │   ├── config.ts                 #   Locale definitions (ja / en)
│   │   ├── request.ts                #   Server-side locale resolution (Cookie → Accept-Language → default)
│   │   ├── locale-context.tsx        #   Client-side locale management (Context API)
│   │   └── locale-sync.tsx           #   localStorage ↔ Cookie sync
│   │
│   ├── messages/                     # Translation files
│   │   ├── ja.json                   #   Japanese (282 lines)
│   │   └── en.json                   #   English (282 lines)
│   │
│   ├── lib/                          # Utilities
│   │   ├── auth.ts                   #   NextAuth config (JWT + RBAC)
│   │   ├── prisma.ts                 #   Prisma client (singleton)
│   │   ├── api-auth.ts               #   API auth helpers (requireAuth / requireAdmin)
│   │   ├── cancel-risk.ts            #   Risk scoring engine (JP/EN)
│   │   └── utils.ts                  #   Date/time formatting, status labels
│   │
│   ├── types/index.ts                # TypeScript type definitions
│   └── middleware.ts                 # Route protection (/admin/* requires ADMIN role)
│
├── next.config.ts                    # Security headers + next-intl integration
├── package.json                      # Dependency manifest
├── tsconfig.json                     # TypeScript configuration
└── .env.example                      # Environment variable template
```

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (or [Neon](https://neon.tech/) free tier)
- Anthropic API Key (optional — only needed for AI analysis)

### Instructions

```bash
# 1. Clone & install
git clone https://github.com/mer-prog/bookflow.git
cd bookflow
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values
```

Required environment variables:

| Variable | Required | Description |
|:---|:---|:---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon recommended) |
| `DIRECT_URL` | Yes | PostgreSQL direct connection string |
| `NEXTAUTH_SECRET` | Yes | JWT session signing key (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Yes | Application URL (`http://localhost:3000` for development) |
| `ANTHROPIC_API_KEY` | No | Anthropic API key (system falls back to rule-based analysis without it) |

```bash
# 3. Database setup
npx prisma db push        # Push schema to database
npm run db:seed            # Seed 70 test bookings

# 4. Start development server
npm run dev                # → http://localhost:3000
```

### Other Scripts

```bash
npm run build              # Production build
npm run start              # Production server
npm run lint               # Run ESLint
npm run db:reset           # Reset database and re-seed
```

---

## Design Decisions

| Decision | Rationale |
|:---|:---|
| **Next.js 16 App Router** | Server Components and API Routes in one codebase eliminate the need for a separate BFF. Zero-config deployment to Vercel keeps infrastructure costs at open-source minimums. |
| **Prisma 7 ORM** | Auto-generates TypeScript types from schema, catching type errors at compile time. Parameterized queries structurally prevent SQL injection without manual effort. |
| **NextAuth.js v5 (JWT)** | No server-side session store needed — ideal for serverless platforms like Vercel. Embeds role and businessId in JWT for seamless RBAC. |
| **PostgreSQL (Neon)** | Serverless PostgreSQL with sub-150ms cold starts. Automated scaling and backups keep operational overhead minimal. |
| **Claude Haiku 4.5** | Strikes the right balance of accuracy, speed, and cost. Sufficient capability for natural language risk explanations at the lowest API price point. |
| **Rule-Based + AI Hybrid** | Risk scoring at booking creation runs rule-based (under 5ms). AI analysis runs on-demand from the admin panel, keeping costs and latency under control. |
| **Tailwind CSS 4** | CSS custom properties for centralized design tokens. Utility classes ensure styling consistency and prevent CSS bloat. |
| **next-intl (Cookie-Based)** | No locale prefixes in URLs. i18n can be added without changing existing routes, and the default language URL stays clean for SEO. |
| **Accept-Language Auto-Detection** | Public booking page visitors are unlikely to change an in-app language setting. Auto-detecting from browser preferences provides the best UX with zero friction. |
| **Locale-Aware Calendar Week Start** | Japanese business convention uses Monday as the first day of the week; English-speaking markets use Sunday. The calendar automatically adapts based on locale since it directly impacts the booking UX. |
| **Recharts** | A React-native SVG chart library with SSR compatibility and a lightweight bundle footprint. |

---

## Running Costs

| Service | Plan | Monthly Cost |
|:---|:---|:---|
| Vercel | Hobby (Free) | $0 |
| Neon PostgreSQL | Free Tier (0.5GB) | $0 |
| Anthropic API | Pay-as-you-go (Claude Haiku 4.5) | ~Under $1 (low usage) |
| **Total** | | **$0-1/month** |

---

## Author

[@mer-prog](https://github.com/mer-prog)
