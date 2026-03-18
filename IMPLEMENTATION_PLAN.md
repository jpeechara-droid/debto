# Debto - AI Debt Management Platform
## Complete Implementation Plan

---

## 1. Project Overview

**Debto** is a free, AI-powered debt management platform for Indian consumers. Users register, verify identity (PAN + Aadhaar), auto-fetch their CIBIL credit report via **Decentro**, and receive a comprehensive AI-generated debt analysis with actionable repayment strategies. Revenue comes from premium expert consultation upsells and loan refinancing referrals.

### Decentro Credentials
| Key | Value |
|-----|-------|
| Client ID | `5hsrubkuzkg9q38tgbst3` |
| Client Secret | `RqUbWnYSRVgJ7UdpXUYVqH98H1NfHWmt` |
| Master Consumer URN | `F5A334BF9C2B40E6AB2F9C11EF1DD376` |

### Core User Flow
```
Landing Page → Register (Phone OTP / Google) → KYC (PAN + Aadhaar + DOB)
→ Consent → CIBIL Fetch → Credit Report View → AI Debt Analysis
→ Dashboard → Calculators → Expert Consultation (Upsell)
```

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 16+ (App Router), React 19, TypeScript | SSR for SEO, server components, fast dev |
| **Styling** | Tailwind CSS 4, Framer Motion | Matches screen designs, rapid UI dev |
| **Charts** | Recharts | Interactive debt visualizations |
| **Backend API** | Next.js API Route Handlers | Full-stack in one repo, type-safe |
| **Authentication** | NextAuth.js (Auth.js v5) + jose JWT | Google OAuth + custom OTP provider |
| **OTP Service** | MSG91 | Indian SMS coverage, affordable |
| **KYC & CIBIL** | Decentro APIs | Single vendor for PAN, Aadhaar, Credit Bureau |
| **AI/LLM** | Anthropic Claude API (claude-sonnet-4-5-20250929) | Narrative analysis generation |
| **Database** | Supabase PostgreSQL (hosted, `ap-northeast-1`) | Managed PostgreSQL with pgBouncer, RLS, backups |
| **Document Store** | PostgreSQL JSONB columns | Credit report storage (semi-structured) |
| **Supabase SDK** | `@supabase/supabase-js` | Client & server Supabase access for Storage, Realtime |
| **Rate Limiting** | In-memory (serverless-compatible) | Lightweight rate limiting for API routes |
| **File Storage** | Supabase Storage | PDF reports, user uploads (with RLS) |
| **PDF Generation** | React-PDF (@react-pdf/renderer) | Branded downloadable reports |
| **Payments** | Razorpay | Consultation booking payments |
| **Hosting** | Vercel (frontend + API) + Supabase (DB + Storage) | Zero local dependencies, fully cloud-hosted |
| **ORM** | Prisma (with `directUrl` for migrations) | Type-safe DB access via Supabase pgBouncer |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking + performance |

> **Note:** No Docker or local services required. All infrastructure runs on Supabase (PostgreSQL, Storage) and Vercel (app hosting). Prisma connects to Supabase PostgreSQL via pgBouncer (port 6543) for queries and direct connection (port 5432) for migrations.

---

## 3. Screen Inventory & Page Mapping

Based on the 17 screens in `stitch_debto/`:

