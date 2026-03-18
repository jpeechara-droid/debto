"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Types ───────────────────────────────────────────────────────
interface Account {
  id: string;
  accountNumber: string;
  institution: string;
  loanType: string;
  sanctionedAmount: number;
  outstandingBalance: number;
  emiAmount: number;
  interestRate: number;
  tenureMonths: number | null;
  tenureRemaining: number | null;
  disbursementDate: string | null;
  daysPastDue: number | null;
  accountStatus: string;
  creditLimit: number | null;
  currentBalance: number | null;
  utilizationPct: number | null;
  paymentHistory: string[] | null;
}

interface Inquiry {
  date: string;
  institution: string;
  purpose: string;
}

interface CreditReportData {
  creditScore: number;
  reportDate: string;
  accounts: Account[];
  inquiries: Inquiry[];
}

type TabKey = "all" | "active" | "credit_cards" | "closed" | "overdue" | "inquiries";

// ─── Helpers ─────────────────────────────────────────────────────
function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getScoreZone(score: number) {
  if (score >= 750) return "EXCELLENT";
  if (score >= 700) return "GOOD ZONE";
  if (score >= 650) return "FAIR";
  return "POOR";
}

function getScoreColor(score: number) {
  if (score >= 750) return "#22C55E";
  if (score >= 700) return "#3B82F6";
  if (score >= 650) return "#F5913E";
  return "#EF4444";
}

function isLoan(type: string) {
  const t = type.toLowerCase();
  return !t.includes("credit card");
}

function isCreditCard(type: string) {
  return type.toLowerCase().includes("credit card");
}

function getLoanIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes("home")) return "home";
  if (t.includes("personal")) return "person";
  if (t.includes("credit card")) return "credit_card";
  if (t.includes("auto") || t.includes("car") || t.includes("vehicle")) return "directions_car";
  if (t.includes("education") || t.includes("student")) return "school";
  if (t.includes("gold")) return "diamond";
  return "account_balance";
}

function computeScoreFactors(accounts: Account[]) {
  const active = accounts.filter((a) => a.accountStatus !== "CLOSED");

  // Payment history
  const allPayments = accounts.flatMap((a) => a.paymentHistory || []);
  const onTime = allPayments.filter((p) => p === "on_time").length;
  const paymentPct = allPayments.length > 0 ? Math.round((onTime / allPayments.length) * 100) : 100;

  // Credit utilization (credit cards only)
  const cards = active.filter((a) => isCreditCard(a.loanType) && a.creditLimit && a.creditLimit > 0);
  const totalUsed = cards.reduce((s, a) => s + (a.currentBalance || a.outstandingBalance), 0);
  const totalLimit = cards.reduce((s, a) => s + (a.creditLimit || 0), 0);
  const utilizationPct = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;
  const utilizationScore = Math.max(0, 100 - utilizationPct);

  // Credit age
  const dates = accounts
    .map((a) => a.disbursementDate ? new Date(a.disbursementDate).getTime() : 0)
    .filter(Boolean);
  const oldest = dates.length > 0 ? Math.min(...dates) : Date.now();
  const ageYears = (Date.now() - oldest) / (365.25 * 24 * 60 * 60 * 1000);
  const agePct = Math.min(100, Math.round(ageYears * 12.5)); // 8+ years = 100%

  // Credit mix
  const types = new Set(accounts.map((a) => a.loanType));
  const mixPct = Math.min(100, types.size * 25);

  function label(pct: number) {
    if (pct >= 85) return "Excellent";
    if (pct >= 70) return "Good";
    if (pct >= 50) return "Moderate";
    return "Needs Work";
  }

  function color(pct: number) {
    if (pct >= 70) return "#22C55E";
    if (pct >= 50) return "#F5913E";
    return "#EF4444";
  }

  return [
    { name: "Payment History", score: `${label(paymentPct)} (${paymentPct}%)`, pct: paymentPct, color: color(paymentPct) },
    { name: "Credit Utilization", score: `${label(utilizationScore)} (${utilizationScore}%)`, pct: utilizationScore, color: color(utilizationScore) },
    { name: "Credit Age", score: `${label(agePct)} (${agePct}%)`, pct: agePct, color: color(agePct) },
    { name: "Credit Mix", score: `${label(mixPct)} (${mixPct}%)`, pct: mixPct, color: color(mixPct) },
  ];
}

