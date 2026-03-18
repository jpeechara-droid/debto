/**
 * Decentro API Service
 * Handles PAN verification & CIBIL credit report fetching
 *
 * Docs: https://docs.decentro.tech
 * Staging: https://in.staging.decentro.tech/v2/
 */

const getBaseUrl = () =>
  process.env.DECENTRO_BASE_URL || "https://in.staging.decentro.tech";

const getHeaders = (moduleSecret?: string) => ({
  client_id: process.env.DECENTRO_CLIENT_ID || "",
  client_secret: process.env.DECENTRO_CLIENT_SECRET || "",
  module_secret: moduleSecret || process.env.DECENTRO_KYC_MODULE_SECRET || "",
  "Content-Type": "application/json",
});

// ─── PAN Verification ────────────────────────────────────────────

export interface PANVerificationResult {
  success: boolean;
  verified: boolean;
  name?: string;
  panNumber?: string;
  decentroTxnId?: string;
  error?: string;
}

export async function verifyPAN(
  panNumber: string
): Promise<PANVerificationResult> {
  const clientId = process.env.DECENTRO_CLIENT_ID;

  // Dev mode fallback
  if (!clientId) {
    console.log(`[DEV] PAN verification simulated for ${panNumber}`);
    return {
      success: true,
      verified: true,
      name: "RAJESH KUMAR",
      panNumber: panNumber.toUpperCase(),
      decentroTxnId: `dev_pan_${Date.now()}`,
    };
  }

  try {
    const referenceId = `debto_pan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const response = await fetch(
      `${getBaseUrl()}/v2/kyc/public_registry/validate`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          reference_id: referenceId,
          document_type: "PAN_DETAILED",
          id_number: panNumber.toUpperCase(),
          consent: "Y",
        }),
      }
    );

    const data = await response.json();

    if (data.status === "SUCCESS" && data.kycStatus === "SUCCESS") {
      return {
        success: true,
        verified: true,
        name: data.kycResult?.name || undefined,
        panNumber: data.kycResult?.idNumber || panNumber.toUpperCase(),
        decentroTxnId: data.decentroTxnId,
      };
    }

    return {
      success: true,
      verified: false,
      error: data.message || "PAN verification failed",
    };
  } catch (error) {
    console.error("Decentro PAN verification error:", error);
    return {
      success: false,
      verified: false,
      error: "PAN verification service unavailable",
    };
  }
}

// ─── CIBIL Credit Report ─────────────────────────────────────────

export interface CreditReportResult {
  success: boolean;
  decentroTxnId?: string;
  creditScore?: number;
  rawReport?: Record<string, unknown>;
  parsedSummary?: ParsedCreditSummary;
  pdfBase64?: string;
  error?: string;
}

export interface ParsedCreditSummary {
  score: number;
  scoreChange: number;
  activeAccounts: number;
  totalDebt: number;
  monthlyEMI: number;
  accounts: ParsedAccount[];
  inquiries: ParsedInquiry[];
}

export interface ParsedAccount {
  accountNumber: string;
  institution: string;
  loanType: string;
  sanctionedAmount: number;
  outstandingBalance: number;
  emiAmount: number;
  interestRate: number;
  tenureMonths: number;
  tenureRemaining: number;
  disbursementDate: string;
  daysPastDue: number;
  accountStatus: string;
  creditLimit?: number;
  currentBalance?: number;
  utilizationPct?: number;
  paymentHistory: string[];
}

export interface ParsedInquiry {
  date: string;
  institution: string;
  purpose: string;
}

/**
 * Fetch full CIBIL credit report via Decentro
 */
export async function fetchCreditReport(params: {
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  mobile: string;
  pan: string;
}): Promise<CreditReportResult> {
  const clientId = process.env.DECENTRO_CLIENT_ID;

  // Dev mode fallback — return mock data
  if (!clientId) {
    console.log("[DEV] Credit report fetch simulated");
    return getDevMockCreditReport();
  }

  try {
    const referenceId = `debto_cibil_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const response = await fetch(
      `${getBaseUrl()}/v2/financial_services/credit_bureau/credit_report/summary`,
      {
        method: "POST",
        headers: getHeaders(process.env.DECENTRO_BYTES_MODULE_SECRET),
        body: JSON.stringify({
          reference_id: referenceId,
          consent: true,
          consent_purpose: "Debt analysis and financial advisory",
          name: params.name,
          date_of_birth: params.dateOfBirth,
          mobile: params.mobile,
          pan: params.pan,
          inquiry_purpose: "PL",
          generate_pdf: true,
        }),
      }
    );

    const data = await response.json();

    if (data.status === "SUCCESS" && data.data?.cCRResponse) {
      const ccr = data.data.cCRResponse;
      const parsedSummary = parseCreditReport(ccr);

      return {
        success: true,
        decentroTxnId: data.decentroTxnId,
        creditScore: parsedSummary.score,
        rawReport: data.data,
        parsedSummary,
        pdfBase64: data.data.pdf_base64,
      };
    }

    return {
      success: false,
      error: data.message || "Failed to fetch credit report",
    };
  } catch (error) {
    console.error("Decentro credit report fetch error:", error);
    return {
      success: false,
      error: "Credit report service unavailable",
    };
  }
}