| # | Screen | Route | Priority |
|---|--------|-------|----------|
| 1 | `debto_landing_page_desktop` | `/` | P0 |
| 2 | `login_screen_initial_desktop` | `/auth/signup` | P0 |
| 3 | `otp_verification_desktop` | `/auth/verify-otp` | P0 |
| 4 | `login_error_states_desktop` | `/auth/login` (error variants) | P0 |
| 5 | `kyc_identity_desktop` | `/kyc/identity` (Step 1) | P0 |
| 6 | `cibil_consent_step_2` | `/kyc/consent` (Step 2) | P0 |
| 7 | `cibil_fetch_in_progress` | `/kyc/fetching` (Step 3 - loading) | P0 |
| 8 | `cibil_fetch_success` | `/kyc/fetching` (Step 3 - success) | P0 |
| 9 | `cibil_fetch_error` | `/kyc/fetching` (Step 3 - error) | P0 |
| 10 | `cibil_credit_report_view` | `/dashboard/credit-report` | P0 |
| 11 | `customer_dashboard` | `/dashboard` | P0 |
| 12 | `ai_debt_analysis_report` | `/dashboard/ai-analysis` | P0 |
| 13 | `calculators_hub` | `/dashboard/calculators` | P1 |
| 14 | `extra_payment_calculator_detail` | `/dashboard/calculators/extra-payment` | P1 |
| 15 | `balance_transfer_analyzer` | `/dashboard/calculators/balance-transfer` | P1 |
| 16 | `consultation_booking` | `/dashboard/consultation` | P1 |
| 17 | `settings_profile` | `/dashboard/settings` | P1 |

---

## 4. Decentro API Integration Plan

### 4.1 Authentication
All Decentro API calls require three headers:
```
client_id: 5hsrubkuzkg9q38tgbst3
client_secret: RqUbWnYSRVgJ7UdpXUYVqH98H1NfHWmt
module_secret: <per-module secret from Decentro dashboard>
Content-Type: application/json
```

**Base URLs:**
- Staging: `https://in.staging.decentro.tech/v2/`
- Production: `https://in.decentro.tech/v2/`

### 4.2 PAN Verification API
**Endpoint:** `POST /v2/kyc/public_registry/validate`

```json
// Request
{
  "reference_id": "unique-txn-id",
  "document_type": "PAN",          // or "PAN_DETAILED" for full info
  "id_number": "ABCDE1234F",
  "consent": "Y"
}

// Response
{
  "decentroTxnId": "...",
  "status": "SUCCESS",
  "responseCode": "S00000",
  "kycStatus": "SUCCESS",
  "kycResult": {
    "idNumber": "ABCDE1234F",
    "name": "RAJESH KUMAR",
    "aadhaarSeedingStatus": "Successful",
    // ... additional fields for PAN_DETAILED
  }
}
```

**Usage in Debto:** KYC Step 1 - Validate PAN on the identity screen. Show green checkmark on valid PAN. Pre-fill name if available.

### 4.3 Credit Report Fetch API
**Endpoint:** `POST /v2/financial_services/credit_bureau/credit_report/summary`

```json
// Request
{
  "reference_id": "unique-txn-id",
  "consent": true,
  "consent_purpose": "Debt analysis and financial advisory",
  "name": "Rajesh Kumar",
  "date_of_birth": "1990-05-15",
  "mobile": "9876543210",
  "pan": "ABCDE1234F",
  "pincode": "400001",
  "address_type": "H",
  "inquiry_purpose": "PL",
  "generate_pdf": true
}

// Response
{
  "decentroTxnId": "...",
  "status": "SUCCESS",
  "responseCode": "S00000",
  "data": {
    "cCRResponse": {
      "status": "1",
      "creditScore": {
        "value": "742",
        "type": "ERS",
        "version": "4.0",
        "scoringElements": [...]
      },
      "personalInfo": {
        "name": "...",
        "dob": "...",
        "gender": "...",
        "income": "..."
      },
      "accountSummary": {
        "activeAccounts": 4,
        "totalBalance": 3250000,
        "totalMonthlyPayment": 45200,
        // ...
      },
      "retailAccountDetails": [
        {
          "accountNumber": "XXXX4921",
          "institution": "HDFC Bank",
          "accountType": "Home Loan",
          "sanctionedAmount": 3500000,
          "currentBalance": 2545000,
          "emiAmount": 28500,
          "interestRate": "8.5",
          "disbursementDate": "2019-01-20",
          "tenure": "240",
          "daysPastDue": "0",
          "accountStatus": "ACTIVE",
          "paymentHistory": [...]
        },
        // ... more accounts
      ],
      "enquiryDetails": [...],
      "creditCards": [...]
    },
    "pdf_base64": "JVBERi0xLjQKJe..."
  }
}
```