// ─── Components ──────────────────────────────────────────────────
function PaymentTimeline({ history }: { history: string[] }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">
        24-Month Payment Timeline
      </p>
      <div className="flex gap-1 flex-wrap">
        {history.slice(-24).map((status, i) => (
          <div
            key={i}
            className={`size-4 rounded-sm ${
              status === "on_time"
                ? "bg-success"
                : status === "late"
                ? "bg-warning"
                : "bg-danger"
            }`}
            title={
              status === "on_time"
                ? "On Time"
                : status === "late"
                ? "Late Payment"
                : "Missed"
            }
          />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded" />
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="size-40 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-4 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-2.5 w-full bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-100 rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-10 bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────
export default function CreditReportPage() {
  const [data, setData] = useState<CreditReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  useEffect(() => {
    fetch("/api/credit-report")
      .then((r) => {
        if (r.status === 404) throw new Error("NO_REPORT");
        if (!r.ok) throw new Error("FETCH_FAILED");
        return r.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const scoreFactors = useMemo(
    () => (data ? computeScoreFactors(data.accounts) : []),
    [data]
  );

  const tabs = useMemo(() => {
    if (!data) return [];
    const a = data.accounts;
    return [
      { key: "all" as TabKey, label: "All Accounts", count: a.length },
      { key: "active" as TabKey, label: "Active Loans", count: a.filter((x) => (x.accountStatus === "ACTIVE" || x.accountStatus === "OVERDUE") && isLoan(x.loanType)).length },
      { key: "credit_cards" as TabKey, label: "Credit Cards", count: a.filter((x) => isCreditCard(x.loanType)).length },
      { key: "closed" as TabKey, label: "Closed", count: a.filter((x) => x.accountStatus === "CLOSED").length },
      { key: "overdue" as TabKey, label: "Overdue", count: a.filter((x) => x.accountStatus === "OVERDUE").length },
      { key: "inquiries" as TabKey, label: "Inquiries", count: data.inquiries.length },
    ];
  }, [data]);

  if (loading) return <LoadingSkeleton />;

  if (error === "NO_REPORT" || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
          description
        </span>
        <h2 className="text-xl font-bold text-primary mb-2">
          No Credit Report Yet
        </h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md">
          Complete the KYC process to fetch your CIBIL credit report and see
          your score, accounts, and payment history.
        </p>
        <Link
          href="/kyc/identity"
          className="bg-cta-saffron hover:bg-cta-saffron-hover text-white font-bold py-3 px-8 rounded-lg transition-all"
        >
          Start KYC Process
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-danger/50 mb-4">
          error
        </span>
        <h2 className="text-xl font-bold text-primary mb-2">
          Failed to Load Report
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Something went wrong. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white font-bold py-3 px-8 rounded-lg transition-all hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  const reportDateStr = new Date(data.reportDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const filteredAccounts = data.accounts.filter((account) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return (account.accountStatus === "ACTIVE" || account.accountStatus === "OVERDUE") && isLoan(account.loanType);
    if (activeTab === "credit_cards") return isCreditCard(account.loanType);
    if (activeTab === "closed") return account.accountStatus === "CLOSED";
    if (activeTab === "overdue") return account.accountStatus === "OVERDUE";
    return true;
  });

  const scoreArc = ((data.creditScore - 300) / 600) * 270;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-primary">
            Your CIBIL Credit Report
          </h1>
          <p className="text-[13px] text-slate-400">
            Report as of {reportDateStr}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 border border-slate-200 px-3.5 py-2 rounded-full text-[13px] font-semibold text-primary hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download PDF
          </button>
          <button className="flex items-center gap-1.5 border border-slate-200 px-3.5 py-2 rounded-full text-[13px] font-semibold text-primary hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">share</span>
            Share
          </button>
        </div>
      </motion.div>

      {/* Score + Factors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="lg" className="rounded-[16px]">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Score Gauge */}
            <div className="flex flex-col items-center gap-2 min-w-[160px]">
              <div className="relative">
                <svg className="size-32" viewBox="0 0 120 120">
                  <path
                    d="M 15 90 A 50 50 0 1 1 105 90"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 15 90 A 50 50 0 1 1 105 90"
                    fill="none"
                    stroke={getScoreColor(data.creditScore)}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(scoreArc / 270) * 236} 236`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                  <span className="text-4xl font-extrabold text-primary">
                    {data.creditScore}
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: getScoreColor(data.creditScore) }}
                  >
                    {getScoreZone(data.creditScore)}
                  </span>
                </div>
              </div>
            </div>

            {/* Score Factors */}
            <div className="flex-1 w-full">
              <h3 className="text-[18px] font-bold text-primary mb-3">
                Score Factors
              </h3>
              <div className="flex flex-col gap-3">
                {scoreFactors.map((factor) => (
                  <div key={factor.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[13px] font-medium text-slate-700">
                        {factor.name}
                      </span>
                      <span
                        className="text-[13px] font-semibold"
                        style={{ color: factor.color }}
                      >
                        {factor.score}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: factor.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Inquiries Tab */}
      {activeTab === "inquiries" ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {data.inquiries.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 block">
                search_off
              </span>
              <p>No credit inquiries found.</p>
            </div>
          ) : (
            data.inquiries.map((inq, i) => (
              <Card key={i} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-500">
                        search
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{inq.institution}</p>
                      <p className="text-xs text-slate-400">{inq.purpose}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">
                    {new Date(inq.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Card>
            ))
          )}
        </motion.div>
      ) : (
        /* Account Cards */
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredAccounts.map((account) => (
            <Card
              key={account.id}
              padding="lg"
              className={
                account.accountStatus === "OVERDUE"
                  ? "border-danger/30 bg-danger/[0.02]"
                  : ""
              }
            >
              {/* Account Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center mt-0.5">
                    <span className="material-symbols-outlined text-slate-600">
                      {getLoanIcon(account.loanType)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-primary text-[16px]">
                      {account.institution} {account.loanType}
                    </p>
                    <p className="text-[12px] text-slate-400">
                      A/C: {account.accountNumber}
                      {account.disbursementDate &&
                        ` | Opened: ${new Date(account.disbursementDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}`}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    account.accountStatus === "ACTIVE"
                      ? "success"
                      : account.accountStatus === "OVERDUE"
                      ? "danger"
                      : "default"
                  }
                >
                  {account.accountStatus}
                </Badge>
              </div>

              {/* Overdue warning */}
              {account.accountStatus === "OVERDUE" && (account.daysPastDue ?? 0) > 0 && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-danger">
                    warning
                  </span>
                  <span className="text-sm font-semibold text-danger">
                    {account.daysPastDue} days past due — {formatINR(account.emiAmount)} overdue
                  </span>
                </div>
              )}

              {/* Credit Card Details */}
              {isCreditCard(account.loanType) ? (
                <>
                  {account.utilizationPct !== null && account.utilizationPct > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">
                          Credit Utilization ({account.utilizationPct}%)
                        </span>
                        <span className="text-slate-500">
                          Limit: {formatINR(account.creditLimit || 0)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div
                          className={`h-full rounded-full transition-all ${
                            account.utilizationPct > 50
                              ? "bg-cta-saffron"
                              : "bg-success"
                          }`}
                          style={{ width: `${account.utilizationPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                        Outstanding
                      </p>
                      <p className="text-[16px] font-bold text-primary">
                        {formatINR(account.outstandingBalance)}
                      </p>
                    </div>
                    {account.creditLimit !== null && (
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                          Credit Limit
                        </p>
                        <p className="text-[16px] font-bold text-primary">
                          {formatINR(account.creditLimit)}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Loan Details */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                      Outstanding
                    </p>
                    <p className="text-[16px] font-bold text-primary">
                      {formatINR(account.outstandingBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                      {account.accountStatus === "OVERDUE" ? "Next EMI" : "Monthly EMI"}
                    </p>
                    <p
                      className={`text-[16px] font-bold ${
                        account.accountStatus === "OVERDUE"
                          ? "text-danger"
                          : "text-primary"
                      }`}
                    >
                      {formatINR(account.emiAmount)}
                    </p>
                  </div>
                  {account.interestRate > 0 && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                        Interest Rate
                      </p>
                      <p className="text-[16px] font-bold text-primary">
                        {account.interestRate}% p.a.
                      </p>
                    </div>
                  )}
                  {account.accountStatus === "OVERDUE" && (account.daysPastDue ?? 0) > 0 ? (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                        Days Past Due
                      </p>
                      <p className="text-[16px] font-bold text-danger">
                        {account.daysPastDue} Days
                      </p>
                    </div>
                  ) : account.sanctionedAmount > 0 ? (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                        Sanctioned Amount
                      </p>
                      <p className="text-[16px] font-bold text-primary">
                        {formatINR(account.sanctionedAmount)}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Payment Timeline */}
              {account.paymentHistory && account.paymentHistory.length > 0 && account.accountStatus !== "CLOSED" && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <PaymentTimeline history={account.paymentHistory} />
                </div>
              )}
            </Card>
          ))}

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 block">
                inbox
              </span>
              <p>No accounts found in this category.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* AI Analysis CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card padding="lg" className="bg-slate-50 rounded-[16px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  psychology
                </span>
              </div>
              <div>
                <p className="font-bold text-primary text-[16px]">
                  Ready for a deeper analysis?
                </p>
                <p className="text-[13px] text-slate-500">
                  Our AI can help you structure your debt to pay it off 3x
                  faster.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/ai-analysis"
              className="bg-cta-saffron hover:bg-cta-saffron-hover text-white font-bold py-2.5 px-6 rounded-full transition-all flex items-center gap-2 whitespace-nowrap text-[14px]"
            >
              Get Your AI Debt Analysis
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
