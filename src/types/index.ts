// ─── Credit Report Types ────────────────────────────────────────

export interface CreditReportData {
  creditScore: number;
  reportDate: string;
  accounts: LoanAccountData[];
  inquiries: InquiryData[];
}

export interface LoanAccountData {
  id: string;
  accountNumber: string | null;
  institution: string | null;
  loanType: string | null;
  sanctionedAmount: number;
  outstandingBalance: number;
  emiAmount: number;
  interestRate: number;
  tenureMonths: number | null;
  tenureRemaining: number | null;
  disbursementDate: string | null;
  daysPastDue: number;
  accountStatus: string | null;
  creditLimit: number | null;
  currentBalance: number | null;
  utilizationPct: number | null;
  paymentHistory: string[] | null;
}

export interface InquiryData {
  date: string;
  institution: string;
  purpose: string;
}

// ─── AI Analysis Types ──────────────────────────────────────────

export interface AIAnalysisData {
  id: string;
  generatedFor: string;
  generatedAt: string;
  debtSnapshot: DebtSnapshot;
  debtFreeTimeline: DebtFreeTimeline;
  repaymentStrategies: RepaymentStrategy[];
  extraPaymentImpact: ExtraPaymentImpact;
  refinancingAnalysis: RefinancingAnalysis | null;
  creditHealth: CreditHealth;
  narrativeText: string;
  monthlyIncome: number | null;
}

export interface DebtSnapshot {
  totalDebt: number;
  monthlyEMI: number;
  activeLoans: number;
  debtToIncome: number;
  healthStatus: string;
}

export interface DebtFreeTimeline {
  currentPayoff: string;
  optimizedPayoff: string;
  monthsSaved: number;
  totalSaved: number;
  currentMonths: number;
  optimizedMonths: number;
}

export interface RepaymentStrategy {
  id: string;
  label: string;
  description: string;
  loans: StrategyLoan[];
}

export interface StrategyLoan {
  name: string;
  apr: number;
  balance: number;
  payment: number;
  icon: string;
  payFirst?: boolean;
  extra?: number;
}

export interface ExtraPaymentImpact {
  suggestedExtra: number;
  newDate: string;
  monthsSaved: number;
  interestSaved: number;
}

export interface RefinancingAnalysis {
  current: {
    lender: string | null;
    type: string | null;
    balance: number;
    apr: number;
  };
  offer: {
    lender: string;
    type: string;
    apr: number;
    feesIncluded: boolean;
  };
  potentialSavings: number;
}

export interface CreditHealth {
  utilization: { value: number; status: string };
  inquiries: { value: number; status: string };
  paymentHistory: { value: number; status: string };
  accountMix: { value: number; status: string };
}

// ─── Dashboard Types ────────────────────────────────────────────

export interface DashboardData {
  user: UserProfile;
  creditScore: number | null;
  reportId: string | null;
  reportDate: string | null;
  totalDebt: number;
  monthlyEMI: number;
  activeLoansCount: number;
  loanAccounts: LoanAccountData[];
  analysis: {
    id: string;
    debtSnapshot: DebtSnapshot;
    debtFreeTimeline: DebtFreeTimeline;
    repaymentStrategies: RepaymentStrategy[];
    narrativeText: string;
  } | null;
}

// ─── User Types ─────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  monthlyIncome: number | null;
  avatarUrl: string | null;
}

export interface SessionUser {
  userId: string;
  phone: string;
  name?: string;
  kycComplete?: boolean;
}

// ─── Calculator Types ───────────────────────────────────────────

export interface ExtraPaymentResult {
  success: boolean;
  current: {
    totalMonths: number;
    payoffDate: string;
    totalInterest: number;
    totalPaid: number;
  };
  optimized: {
    totalMonths: number;
    payoffDate: string;
    totalInterest: number;
    totalPaid: number;
  };
  impact: {
    monthsSaved: number;
    interestSaved: number;
    newPayoffDate: string;
  };
  projectionCurrent: { month: number; balance: number }[];
  projectionOptimized: { month: number; balance: number }[];
  amortizationSchedule: {
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export interface BalanceTransferResult {
  success: boolean;
  current: { emi: number; totalCost: number; totalInterest: number; apr: number };
  transfer: {
    emi: number;
    totalCost: number;
    totalInterest: number;
    apr: number;
    fee: number;
    effectiveBalance: number;
  };
  savings: {
    totalSavings: number;
    interestSaved: number;
    monthlySavings: number;
    worthIt: boolean;
  };
  recommendation: string;
}

// ─── Consultation Types ─────────────────────────────────────────

export interface ConsultationService {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  specializations: string[];
}

export interface BookingRequest {
  serviceType: string;
  advisorId: string;
  date: string;
  time: string;
  mode: "video_call" | "phone_call";
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  razorpay: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };
  service: {
    name: string;
    subtotal: number;
    gst: number;
    total: number;
  };
}