**Usage in Debto:** Core data source for CIBIL Report View, Dashboard, and AI Analysis. All financial calculations derive from this response.

### 4.4 Credit Score Only API (Lightweight)
**Endpoint:** `POST /v2/financial_services/credit_bureau/credit_score`

```json
// Request (minimal params)
{
  "mobile": "9876543210",
  "name": "Rajesh Kumar"
}
```

**Usage in Debto:** Quick score refresh on dashboard without full report fetch.

### 4.5 API Call Sequence in User Journey

```
KYC Step 1 (Identity):
  1. User enters PAN → POST /kyc/.../validate (PAN verification)
  2. Validate format of Aadhaar (client-side only, no API needed for basic validation)

KYC Step 2 (Consent):
  3. Record consent with timestamp, IP, session ID in DB

KYC Step 3 (Fetch):
  4. POST /financial_services/credit_bureau/credit_report/summary
  5. Parse response → store in DB (encrypted JSONB)
  6. Send parsed data to AI engine for analysis generation
  7. Redirect to dashboard
```

---

## 5. Database Schema

```sql
-- Users
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone           VARCHAR(15) UNIQUE NOT NULL,
  email           VARCHAR(255),
  full_name       VARCHAR(255),
  google_id       VARCHAR(255),
  city            VARCHAR(100),
  monthly_income  DECIMAL(12,2),
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- KYC Records
CREATE TABLE kyc_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  pan_number      TEXT NOT NULL,          -- encrypted
  pan_name        VARCHAR(255),
  aadhaar_hash    TEXT NOT NULL,          -- hashed, never stored raw
  date_of_birth   DATE NOT NULL,
  pan_verified    BOOLEAN DEFAULT FALSE,
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  verification_txn_id VARCHAR(255),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Consent Records (audit trail)
CREATE TABLE consent_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  consent_type    VARCHAR(50) NOT NULL,   -- 'cibil_fetch', 'marketing'
  consent_given   BOOLEAN NOT NULL,
  consent_text    TEXT NOT NULL,
  consent_version VARCHAR(10) NOT NULL,
  ip_address      INET,
  session_id      VARCHAR(255),
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Reports (encrypted JSONB)
CREATE TABLE credit_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  decentro_txn_id VARCHAR(255),
  credit_score    INTEGER,
  raw_report      JSONB NOT NULL,         -- encrypted at application layer
  parsed_summary  JSONB,                  -- extracted key metrics
  pdf_base64      TEXT,
  fetched_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days')
);

-- Loan Accounts (parsed from credit report)
CREATE TABLE loan_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_report_id UUID REFERENCES credit_reports(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  account_number  VARCHAR(50),            -- masked
  institution     VARCHAR(255),
  loan_type       VARCHAR(50),            -- home, personal, auto, credit_card, bnpl
  sanctioned_amount DECIMAL(14,2),
  outstanding_balance DECIMAL(14,2),
  emi_amount      DECIMAL(12,2),
  interest_rate   DECIMAL(5,2),
  tenure_months   INTEGER,
  tenure_remaining INTEGER,
  disbursement_date DATE,
  days_past_due   INTEGER DEFAULT 0,
  account_status  VARCHAR(20),            -- ACTIVE, CLOSED, OVERDUE, WRITTEN_OFF
  credit_limit    DECIMAL(14,2),          -- for credit cards
  current_balance DECIMAL(14,2),          -- for credit cards
  utilization_pct DECIMAL(5,2),           -- for credit cards
  payment_history JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- AI Analysis Reports
CREATE TABLE ai_analysis_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  credit_report_id UUID REFERENCES credit_reports(id),
  debt_snapshot   JSONB,                  -- total debt, EMI burden, DTI ratio
  debt_free_timeline JSONB,              -- baseline & accelerated scenarios
  repayment_strategies JSONB,            -- avalanche, snowball, hybrid recommendations
  extra_payment_impact JSONB,            -- precalculated scenarios
  refinancing_analysis JSONB,            -- per-loan refinancing opportunities
  credit_health   JSONB,                  -- score interpretation, improvement tips
  narrative_text  TEXT,                   -- LLM-generated personalized narrative
  generated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Consultation Bookings
CREATE TABLE consultation_bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  advisor_id      UUID,
  service_type    VARCHAR(50),            -- strategy_session, credit_cleanup, legal_advice
  booking_date    DATE NOT NULL,
  booking_time    TIME NOT NULL,
  mode            VARCHAR(20),            -- video_call, phone_call
  status          VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  payment_id      VARCHAR(255),           -- Razorpay payment ID
  amount          DECIMAL(10,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Advisors
CREATE TABLE advisors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  title           VARCHAR(255),
  avatar_url      TEXT,
  rating          DECIMAL(3,2),
  total_reviews   INTEGER DEFAULT 0,
  specializations TEXT[],
  available_slots JSONB,                  -- weekly schedule
  is_active       BOOLEAN DEFAULT TRUE
);
```

