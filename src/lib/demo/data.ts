import type {
  DashboardData,
  CreditReportData,
  AIAnalysisData,
  SessionUser,
  LoanAccountData,
} from "@/types";

// ─── Demo User ─────────────────────────────────────────────────

export const DEMO_SESSION_USER: SessionUser = {
  userId: "demo-user-001",
  phone: "9876543210",
  name: "Rajesh Kumar",
  kycComplete: true,
};

// ─── Loan Accounts (shared across dashboard & credit report) ───

const DEMO_LOANS: LoanAccountData[] = [
  {
    id: "loan-001",
    accountNumber: "HDFC****7821",
    institution: "HDFC Bank",
    loanType: "Home Loan",
    sanctionedAmount: 3500000,
    outstandingBalance: 2545000,
    emiAmount: 28500,
    interestRate: 8.5,
    tenureMonths: 240,
    tenureRemaining: 156,
    disbursementDate: "2019-03-15",
    daysPastDue: 0,
    accountStatus: "ACTIVE",
    creditLimit: null,
    currentBalance: null,
    utilizationPct: null,
    paymentHistory: [
      "on_time", "on_time", "on_time", "on_time", "on_time", "on_time",
      "on_time", "on_time", "on_time", "on_time", "on_time", "on_time",
    ],
  },
  {
    id: "loan-002",
    accountNumber: "SBI****3456",
    institution: "SBI",
    loanType: "Personal Loan",
    sanctionedAmount: 200000,
    outstandingBalance: 112000,
    emiAmount: 8500,
    interestRate: 14.5,
    tenureMonths: 24,
    tenureRemaining: 14,
    disbursementDate: "2025-04-10",
    daysPastDue: 32,
    accountStatus: "OVERDUE",
    creditLimit: null,
    currentBalance: null,
    utilizationPct: null,
    paymentHistory: [
      "on_time", "on_time", "on_time", "on_time", "on_time", "on_time",
      "on_time", "on_time", "late", "late", "on_time", "on_time",
    ],
  },
  {
    id: "loan-003",
    accountNumber: "ICICI****9012",
    institution: "ICICI Bank",
    loanType: "Credit Card",
    sanctionedAmount: 0,
    outstandingBalance: 150000,
    emiAmount: 0,
    interestRate: 42.0,
    tenureMonths: null,
    tenureRemaining: null,
    disbursementDate: "2022-08-01",
    daysPastDue: 0,
    accountStatus: "ACTIVE",
    creditLimit: 250000,
    currentBalance: 150000,
    utilizationPct: 60,
    paymentHistory: [
      "on_time", "on_time", "on_time", "on_time", "on_time", "on_time",
      "on_time", "on_time", "on_time", "on_time", "on_time", "on_time",
    ],
  },
  {
    id: "loan-004",
    accountNumber: "AXIS****5678",
    institution: "Axis Bank",
    loanType: "Auto Loan",
    sanctionedAmount: 600000,
    outstandingBalance: 380000,
    emiAmount: 12400,
    interestRate: 9.2,
    tenureMonths: 60,
    tenureRemaining: 32,
    disbursementDate: "2023-11-20",
    daysPastDue: 0,
    accountStatus: "ACTIVE",
    creditLimit: null,
    currentBalance: null,
    utilizationPct: null,
    paymentHistory: [
      "on_time", "on_time", "on_time", "on_time", "on_time", "on_time",
      "on_time", "on_time", "on_time", "on_time", "on_time", "on_time",
    ],
  },
];

// ─── Demo Dashboard Data ───────────────────────────────────────

