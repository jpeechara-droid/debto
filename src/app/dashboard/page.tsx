"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LoanAccount {
  id: string;
  accountNumber: string;
  institution: string;
  loanType: string;
  outstandingBalance: number;
  emiAmount: number;
  interestRate: number;
  tenureRemaining: number | null;
  daysPastDue: number;
  accountStatus: string;
  creditLimit: number | null;
}

interface DashboardData {
  user: { name: string; phone: string };
  creditScore: number | null;
  reportDate: string | null;
  totalDebt: number;
  monthlyEMI: number;
  activeLoansCount: number;
  loanAccounts: LoanAccount[];
}

const DEBT_COLORS = ["#1B2A4A", "#F5913E", "#2E75B6", "#CBD5E1", "#10B981", "#8B5CF6"];

function formatCurrencyINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getScoreLabel(score: number) {
  if (score >= 750) return { label: "EXCELLENT", color: "text-success" };
  if (score >= 700) return { label: "GOOD", color: "text-cta-saffron" };
  if (score >= 650) return { label: "FAIR", color: "text-warning" };
  return { label: "POOR", color: "text-danger" };
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton cards */}
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-6 h-36 animate-pulse">
              <div className="h-4 w-20 bg-slate-200 rounded mb-4" />
              <div className="h-8 w-28 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.creditScore) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">description</span>
        <h2 className="text-xl font-bold text-primary mb-2">No Credit Report Yet</h2>
        <p className="text-slate-500 mb-6">Complete your KYC to fetch your CIBIL report and see your dashboard.</p>
        <Link
          href="/kyc/identity"
          className="bg-cta-saffron hover:bg-cta-saffron-hover text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Start KYC Verification
        </Link>
      </div>
    );
  }

  const scoreInfo = getScoreLabel(data.creditScore);
  const userName = data.user.name?.split(" ")[0] || "User";
  const reportAge = data.reportDate ? getTimeAgo(data.reportDate) : "Never";

  // Build debt breakdown from loan types
  const typeMap = new Map<string, number>();
  data.loanAccounts.forEach((a) => {
    const type = a.loanType || "Other";
    typeMap.set(type, (typeMap.get(type) || 0) + a.outstandingBalance);
  });
  const debtBreakdown = Array.from(typeMap.entries()).map(([type, amount], i) => ({
    type,
    amount,
    color: DEBT_COLORS[i % DEBT_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-[#1A1A1A]">
            Good morning, {userName}
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Report last updated: {reportAge}
          </p>
        </div>
        <button className="flex items-center gap-1.5 border border-slate-200 px-3.5 py-2 rounded-full text-[13px] font-semibold text-[#1A1A1A] hover:bg-slate-50 transition-colors cursor-pointer w-fit">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Refresh CIBIL Report
        </button>
      </motion.div>

      {/* AI Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-[#E4FBF1] border border-[#BDEADA] rounded-[14px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1E7755] text-xl bg-white p-1.5 rounded-lg shadow-sm">
              lightbulb
            </span>
            <p className="text-[13px] text-[#1E7755] font-medium leading-relaxed">
              Your AI Analysis found ways to optimize your <span className="font-bold">{data.activeLoansCount} active loans</span>. View your personalized report.
            </p>
          </div>
          <Link
            href="/dashboard/ai-analysis"
            className="bg-[#22C55E] hover:bg-[#1EB052] text-white text-[13px] font-bold px-5 py-2 rounded-full transition-colors whitespace-nowrap shadow-sm"
          >
            View Analysis
          </Link>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        {/* CIBIL Score */}
        <div className="bg-white rounded-[16px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="text-center z-10 w-full">
            <p className="text-[12px] font-semibold text-slate-500 mb-4 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">speed</span>
              CIBIL Score
            </p>
            <div className="relative inline-flex items-center justify-center">
              <svg className="size-[96px]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="6"
                  strokeDasharray={`${((data.creditScore - 300) / 600) * 251} 251`}
                  strokeDashoffset="0" strokeLinecap="round"
                  transform="rotate(-90 50 50)" className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center mt-1">
                <span className="text-[24px] font-bold text-[#1A1A1A] leading-none mb-0.5">{data.creditScore}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${scoreInfo.color} bg-success/10`}>{scoreInfo.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Debt */}
        <div className="bg-white rounded-[16px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-slate-500">Total Debt</p>
            <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <span className="material-symbols-outlined text-slate-400 text-[16px]">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <p className="text-[24px] font-extrabold text-[#1A1A1A] mb-1">{formatCurrencyINR(data.totalDebt)}</p>
            <p className="text-[12px] font-medium text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">monitoring</span>
              {data.activeLoansCount} active accounts
            </p>
          </div>
        </div>

        {/* Monthly EMIs */}
        <div className="bg-white rounded-[16px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-slate-500">Monthly EMIs</p>
            <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <span className="material-symbols-outlined text-slate-400 text-[16px]">calendar_month</span>
            </div>
          </div>
          <div>
            <p className="text-[24px] font-extrabold text-[#1A1A1A] mb-1">{formatCurrencyINR(data.monthlyEMI)}</p>
            <p className="text-[12px] font-medium text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Combined total
            </p>
          </div>
        </div>

        {/* Debt-Free Date */}
        <div className="bg-white rounded-[16px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-slate-500">Est. Debt-Free</p>
            <div className="size-8 rounded-full bg-[#E4FBF1] flex items-center justify-center border border-[#BDEADA]">
              <span className="material-symbols-outlined text-[#22C55E] text-[16px]">flag</span>
            </div>
          </div>
          <div>
            <p className="text-[24px] font-extrabold text-[#1A1A1A] mb-1">
              {(() => {
                const maxTenure = Math.max(...data.loanAccounts.map((a) => a.tenureRemaining || 0), 0);
                if (!maxTenure) return "N/A";
                const date = new Date();
                date.setMonth(date.getMonth() + maxTenure);
                return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
              })()}
            </p>
            <p className="text-[12px] font-medium text-[#22C55E] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              On track
            </p>
          </div>
        </div>
      </motion.div>

      {/* Debt Breakdown + Active Loans */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Debt Breakdown */}
        <div className="bg-white rounded-[16px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-5 lg:p-6">
          <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-6">Debt Breakdown</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg className="size-40" viewBox="0 0 100 100">
                {(() => {
                  const total = debtBreakdown.reduce((s, item) => s + item.amount, 0);
                  if (!total) return null;
                  let offset = 0;
                  return debtBreakdown.map((item, i) => {
                    const pct = (item.amount / total) * 100;
                    const dashArray = (pct / 100) * 251;
                    const dashOffset = -(offset / 100) * 251;
                    offset += pct;
                    return (
                      <circle key={i} cx="50" cy="50" r="40" fill="none"
                        stroke={item.color} strokeWidth="14"
                        strokeDasharray={`${dashArray} ${251 - dashArray}`}
                        strokeDashoffset={dashOffset} transform="rotate(-90 50 50)"
                        className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-7 shadow-[inset_0_1px_6px_rgba(0,0,0,0.04)] border border-slate-50">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total</span>
                <span className="text-[16px] font-extrabold text-[#1A1A1A] leading-none">{formatCurrencyINR(data.totalDebt)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {debtBreakdown.map((item) => (
              <div key={item.type} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-default">
                <div className="flex items-center gap-2.5">
                  <div className="size-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-[13px] text-slate-600 font-medium">{item.type}</span>
                </div>
                <span className="text-[13px] font-bold text-[#1A1A1A]">{formatCurrencyINR(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Loans */}
        <div className="bg-white rounded-[16px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-bold text-[#1A1A1A]">Active Loans</h3>
            <Link href="/dashboard/credit-report" className="text-[12px] text-slate-500 hover:text-indigo-600 font-bold transition-colors flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="pb-3 font-bold text-slate-400 text-[11px] uppercase tracking-wider pl-2">Loan Details</th>
                  <th className="pb-3 font-bold text-slate-400 text-[11px] uppercase tracking-wider">Outstanding</th>
                  <th className="pb-3 font-bold text-slate-400 text-[11px] uppercase tracking-wider">Monthly EMI</th>
                  <th className="pb-3 font-bold text-slate-400 text-[11px] uppercase tracking-wider pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.loanAccounts.map((loan) => (
                  <tr key={loan.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                    <td className="py-3 pl-2">
                      <p className="font-bold text-[#1A1A1A] text-[14px]">{loan.institution} {loan.loanType}</p>
                      <p className="text-[12px] text-slate-400 font-medium">A/C: {loan.accountNumber}</p>
                    </td>
                    <td className="py-3 font-bold text-[#1A1A1A] text-[14px]">{formatCurrencyINR(loan.outstandingBalance)}</td>
                    <td className="py-3 font-bold text-[#1A1A1A] text-[14px]">
                      {loan.emiAmount ? formatCurrencyINR(loan.emiAmount) : "—"}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <Badge variant={
                        loan.accountStatus === "OVERDUE" ? "danger" :
                        loan.daysPastDue > 0 ? "warning" : "success"
                      } className="rounded-full px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider shadow-sm">
                        {loan.accountStatus === "OVERDUE" ? "OVERDUE" :
                         loan.daysPastDue > 0 ? `${loan.daysPastDue} DPD` : "ON TRACK"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Link href="/dashboard/ai-analysis" className="block w-full">
          <div className="bg-[#1A1A1A] rounded-[14px] shadow-[0_1px_8px_rgba(0,0,0,0.08)] border border-slate-800 p-5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all text-white cursor-pointer h-full group relative overflow-hidden">
             
            <span className="material-symbols-outlined text-[24px] text-[#F39C12] group-hover:scale-110 transition-transform relative z-10">psychology</span>
            <div className="relative z-10">
              <p className="font-bold text-[14px] leading-tight">View AI Analysis</p>
              <p className="text-[12px] text-white/70 mt-0.5">See your personalized report</p>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-[#F39C12]/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </Link>

        <Link href="/dashboard/calculators/extra-payment" className="block w-full">
          <div className="bg-white rounded-[14px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer h-full group">
            <div className="size-10 rounded-full bg-[#E5F1FC] flex items-center justify-center border border-[#BBDDF8] group-hover:bg-[#CDE6F9] transition-colors">
              <span className="material-symbols-outlined text-[20px] text-[#2E75B6]">calculate</span>
            </div>
            <div>
              <p className="font-bold text-[#1A1A1A] text-[14px] leading-tight">Extra Payment</p>
              <p className="text-[12px] text-slate-500 mt-0.5">See how extra payments help</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/consultations" className="block w-full">
          <div className="bg-white rounded-[14px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer h-full group">
             <div className="size-10 rounded-full bg-[#FFF4E5] flex items-center justify-center border border-[#FFE1B5] group-hover:bg-[#FFE8CC] transition-colors">
              <span className="material-symbols-outlined text-[20px] text-[#D35400]">support_agent</span>
            </div>
            <div>
              <p className="font-bold text-[#1A1A1A] text-[14px] leading-tight">Book Consultation</p>
              <p className="text-[12px] text-slate-500 mt-0.5">Talk to an expert advisor</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