---

## 6. Project Structure

```
debto/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Public pages
│   │   │   ├── page.tsx              # Landing page
│   │   │   └── layout.tsx
│   │   ├── auth/
│   │   │   ├── signup/page.tsx       # Registration (phone + Google)
│   │   │   ├── login/page.tsx        # Login
│   │   │   └── verify-otp/page.tsx   # OTP verification
│   │   ├── kyc/
│   │   │   ├── identity/page.tsx     # Step 1: PAN + Aadhaar + DOB
│   │   │   ├── consent/page.tsx      # Step 2: CIBIL consent
│   │   │   └── fetching/page.tsx     # Step 3: Progress + result
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Sidebar layout
│   │   │   ├── page.tsx              # Main dashboard
│   │   │   ├── credit-report/page.tsx
│   │   │   ├── ai-analysis/page.tsx
│   │   │   ├── calculators/
│   │   │   │   ├── page.tsx          # Calculator hub
│   │   │   │   ├── extra-payment/page.tsx
│   │   │   │   └── balance-transfer/page.tsx
│   │   │   ├── consultation/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/                      # API Route Handlers
│   │   │   ├── auth/
│   │   │   │   ├── send-otp/route.ts
│   │   │   │   ├── verify-otp/route.ts
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   ├── kyc/
│   │   │   │   ├── verify-pan/route.ts
│   │   │   │   └── consent/route.ts
│   │   │   ├── cibil/
│   │   │   │   ├── fetch-report/route.ts
│   │   │   │   └── refresh-score/route.ts
│   │   │   ├── analysis/
│   │   │   │   └── generate/route.ts
│   │   │   ├── calculators/
│   │   │   │   ├── extra-payment/route.ts
│   │   │   │   └── balance-transfer/route.ts
│   │   │   ├── consultation/
│   │   │   │   ├── book/route.ts
│   │   │   │   └── payment/route.ts
│   │   │   └── reports/
│   │   │       └── download-pdf/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # Shared UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   ├── landing/                  # Landing page sections
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── testimonials.tsx
│   │   │   └── faq.tsx
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── otp-input.tsx
│   │   │   └── google-button.tsx
│   │   ├── kyc/
│   │   │   ├── identity-form.tsx
│   │   │   ├── consent-form.tsx
│   │   │   ├── fetch-progress.tsx
│   │   │   └── stepper.tsx
│   │   ├── dashboard/
│   │   │   ├── sidebar.tsx
│   │   │   ├── summary-cards.tsx
│   │   │   ├── debt-breakdown-chart.tsx
│   │   │   └── active-loans-table.tsx
│   │   ├── credit-report/
│   │   │   ├── score-gauge.tsx
│   │   │   ├── score-factors.tsx
│   │   │   ├── loan-card.tsx
│   │   │   ├── credit-card-item.tsx
│   │   │   └── payment-timeline.tsx
│   │   ├── analysis/
│   │   │   ├── debt-snapshot.tsx
│   │   │   ├── debt-free-timeline.tsx
│   │   │   ├── repayment-strategy.tsx
│   │   │   ├── extra-payment-impact.tsx
│   │   │   ├── balance-transfer-card.tsx
│   │   │   └── credit-health-factors.tsx
│   │   ├── calculators/
│   │   │   ├── extra-payment-form.tsx
│   │   │   ├── balance-transfer-form.tsx
│   │   │   └── loan-projection-chart.tsx
│   │   └── consultation/
│   │       ├── service-selector.tsx
│   │       ├── advisor-card.tsx
│   │       ├── calendar-picker.tsx
│   │       └── booking-summary.tsx
│   ├── lib/
│   │   ├── supabase/                 # Supabase clients
│   │   │   ├── client.ts             # Browser-side Supabase client (anon key)
│   │   │   └── server.ts             # Server-side Supabase client (service role)
│   │   ├── decentro/                 # Decentro API client
│   │   │   ├── client.ts             # Base HTTP client with auth headers
│   │   │   ├── kyc.ts                # PAN verification functions
│   │   │   ├── credit-bureau.ts      # CIBIL report fetch functions
│   │   │   └── types.ts              # TypeScript types for API responses
│   │   ├── ai/
│   │   │   ├── analysis-engine.ts    # Financial calculations (deterministic)
│   │   │   ├── narrative-generator.ts # Claude API for text generation
│   │   │   └── prompts.ts            # LLM prompt templates
│   │   ├── financial/
│   │   │   ├── amortization.ts       # Amortization schedule calculator
│   │   │   ├── strategies.ts         # Avalanche, snowball, hybrid logic
│   │   │   ├── extra-payment.ts      # Extra payment impact calculator
│   │   │   └── balance-transfer.ts   # Balance transfer analysis
│   │   ├── auth/
│   │   │   ├── options.ts            # NextAuth configuration
│   │   │   └── otp.ts               # MSG91 OTP send/verify
│   │   ├── db/
│   │   │   └── prisma.ts            # Prisma client singleton
│   │   ├── rate-limit.ts              # In-memory rate limiter
│   │   ├── encryption.ts             # AES-256 encrypt/decrypt for sensitive data
│   │   ├── pdf-generator.ts          # Report PDF generation
│   │   └── utils.ts                  # Shared utilities
│   ├── hooks/                        # React hooks
│   │   ├── use-credit-report.ts
│   │   ├── use-analysis.ts
│   │   └── use-calculators.ts
│   └── types/                        # Global TypeScript types
│       ├── credit-report.ts
│       ├── analysis.ts
│       └── user.ts
├── prisma/
│   └── schema.prisma                 # Uses directUrl for Supabase migrations
├── public/
│   └── assets/
├── .env.local                        # Environment variables (Supabase keys, no Docker)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. Sprint Plan (12 Weeks)

### Sprint 1 (Weeks 1-2): Foundation & Auth

**Goal:** Project scaffold, design system, authentication flow

| Task | Details | Screen Reference |
|------|---------|-----------------|
| Project setup | Next.js 14, Tailwind, Prisma, TypeScript, ESLint | - |
| Design tokens | Colors (navy `#1B2559`, orange `#F5913E`, teal accents), typography, spacing from screens | All screens |
| UI component library | Button, Input, Card, Badge, Progress, Modal based on screen designs | All screens |
| Landing page | Hero, 3-step flow, feature cards, tools grid, testimonials, FAQ, footer | `debto_landing_page_desktop` |
| Registration page | Split layout, phone input (+91), Google OAuth button, "Send OTP" CTA | `login_screen_initial_desktop` |
| OTP verification | 6-digit input boxes, countdown timer, resend logic | `otp_verification_desktop` |
| Error states | Invalid phone, incorrect OTP, max attempts | `login_error_states_desktop` |
| MSG91 integration | Send OTP, verify OTP API routes | - |
| NextAuth.js setup | Google OAuth provider + custom OTP credentials provider | - |
| DB setup | Prisma schema, initial migration, Supabase PostgreSQL connection | - |

