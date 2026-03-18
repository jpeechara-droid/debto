"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ─── Types ───────────────────────────────────────────────────────

interface StrategyLoan {
  name: string;
  apr: number;
  balance: number;
  payment: number;
  extra: number;
  payFirst: boolean;
  icon: string;
}

interface AnalysisData {
  id: string;
  generatedFor: string;
  generatedAt: string;
  debtSnapshot: {
    totalDebt: number;
    monthlyEMI: number;
    activeLoans: number;
    debtToIncome: number;
    healthStatus: string;
  };
  debtFreeTimeline: {
    currentPayoff: string;
    optimizedPayoff: string;
    monthsSaved: number;
    totalSaved: number;
  };
  repaymentStrategies: {
    id: string;
    label: string;
    description: string;
    loans: StrategyLoan[];
  }[];
  extraPaymentImpact: {
    suggestedExtra: number;
    newDate: string;
    monthsSaved: number;
    interestSaved: number;
  };
  refinancingAnalysis: {
    current: { lender: string; type: string; balance: number; apr: number };
    offer: { lender: string; type: string; apr: number; feesIncluded: boolean };
    potentialSavings: number;
  } | null;
  creditHealth: {
    utilization: { value: number; status: string };
    inquiries: { value: number; status: string };
    paymentHistory: { value: number; status: string };
    accountMix: { value: number; status: string };
  };
  narrativeText: string;
}