export const DEMO_DASHBOARD: DashboardData = {
  user: {
    id: "demo-user-001",
    name: "Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh.demo@debto.in",
    city: "Mumbai",
    monthlyIncome: 85000,
    avatarUrl: null,
  },
  creditScore: 742,
  reportId: "demo-report-001",
  reportDate: "2026-03-10T08:00:00.000Z",
  totalDebt: 3187000,
  monthlyEMI: 49400,
  activeLoansCount: 4,
  loanAccounts: DEMO_LOANS,
  analysis: {
    id: "demo-analysis-001",
    debtSnapshot: {
      totalDebt: 3187000,
      monthlyEMI: 49400,
      activeLoans: 4,
      debtToIncome: 58,
      healthStatus: "Needs Attention",
    },
    debtFreeTimeline: {
      currentPayoff: "March 2039",
      optimizedPayoff: "September 2036",
      monthsSaved: 30,
      totalSaved: 482000,
      currentMonths: 156,
      optimizedMonths: 126,
    },
    repaymentStrategies: [
      {
        id: "avalanche",
        label: "Avalanche",
        description: "Pay highest interest rate first",
        loans: [
          { name: "ICICI Bank Credit Card", apr: 42.0, balance: 150000, payment: 0, icon: "credit_card", payFirst: true, extra: 2470 },
          { name: "SBI Personal Loan", apr: 14.5, balance: 112000, payment: 8500, icon: "person" },
          { name: "Axis Bank Auto Loan", apr: 9.2, balance: 380000, payment: 12400, icon: "directions_car" },
          { name: "HDFC Bank Home Loan", apr: 8.5, balance: 2545000, payment: 28500, icon: "home" },
        ],
      },
      {
        id: "snowball",
        label: "Snowball",
        description: "Pay smallest balance first",
        loans: [
          { name: "SBI Personal Loan", apr: 14.5, balance: 112000, payment: 8500, icon: "person", payFirst: true, extra: 2470 },
          { name: "ICICI Bank Credit Card", apr: 42.0, balance: 150000, payment: 0, icon: "credit_card" },
          { name: "Axis Bank Auto Loan", apr: 9.2, balance: 380000, payment: 12400, icon: "directions_car" },
          { name: "HDFC Bank Home Loan", apr: 8.5, balance: 2545000, payment: 28500, icon: "home" },
        ],
      },
      {
        id: "ai",
        label: "AI Recommended",
        description: "Optimized blend of both strategies",
        loans: [
          { name: "SBI Personal Loan", apr: 14.5, balance: 112000, payment: 8500, icon: "person", payFirst: true, extra: 2470 },
          { name: "ICICI Bank Credit Card", apr: 42.0, balance: 150000, payment: 0, icon: "credit_card" },
          { name: "Axis Bank Auto Loan", apr: 9.2, balance: 380000, payment: 12400, icon: "directions_car" },
          { name: "HDFC Bank Home Loan", apr: 8.5, balance: 2545000, payment: 28500, icon: "home" },
        ],
      },
    ],
    narrativeText:
      "Your total outstanding debt is ₹31.9L across 4 active accounts. " +
      "Your debt-to-income ratio is 58%, which is above the recommended 35% threshold. " +
      "Your SBI Personal Loan is currently 32 days past due — prioritizing this payment will prevent further credit score damage. " +
      "The ICICI credit card has a 60% utilization rate; bringing it under 30% could boost your CIBIL score by 20-40 points. " +
      "By following the AI-recommended strategy, you could become debt-free 30 months earlier and save approximately ₹4.8L in interest.",
  },
};

// ─── Demo Credit Report ────────────────────────────────────────

export const DEMO_CREDIT_REPORT: CreditReportData = {
  creditScore: 742,
  reportDate: "2026-03-10T08:00:00.000Z",
  accounts: DEMO_LOANS,
  inquiries: [
    { date: "2025-12-15", institution: "Bajaj Finance", purpose: "Personal Loan" },
    { date: "2025-09-20", institution: "HDFC Bank", purpose: "Credit Card" },
    { date: "2025-06-10", institution: "Axis Bank", purpose: "Auto Loan" },
  ],
};

// ─── Demo AI Analysis ──────────────────────────────────────────