**Deliverable:** User can land, register with phone/Google, verify OTP, and be authenticated.

---

### Sprint 2 (Weeks 3-4): KYC & Decentro Integration

**Goal:** Identity verification and CIBIL report fetching

| Task | Details | Screen Reference |
|------|---------|-----------------|
| Decentro API client | Base client with auth headers, error handling, retry logic | - |
| KYC Step 1: Identity form | Full name, PAN input with validation, DOB picker, Aadhaar input with masking | `kyc_identity_desktop` |
| PAN verification | Decentro PAN API integration, real-time validation with green checkmark | `kyc_identity_desktop` |
| KYC Step 2: Consent | Consent text, mandatory + optional checkboxes, audit trail storage | `cibil_consent_step_2` |
| Stepper component | 3-step progress indicator (Identity → Consent → Report) | `kyc_identity_desktop` |
| CIBIL fetch - loading | 4-step progress (PAN verify → Aadhaar verify → CIBIL fetch → AI analysis) | `cibil_fetch_in_progress` |
| CIBIL fetch - success | Success animation, auto-redirect to dashboard | `cibil_fetch_success` |
| CIBIL fetch - error | Error display with "Try Again" and "Contact Support" CTAs | `cibil_fetch_error` |
| Credit report parser | Parse Decentro response into normalized loan_accounts records | - |
| Encryption layer | AES-256 encryption for PAN, Aadhaar (hashed), and raw credit report | - |
| Consent record storage | Store consent with timestamp, IP, user agent, consent version | - |