/**
 * Parse raw CIBIL response into our app's data structure
 */
function parseCreditReport(ccr: Record<string, unknown>): ParsedCreditSummary {
  const creditScore = ccr.creditScore as Record<string, unknown> | undefined;
  const score = parseInt(String(creditScore?.value || "0"), 10);

  const accountSummary = ccr.accountSummary as Record<string, unknown> | undefined;
  const retailAccounts = (ccr.retailAccountDetails || []) as Record<string, unknown>[];
  const enquiries = (ccr.enquiryDetails || []) as Record<string, unknown>[];

  const accounts: ParsedAccount[] = retailAccounts.map((acct) => ({
    accountNumber: String(acct.accountNumber || ""),
    institution: String(acct.institution || ""),
    loanType: String(acct.accountType || ""),
    sanctionedAmount: Number(acct.sanctionedAmount || 0),
    outstandingBalance: Number(acct.currentBalance || acct.outstandingBalance || 0),
    emiAmount: Number(acct.emiAmount || 0),
    interestRate: parseFloat(String(acct.interestRate || "0")),
    tenureMonths: Number(acct.tenure || 0),
    tenureRemaining: Number(acct.tenureRemaining || 0),
    disbursementDate: String(acct.disbursementDate || ""),
    daysPastDue: Number(acct.daysPastDue || 0),
    accountStatus: String(acct.accountStatus || "ACTIVE"),
    creditLimit: acct.creditLimit ? Number(acct.creditLimit) : undefined,
    currentBalance: acct.currentBalance ? Number(acct.currentBalance) : undefined,
    utilizationPct: acct.utilizationPct ? Number(acct.utilizationPct) : undefined,
    paymentHistory: Array.isArray(acct.paymentHistory) ? acct.paymentHistory.map(String) : [],
  }));

  const inquiries: ParsedInquiry[] = enquiries.map((enq) => ({
    date: String(enq.enquiryDate || enq.date || ""),
    institution: String(enq.institution || ""),
    purpose: String(enq.enquiryPurpose || enq.purpose || ""),
  }));

  return {
    score,
    scoreChange: 0,
    activeAccounts: Number(accountSummary?.activeAccounts || accounts.filter((a) => a.accountStatus === "ACTIVE").length),
    totalDebt: accounts.reduce((sum, a) => sum + a.outstandingBalance, 0),
    monthlyEMI: Number(accountSummary?.totalMonthlyPayment || accounts.reduce((sum, a) => sum + a.emiAmount, 0)),
    accounts,
    inquiries,
  };
}

/**
 * Dev mock credit report data
 */
function getDevMockCreditReport(): CreditReportResult {
  return {
    success: true,
    decentroTxnId: `dev_cibil_${Date.now()}`,
    creditScore: 742,
    rawReport: {},
    parsedSummary: {
      score: 742,
      scoreChange: 12,
      activeAccounts: 4,
      totalDebt: 3250000,
      monthlyEMI: 45200,
      accounts: [
        {
          accountNumber: "XXXX4921",
          institution: "HDFC Bank",
          loanType: "Home Loan",
          sanctionedAmount: 3500000,
          outstandingBalance: 2545000,
          emiAmount: 28500,
          interestRate: 8.5,
          tenureMonths: 240,
          tenureRemaining: 156,
          disbursementDate: "2019-01-20",
          daysPastDue: 0,
          accountStatus: "ACTIVE",
          paymentHistory: Array(24).fill("on_time"),
        },
        {
          accountNumber: "XXXX1102",
          institution: "SBI",
          loanType: "Personal Loan",
          sanctionedAmount: 300000,
          outstandingBalance: 112000,
          emiAmount: 8500,
          interestRate: 14.5,
          tenureMonths: 36,
          tenureRemaining: 14,
          disbursementDate: "2024-08-12",
          daysPastDue: 32,
          accountStatus: "OVERDUE",
          paymentHistory: [...Array(16).fill("on_time"), "missed", "missed"],
        },
        {
          accountNumber: "XXXX8842",
          institution: "ICICI Bank",
          loanType: "Credit Card",
          sanctionedAmount: 0,
          outstandingBalance: 150000,
          emiAmount: 0,
          interestRate: 0,
          tenureMonths: 0,
          tenureRemaining: 0,
          disbursementDate: "2021-03-05",
          daysPastDue: 0,
          accountStatus: "ACTIVE",
          creditLimit: 250000,
          currentBalance: 150000,
          utilizationPct: 60,
          paymentHistory: Array(24).fill("on_time"),
        },
        {
          accountNumber: "XXXX3310",
          institution: "Axis Bank",
          loanType: "Auto Loan",
          sanctionedAmount: 680000,
          outstandingBalance: 380000,
          emiAmount: 12400,
          interestRate: 9.2,
          tenureMonths: 60,
          tenureRemaining: 32,
          disbursementDate: "2022-11-10",
          daysPastDue: 0,
          accountStatus: "ACTIVE",
          paymentHistory: Array(24).fill("on_time"),
        },
      ],
      inquiries: [
        { date: "2026-02-10", institution: "HDFC Bank", purpose: "Credit Card Application" },
        { date: "2025-11-22", institution: "Bajaj Finserv", purpose: "Personal Loan Inquiry" },
      ],
    },
  };
}