export const DEMO_AI_ANALYSIS: AIAnalysisData = {
  id: "demo-analysis-001",
  generatedFor: "Rajesh Kumar",
  generatedAt: "2026-03-10T08:30:00.000Z",
  debtSnapshot: {
    totalDebt: 3187000,
    monthlyEMI: 49400,
    activeLoans: 4,
    debtToIncome: 58,
    healthStatus: "Needs Attention",
  },
  debtFreeTimeline: {
    currentPayoff: "March 2039",
    optimizedPayoff: "September 2036",
    monthsSaved: 30,
    totalSaved: 482000,
    currentMonths: 156,
    optimizedMonths: 126,
  },
  repaymentStrategies: [
    {
      id: "avalanche",
      label: "Avalanche",
      description: "Pay highest interest rate first",
      loans: [
        { name: "ICICI Bank Credit Card", apr: 42.0, balance: 150000, payment: 0, icon: "credit_card", payFirst: true, extra: 2470 },
        { name: "SBI Personal Loan", apr: 14.5, balance: 112000, payment: 8500, icon: "person" },
        { name: "Axis Bank Auto Loan", apr: 9.2, balance: 380000, payment: 12400, icon: "directions_car" },
        { name: "HDFC Bank Home Loan", apr: 8.5, balance: 2545000, payment: 28500, icon: "home" },
      ],
    },
    {
      id: "snowball",
      label: "Snowball",
      description: "Pay smallest balance first",
      loans: [
        { name: "SBI Personal Loan", apr: 14.5, balance: 112000, payment: 8500, icon: "person", payFirst: true, extra: 2470 },
        { name: "ICICI Bank Credit Card", apr: 42.0, balance: 150000, payment: 0, icon: "credit_card" },
        { name: "Axis Bank Auto Loan", apr: 9.2, balance: 380000, payment: 12400, icon: "directions_car" },
        { name: "HDFC Bank Home Loan", apr: 8.5, balance: 2545000, payment: 28500, icon: "home" },
      ],
    },
    {
      id: "ai",
      label: "AI Recommended",
      description: "Optimized blend of both strategies",
      loans: [
        { name: "SBI Personal Loan", apr: 14.5, balance: 112000, payment: 8500, icon: "person", payFirst: true, extra: 2470 },
        { name: "ICICI Bank Credit Card", apr: 42.0, balance: 150000, payment: 0, icon: "credit_card" },
        { name: "Axis Bank Auto Loan", apr: 9.2, balance: 380000, payment: 12400, icon: "directions_car" },
        { name: "HDFC Bank Home Loan", apr: 8.5, balance: 2545000, payment: 28500, icon: "home" },
      ],
    },
  ],
  extraPaymentImpact: {
    suggestedExtra: 7410,
    newDate: "January 2037",
    monthsSaved: 24,
    interestSaved: 356000,
  },
  refinancingAnalysis: {
    current: {
      lender: "SBI",
      type: "Personal Loan",
      balance: 112000,
      apr: 14.5,
    },
    offer: {
      lender: "Market Best Rate",
      type: "Transfer Offer",
      apr: 11.5,
      feesIncluded: true,
    },
    potentialSavings: 10080,
  },
  creditHealth: {
    utilization: { value: 60, status: "High" },
    inquiries: { value: 3, status: "Optimal range" },
    paymentHistory: { value: 96, status: "On-Time Payments" },
    accountMix: { value: 4, status: "Excellent" },
  },
  narrativeText:
    "Your total outstanding debt is ₹31.9L across 4 active accounts. " +
    "Your debt-to-income ratio is 58%, which is above the recommended 35% threshold. " +
    "Your SBI Personal Loan is currently 32 days past due — prioritizing this payment will prevent further credit score damage. " +
    "The ICICI credit card has a 60% utilization rate; bringing it under 30% could boost your CIBIL score by 20-40 points. " +
    "By following the AI-recommended strategy, you could become debt-free 30 months earlier and save approximately ₹4.8L in interest.",
  monthlyIncome: 85000,
};

// ─── Demo Profile (matches settings/profile GET response) ──────

export const DEMO_PROFILE = {
  id: "demo-user-001",
  fullName: "Rajesh Kumar",
  phone: "9876543210",
  email: "rajesh.demo@debto.in",
  city: "Mumbai",
  avatarUrl: null,
  createdAt: "2025-06-15T10:30:00.000Z",
  lastReportSync: "2026-03-10T08:00:00.000Z",
};

// ─── Demo Booking Response ─────────────────────────────────────

export const DEMO_BOOKING_RESPONSE = {
  success: true,
  bookingId: "demo-booking-001",
  razorpay: {
    orderId: "order_demo_001",
    amount: 117882,
    currency: "INR",
    keyId: "rzp_demo_key",
  },
  service: {
    name: "Debt Strategy Session",
    subtotal: 999,
    gst: 180,
    total: 1179,
  },
};