**Decentro API Calls:**
```
1. POST /v2/kyc/public_registry/validate  (PAN verification)
2. POST /v2/financial_services/credit_bureau/credit_report/summary  (CIBIL fetch)
```

**Deliverable:** User completes KYC, CIBIL report is fetched and stored securely.

---

### Sprint 3 (Weeks 5-6): Credit Report View & Dashboard

**Goal:** Display credit report and main dashboard

| Task | Details | Screen Reference |
|------|---------|-----------------|
| Dashboard layout | Sidebar navigation (Dashboard, Credit Report, AI Analysis, Calculators, Consultations, Settings) | `customer_dashboard` |
| Dashboard page | Greeting, CIBIL score badge, total debt card, monthly EMIs card, debt-free date card | `customer_dashboard` |
| Debt breakdown chart | Donut chart showing debt by loan type | `customer_dashboard` |
| Active loans table | Loan list with institution, outstanding, EMI amounts | `customer_dashboard` |
| Credit report page | Full report with tabbed view (All, Active Loans, Credit Cards, Closed, Overdue, Inquiries) | `cibil_credit_report_view` |
| Score gauge | Animated circular score gauge (300-900) with zone labels | `cibil_credit_report_view` |
| Score factors | Horizontal bar indicators for Payment History, Credit Utilization, Credit Age, Credit Mix, Hard Inquiries | `cibil_credit_report_view` |
| Loan detail cards | Per-loan cards with institution, A/C number, outstanding, EMI, interest rate, sanctioned amount, payment timeline bar | `cibil_credit_report_view` |
| Credit card items | Utilization bar, total due, minimum due, due date | `cibil_credit_report_view` |
| "Refresh CIBIL Report" | Re-fetch button with rate limiting (1 per 30 days) | `customer_dashboard` |
| "Upgrade to Pro" CTA | Sidebar upsell button | `cibil_credit_report_view` |

**Deliverable:** Full dashboard and credit report viewing experience.

---

### Sprint 4 (Weeks 7-8): AI Analysis Engine

**Goal:** Financial calculation engine + AI narrative generation