// ─── Loading Skeleton ────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded" />
      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-4">
        <div className="h-6 w-40 bg-slate-200 rounded" />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-8 h-64" />
        <div className="col-span-2 bg-slate-800 rounded-xl p-8 h-64" />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-8 h-48" />
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export default function AIAnalysisPage() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noReport, setNoReport] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState("ai");
  const [extraPayment, setExtraPayment] = useState(15000);

  useEffect(() => {
    fetch("/api/ai-analysis")
      .then((r) => {
        if (r.status === 404) return null;
        if (!r.ok) throw new Error("FETCH_FAILED");
        return r.json();
      })
      .then((d) => {
        if (d) {
          setData(d);
          if (d.extraPaymentImpact?.suggestedExtra) {
            setExtraPayment(d.extraPaymentImpact.suggestedExtra);
          }
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const r = await fetch("/api/ai-analysis/generate", { method: "POST" });
      if (r.status === 400) {
        const body = await r.json();
        if (body.error?.includes("KYC")) {
          setNoReport(true);
          return;
        }
        throw new Error(body.error);
      }
      if (!r.ok) throw new Error("Generation failed");
      const d = await r.json();
      setData(d);
      if (d.extraPaymentImpact?.suggestedExtra) {
        setExtraPayment(d.extraPaymentImpact.suggestedExtra);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate analysis");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (noReport) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
          description
        </span>
        <h2 className="text-xl font-bold text-primary mb-2">
          No Credit Report Found
        </h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md">
          Complete the KYC process and fetch your CIBIL report before generating
          an AI analysis.
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

  if (!data) {
    // No existing analysis - offer to generate
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">
            psychology
          </span>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          AI Debt Analysis
        </h2>
        <p className="text-sm text-slate-400 mb-8 max-w-md">
          Our AI will analyze your credit report and create a personalized debt
          repayment strategy, timeline, and actionable insights.
        </p>
        {error && (
          <p className="text-sm text-danger mb-4">{error}</p>
        )}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-cta-saffron hover:bg-cta-saffron-hover disabled:opacity-60 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          {generating ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
              Generating Analysis...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">
                auto_awesome
              </span>
              Generate My AI Analysis
            </>
          )}
        </button>
      </div>
    );
  }

  const d = data;
  const currentStrategy =
    d.repaymentStrategies?.find((s) => s.id === activeStrategy) ||
    d.repaymentStrategies?.[d.repaymentStrategies.length - 1];

  const generatedDate = new Date(d.generatedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Your AI Debt Analysis
          </h1>
          <p className="text-sm text-slate-400">
            Personalized for {d.generatedFor} • Generated {generatedDate}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 border border-slate-200 px-4 py-2.5 rounded-full text-[14px] font-bold text-[#1A1A1A] hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${generating ? "animate-spin" : ""}`}>
              {generating ? "progress_activity" : "refresh"}
            </span>
            {generating ? "Regenerating..." : "Regenerate"}
          </button>
          <button className="flex items-center gap-2 border border-slate-200 px-4 py-2.5 rounded-full text-[14px] font-bold text-[#1A1A1A] hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download PDF
          </button>
        </div>
      </motion.div>

      {/* Debt Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[#1A1A1A]">
              analytics
            </span>
            <h2 className="text-[20px] font-bold text-[#1A1A1A]">Debt Snapshot</h2>
            <Badge variant="default" className="ml-auto rounded-full px-3 py-1 text-[11px]">ACTIVE STATUS</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left: Numbers */}
            <div className="space-y-6">
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                  Total Debt Outstanding
                </p>
                <p className="text-[32px] font-extrabold text-[#1A1A1A] leading-none">
                  {formatINR(d.debtSnapshot.totalDebt)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                  Monthly EMI Burden
                </p>
                <p className="text-[24px] font-bold text-[#1A1A1A] leading-none">
                  {formatINR(d.debtSnapshot.monthlyEMI)}{" "}
                  <span className="text-[14px] text-slate-400 font-normal">/mo</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-secondary-blue" />
                <span className="text-sm text-slate-500">
                  {d.debtSnapshot.activeLoans} Active Loans
                </span>
              </div>
            </div>

            {/* Center: Health Donut */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <svg className="size-32" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none" stroke="#e2e8f0" strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke={d.debtSnapshot.debtToIncome <= 35 ? "#22C55E" : d.debtSnapshot.debtToIncome <= 50 ? "#F5913E" : "#EF4444"}
                    strokeWidth="8"
                    strokeDasharray={`${(Math.min(d.debtSnapshot.debtToIncome, 100) / 100) * 251.3} 251.3`}
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-slate-400 uppercase">Health</span>
                  <span className="text-lg font-extrabold text-primary">
                    {d.debtSnapshot.healthStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Mini bars */}
            <div className="flex items-end gap-2 h-28 justify-center">
              {[65, 85, 42, 78].map((h, i) => (
                <motion.div
                  key={i}
                  className={`w-10 rounded-t-md ${
                    i < 3 ? "bg-primary" : "bg-slate-200"
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                />
              ))}
            </div>
          </div>

          {/* Debt-to-Income ratio bar */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary">
                Debt-to-Income Ratio
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-success via-cta-saffron to-danger"
                  style={{ width: `${Math.min(d.debtSnapshot.debtToIncome, 100)}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${d.debtSnapshot.debtToIncome <= 35 ? "text-success" : "text-cta-saffron"}`}>
                {d.debtSnapshot.debtToIncome}%
              </span>
            </div>
            <p className={`text-[12px] mt-2 text-right ${d.debtSnapshot.debtToIncome <= 35 ? "text-success" : "text-cta-saffron"}`}>
              {d.debtSnapshot.debtToIncome <= 35
                ? "Within ideal range (below 35%)"
                : "Ideal range is below 35%"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Debt-Free Timeline + AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Timeline Chart */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 p-6 lg:p-8 h-full">
            <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-[#1A1A1A]">
                trending_up
              </span>
              <h3 className="text-[18px] font-bold text-[#1A1A1A]">
                Debt-Free Timeline
              </h3>
            </div>

            {/* Simple line chart placeholder */}
            <div className="relative h-48 border border-slate-100 rounded-xl p-4">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <path
                  d="M 0 20 Q 100 30 200 60 T 400 130"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                />
                <path
                  d="M 0 20 Q 80 40 160 80 T 320 130"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-slate-400" />
                <span className="text-xs text-slate-500">Current Path</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-success" />
                <span className="text-xs text-slate-500">Optimized Path</span>
              </div>
            </div>

            {/* Payoff dates */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-slate-50 rounded-[16px] p-5">
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-2">
                  Current Payoff Date
                </p>
                <p className="text-[20px] font-bold text-[#1A1A1A]">
                  {d.debtFreeTimeline.currentPayoff}
                </p>
              </div>
              <div className="bg-[#E4FBF1] border border-[#BDEADA] rounded-[16px] p-5">
                <p className="text-[11px] text-[#1E7755] uppercase tracking-wider font-bold mb-2">
                  Optimized Payoff Date
                </p>
                <p className="text-[20px] font-bold text-[#22C55E]">
                  {d.debtFreeTimeline.optimizedPayoff}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-[#1A1A1A] rounded-[24px] p-6 lg:p-8 text-white h-full flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <div className="size-[48px] bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[#F39C12] text-[24px]">
                auto_awesome
              </span>
            </div>
            <h3 className="text-[24px] font-bold mb-3 leading-tight">
              AI Insight: Be debt-free {d.debtFreeTimeline.monthsSaved} months earlier.
            </h3>
            <p className="text-[15px] text-white/70 flex-1 leading-relaxed">
              {d.narrativeText || "By following the recommended strategy, you can save significantly on interest payments."}
            </p>
            <p className="text-[40px] font-extrabold text-[#F39C12] my-6">
              {formatINR(d.debtFreeTimeline.totalSaved)}
            </p>
            <button className="w-full bg-[#F39C12] hover:bg-[#E67E22] text-white font-bold py-3.5 rounded-full transition-all cursor-pointer text-[15px]">
              Apply AI Strategy
            </button>
          </div>
        </motion.div>
      </div>

      {/* Social Proof + Consultation */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between bg-slate-50 border border-slate-100 rounded-[24px] p-6 lg:px-8 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="size-10 rounded-full bg-[#3B82F6] text-white text-[11px] flex items-center justify-center font-bold border-2 border-white shadow-sm">
              RK
            </div>
            <div className="size-10 rounded-full bg-[#F39C12] text-white text-[11px] flex items-center justify-center font-bold border-2 border-white shadow-sm">
              PS
            </div>
          </div>
          <p className="text-[15px] text-[#1A1A1A]">
            Join <span className="font-bold">2.4k+</span> users who reached
            their goals this month.
          </p>
        </div>
        <Link
          href="/dashboard/consultations"
          className="bg-[#1A1A1A] hover:bg-black text-white font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2 mt-4 md:mt-0 text-[14px] cursor-pointer"
        >
          Book Consultation — ₹999
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </Link>
      </motion.div>

      {/* Repayment Strategy + What if You Paid More */}
      {d.repaymentStrategies && d.repaymentStrategies.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Repayment Strategy */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 p-6 lg:p-8 h-full">
              <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-6">
                Repayment Strategy
              </h3>

              {/* Strategy tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {d.repaymentStrategies.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStrategy(s.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                      activeStrategy === s.id
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Loan cards */}
              {currentStrategy && (
                <div className="space-y-4">
                  {currentStrategy.loans.map((loan, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        loan.payFirst
                          ? "border-cta-saffron bg-cta-saffron/5"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-lg flex items-center justify-center ${
                            loan.payFirst
                              ? "bg-cta-saffron/10"
                              : "bg-slate-100"
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined ${
                              loan.payFirst
                                ? "text-cta-saffron"
                                : "text-slate-500"
                            }`}
                          >
                            {loan.icon}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">
                            {loan.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            APR: {loan.apr}% • Balance: {formatINR(loan.balance)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {formatINR(loan.payment)}/mo
                        </p>
                        {loan.extra > 0 && (
                          <p className="text-xs text-success font-semibold">
                            + {formatINR(loan.extra)} Extra
                          </p>
                        )}
                        {loan.payFirst && (
                          <Badge variant="warning" size="sm" className="mt-1">
                            PAY THIS FIRST
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* What If You Paid More */}
          {d.extraPaymentImpact && (
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 p-6 lg:p-8 h-full">
                <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-4">
                  What if You Paid More?
                </h3>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[14px] font-medium text-slate-500">
                    Extra Monthly Payment
                  </span>
                  <span className="text-[24px] font-bold text-[#F39C12]">
                    {formatINR(extraPayment)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(parseInt(e.target.value))}
                  className="w-full accent-cta-saffron mb-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mb-6">
                  <span>₹1K</span>
                  <span>₹50K</span>
                </div>

                {/* Impact grid */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                      New Date
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {d.extraPaymentImpact.newDate}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-success uppercase tracking-wider font-semibold mb-1">
                      Saved
                    </p>
                    <p className="text-sm font-bold text-success">
                      {d.extraPaymentImpact.monthsSaved} Months
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-secondary-blue uppercase tracking-wider font-semibold mb-1">
                      Interest
                    </p>
                    <p className="text-sm font-bold text-secondary-blue">
                      {formatINR(d.extraPaymentImpact.interestSaved)}
                    </p>
                  </div>
                </div>

                {/* Mini bars */}
                <div className="flex items-end gap-1.5 h-20 justify-center">
                  {[40, 55, 70, 60, 85, 65, 45, 50, 35, 20].map((h, i) => (
                    <motion.div
                      key={i}
                      className={`w-4 rounded-t-sm ${
                        i < 8 ? "bg-cta-saffron/80" : "bg-cta-saffron/30"
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Balance Transfer Analysis */}
      {d.refinancingAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 p-6 lg:p-8 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <h3 className="text-[20px] font-bold text-[#1A1A1A]">
                Balance Transfer Analysis
              </h3>
              <span className="text-[15px] font-bold text-[#22C55E] flex items-center gap-1 bg-[#E4FBF1] px-4 py-2 rounded-full border border-[#BDEADA]">
                <span className="material-symbols-outlined text-[18px]">
                  trending_down
                </span>
                Potential Savings: {formatINR(d.refinancingAnalysis.potentialSavings)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current */}
              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-xs text-slate-400 mb-2">
                  Current Option ({d.refinancingAnalysis.current.lender})
                </p>
                <p className="text-2xl font-bold text-primary">
                  {d.refinancingAnalysis.current.apr}% APR
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {d.refinancingAnalysis.current.type} •{" "}
                  {formatINR(d.refinancingAnalysis.current.balance)}
                </p>
                <p className="text-sm text-slate-400 mt-3">₹0 Saved</p>
              </div>

              {/* Offer */}
              <div className="border-2 border-success rounded-xl p-5 bg-success/5 relative">
                <div className="absolute -top-3 left-4 bg-success text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {d.refinancingAnalysis.offer.lender}
                </div>
                <p className="text-2xl font-bold text-success mt-2">
                  {d.refinancingAnalysis.offer.apr}% APR
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Transfer Fees Included
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm font-bold text-success">
                    {formatINR(d.refinancingAnalysis.potentialSavings)} Saved
                  </p>
                  <button className="text-xs font-bold text-success flex items-center gap-1 cursor-pointer">
                    APPLY NOW
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Credit Health Factors */}
      {d.creditHealth && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 p-6 lg:p-8 mt-6">
            <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-8">
              Credit Health Factors
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Utilization */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <svg className="size-20" viewBox="0 0 80 80">
                    <circle
                      cx="40" cy="40" r="32"
                      fill="none" stroke="#fee2e2" strokeWidth="6"
                    />
                    <circle
                      cx="40" cy="40" r="32"
                      fill="none"
                      stroke={d.creditHealth.utilization.value > 50 ? "#EF4444" : d.creditHealth.utilization.value > 30 ? "#F5913E" : "#22C55E"}
                      strokeWidth="6"
                      strokeDasharray={`${(d.creditHealth.utilization.value / 100) * 201} 201`}
                      transform="rotate(-90 40 40)"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {d.creditHealth.utilization.value}%
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Utilization
                </p>
                <p className={`text-xs font-semibold ${d.creditHealth.utilization.value > 50 ? "text-danger" : d.creditHealth.utilization.value > 30 ? "text-cta-saffron" : "text-success"}`}>
                  {d.creditHealth.utilization.status}
                </p>
              </div>

              {/* Inquiries */}
              <div className="flex flex-col items-center text-center">
                <div className="size-20 flex items-center justify-center mb-3">
                  <span className="text-4xl font-extrabold text-primary">
                    {d.creditHealth.inquiries.value}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Inquiries
                </p>
                <p className="text-xs text-slate-400">
                  Last 6 Months
                </p>
                <p className="text-xs font-semibold text-success">
                  {d.creditHealth.inquiries.status}
                </p>
              </div>

              {/* Payment History */}
              <div className="flex flex-col items-center text-center">
                <div className="size-20 flex items-center justify-center mb-3">
                  <span className="text-4xl font-extrabold text-success">
                    {d.creditHealth.paymentHistory.value}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Payment History
                </p>
                <p className="text-xs font-semibold text-success">
                  {d.creditHealth.paymentHistory.status}
                </p>
              </div>

              {/* Account Mix */}
              <div className="flex flex-col items-center text-center">
                <div className="size-20 flex items-center justify-center mb-3 gap-1">
                  {["home", "account_balance", "credit_card", "person"]
                    .slice(0, d.creditHealth.accountMix.value)
                    .map((icon, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-slate-400 text-lg"
                      >
                        {icon}
                      </span>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Account Mix
                </p>
                <p className="text-sm font-bold text-primary">
                  {d.creditHealth.accountMix.value} Varieties
                </p>
                <p className="text-xs font-semibold text-success">
                  {d.creditHealth.accountMix.status}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center italic px-4">
        Disclaimer: This analysis is based on provided data and AI algorithms.
        It is not financial advice. Please consult with a professional financial
        advisor before making significant financial decisions.
      </p>
    </div>
  );
}