| Task | Details | Screen Reference |
|------|---------|-----------------|
| **Financial Calculation Engine** (deterministic, no LLM): | | |
| Debt snapshot calculator | Total debt, monthly EMI burden, DTI ratio, active loan count, health indicator | `ai_debt_analysis_report` |
| Debt-free timeline | Baseline (current EMIs only) vs optimized (with strategy) projections | `ai_debt_analysis_report` |
| Amortization engine | Full amortization schedules for each loan | - |
| Avalanche strategy | Sort by highest interest rate, calculate total interest saved vs current | `ai_debt_analysis_report` |
| Snowball strategy | Sort by lowest balance, calculate payoff order | `ai_debt_analysis_report` |
| AI-recommended strategy | Hybrid optimization based on user's specific portfolio | `ai_debt_analysis_report` |
| Extra payment simulator | Pre-calculate impact of ₹1K, ₹2K, ₹5K, ₹10K, ₹15K extra/month | `ai_debt_analysis_report` |
| Balance transfer analysis | Compare current rate vs market benchmark, calculate potential savings | `ai_debt_analysis_report` |
| Credit health assessment | Score interpretation, utilization analysis, payment history grade | `ai_debt_analysis_report` |
| **AI Narrative Generator** (Claude API): | | |
| Prompt engineering | System prompt with user's financial data, generate personalized insights | - |
| Narrative sections | AI Insight box ("Be debt-free 14 months earlier"), smart suggestions | `ai_debt_analysis_report` |
| AI Analysis page | Full page with all components: snapshot, timeline chart, strategy tabs, extra payment section, balance transfer, credit health | `ai_debt_analysis_report` |
| PDF report generation | Branded PDF with all analysis sections | - |
| Share via WhatsApp/Email | Share buttons for report | `ai_debt_analysis_report` |

**Key Design Principle:** All financial numbers come from the deterministic calculation engine. Claude API is ONLY used for generating the narrative/advice text (the "AI Insight" boxes and personalized recommendations text).

**Deliverable:** Complete AI analysis report with all visualizations and downloadable PDF.

---

### Sprint 5 (Weeks 9-10): Calculators & Consultation

**Goal:** Interactive calculators and consultation booking

| Task | Details | Screen Reference |
|------|---------|-----------------|
| Calculators hub | 3 calculator cards with descriptions and CTAs | `calculators_hub` |
| Extra payment calculator | Loan selector, parameters display, additional payment slider, impact metrics (new payoff date, months saved, interest saved), projection chart, amortization table, "Smart Suggestion" box | `extra_payment_calculator_detail` |
| Balance transfer analyzer | Current loan details, target bank selector, rate/fee comparison, total outflow comparison, break-even analysis chart, "Fee Impact Warning" info box | `balance_transfer_analyzer` |
| Loan consolidation planner | Combine multiple loans scenario calculator | `calculators_hub` |
| Consultation booking page | Service type selector (3 tiers with pricing), advisor cards with ratings, calendar date picker, time slot grid, preferred mode (video/phone), booking summary sidebar with pricing | `consultation_booking` |
| Razorpay integration | Payment flow for consultation booking | - |
| Booking confirmation | Email/SMS notification on successful booking | - |
| Settings page | Profile tab (name, email, phone, city, income), Security tab, Notifications tab, Data & Privacy tab | `settings_profile` |

**Deliverable:** All calculators functional, consultation booking with payment.

---

### Sprint 6 (Weeks 11-12): Polish, Security & Launch Prep

**Goal:** Security hardening, testing, performance, and launch

| Task | Details |
|------|---------|
| Security audit | Input validation, SQL injection prevention, XSS protection, CSRF tokens |
| Data encryption verification | Verify AES-256 for PAN/Aadhaar/credit reports at rest |
| Rate limiting | API rate limits (Decentro calls, OTP sends, report fetches) |
| Error handling | Global error boundaries, API error handling, user-friendly error messages |
| Loading states | Skeleton loaders for all data-fetching pages |
| Responsive design | Mobile responsive for all 17 screens |
| SEO | Meta tags, OG images, structured data for landing page |
| Performance | Image optimization, code splitting, lazy loading, Core Web Vitals |
| Analytics | Mixpanel/Vercel Analytics event tracking (registration, KYC completion, report view, consultation booking) |
| Legal pages | Privacy Policy, Terms of Service, Cookie Policy pages |
| Admin basics | Simple admin view for user list, consultation bookings, lead pipeline |
| E2E testing | Playwright tests for critical flows (signup → KYC → report → analysis) |
| Staging deployment | Full staging environment with Decentro sandbox |
| Production deployment | Vercel + Supabase (`ap-northeast-1`), environment variables, domain setup |

**Deliverable:** Production-ready platform.

---

## 8. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=https://debto.in
NODE_ENV=production

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...        # Publishable anon key
SUPABASE_SERVICE_ROLE_KEY=...           # Server-side only, never expose to browser

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://debto.in
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# MSG91 (OTP)
MSG91_AUTH_KEY=...
MSG91_TEMPLATE_ID=...

# Decentro
DECENTRO_CLIENT_ID=...
DECENTRO_CLIENT_SECRET=...
DECENTRO_MASTER_CONSUMER_URN=...
DECENTRO_KYC_MODULE_SECRET=...          # From Decentro dashboard
DECENTRO_BYTES_MODULE_SECRET=...        # From Decentro dashboard
DECENTRO_BASE_URL=https://in.staging.decentro.tech  # Switch to production for launch

# Anthropic (AI Analysis)
ANTHROPIC_API_KEY=...

# Razorpay
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# Encryption
ENCRYPTION_KEY=...                       # 32-byte key for AES-256

# Sentry
SENTRY_DSN=...
```

> **No Docker required.** No local PostgreSQL or Redis needed. All services are cloud-hosted on Supabase.

---

## 9. Key Implementation Notes

### Security (DPDP Act Compliance)
- **Never store raw Aadhaar** — only store SHA-256 hash for matching
- **PAN stored encrypted** (AES-256) — decrypt only when needed for API calls
- **Credit report data auto-expires** after 90 days (DB trigger or cron job)
- **Consent is mandatory and audited** — every fetch requires fresh consent record
- **Supabase RLS enabled** on all tables — enforced at database level
- **All data on Supabase** (`ap-northeast-1` region) + Vercel Edge
- **User can request data deletion** — implement right-to-erasure in Settings > Data & Privacy
- **No local services** — zero Docker dependencies, fully cloud-hosted

### Supabase Infrastructure
- **PostgreSQL** — Managed database with automatic backups, pgBouncer connection pooling
- **Storage** — File storage for PDF reports with RLS policies
- **Prisma ORM** — Connects via pgBouncer (`DATABASE_URL`, port 6543) for queries, direct connection (`DIRECT_URL`, port 5432) for migrations
- **RLS enabled** on all 9 tables — security enforced at database level
- **No Redis needed** — rate limiting uses in-memory store (suitable for serverless)

### Financial Calculations (Never Use LLM)
- Amortization schedules: deterministic formula-based
- Strategy comparisons: programmatic sorting and calculation
- Interest savings: mathematical computation
- All numbers must be reproducible and auditable

### AI/LLM Usage (Claude API)
- Generate personalized narrative text only
- "AI Insight" boxes with actionable advice
- Credit health improvement suggestions in natural language
- Never let LLM generate or modify financial numbers

### Decentro Integration Best Practices
- Always use `reference_id` with a UUID for idempotency
- Store `decentroTxnId` from every response for support/debugging
- Implement exponential backoff retry for transient errors
- Cache PAN verification results (same PAN = same result)
- Log all API calls with request/response (redact sensitive fields) for audit trail

---

## 10. Cost Estimates Per User

| Item | Cost |
|------|------|
| CIBIL Report Fetch (Decentro) | ₹15–40 |
| PAN Verification (Decentro) | ₹2–5 |
| AI Analysis (Claude API ~2K tokens) | ₹2–5 |
| OTP SMS (MSG91) | ₹0.20 |
| Infrastructure (amortized) | ₹1–2 |
| **Total per free user** | **~₹20–52** |

With 7% conversion to consultation at ₹4,000 avg = ₹280 LTV per user, making unit economics viable.
