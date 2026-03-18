"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

const loans = [
  {
    id: 1,
    name: "Bajaj Finance - Personal Loan",
    outstanding: 320000,
    interestRate: 14.5,
    emi: 12500,
    tenureMonths: 36,
    paidMonths: 8,
  },
  {
    id: 2,
    name: "HDFC Bank - Home Loan",
    outstanding: 2545000,
    interestRate: 8.5,
    emi: 28500,
    tenureMonths: 240,
    paidMonths: 84,
  },
  {
    id: 3,
    name: "SBI - Car Loan",
    outstanding: 680000,
    interestRate: 9.2,
    emi: 12400,
    tenureMonths: 60,
    paidMonths: 26,
  },
];

export default function ExtraPaymentCalculatorPage() {
  const [selectedLoan, setSelectedLoan] = useState(loans[0]);
  const [extraPayment, setExtraPayment] = useState(5000);
  const [showSchedule, setShowSchedule] = useState(false);

  // Calculate impact
  const impact = useMemo(() => {
    const P = selectedLoan.outstanding;
    const monthlyRate = selectedLoan.interestRate / 100 / 12;
    const emi = selectedLoan.emi;
    const extraEmi = emi + extraPayment;

    // Standard months remaining
    let balance = P;
    let standardMonths = 0;
    let standardTotalInterest = 0;
    while (balance > 0 && standardMonths < 600) {
      const interest = balance * monthlyRate;
      standardTotalInterest += interest;
      const principal = emi - interest;
      balance -= principal;
      standardMonths++;
    }

    // With extra payment
    let balanceExtra = P;
    let extraMonths = 0;
    let extraTotalInterest = 0;
    while (balanceExtra > 0 && extraMonths < 600) {
      const interest = balanceExtra * monthlyRate;
      extraTotalInterest += interest;
      const principal = extraEmi - interest;
      balanceExtra -= principal;
      extraMonths++;
    }

    const monthsSaved = Math.max(0, standardMonths - extraMonths);
    const interestSaved = Math.max(0, Math.round(standardTotalInterest - extraTotalInterest));
    const standardTotal = Math.round(standardTotalInterest) + P;
    const optimizedTotal = Math.round(extraTotalInterest) + P;

    const now = new Date();
    const payoffDate = new Date(now);
    payoffDate.setMonth(payoffDate.getMonth() + extraMonths);
    const payoffStr = payoffDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });

    return {
      newPayoffDate: payoffStr,
      monthsSaved,
      interestSaved,
      standardTotal,
      optimizedTotal,
      standardMonths,
      extraMonths,
    };
  }, [selectedLoan, extraPayment]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <motion.div
        className="flex items-center gap-2 text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <a href="/dashboard/calculators" className="hover:text-primary transition-colors">
          Calculators
        </a>
        <span>/</span>
        <span className="text-primary font-medium">
          Extra Payment Calculator
        </span>
      </motion.div>

      {/* Main Layout: Left params + Right results */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — Loan Parameters */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-cta-saffron">
                payments
              </span>
              <h2 className="text-lg font-bold text-primary">
                Loan Parameters
              </h2>
            </div>

            {/* Select Loan */}
            <label className="text-sm font-semibold text-primary mb-2 block">
              Select Active Loan
            </label>
            <select
              value={selectedLoan.id}
              onChange={(e) => {
                const loan = loans.find(
                  (l) => l.id === parseInt(e.target.value)
                );
                if (loan) setSelectedLoan(loan);
              }}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-primary mb-6 bg-white focus:outline-none focus:ring-2 focus:ring-cta-saffron/30 focus:border-cta-saffron appearance-none cursor-pointer"
            >
              {loans.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.name}
                </option>
              ))}
            </select>

            {/* Outstanding + Interest Rate */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Outstanding
                </p>
                <p className="text-lg font-bold text-primary">
                  {formatINR(selectedLoan.outstanding)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Interest Rate
                </p>
                <p className="text-lg font-bold text-primary">
                  {selectedLoan.interestRate}%{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    p.a.
                  </span>
                </p>
              </div>
            </div>

            {/* Monthly EMI (readonly) */}
            <label className="text-sm font-semibold text-primary mb-2 block">
              Monthly EMI
            </label>
            <div className="border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 mb-6 bg-slate-50">
              {formatINR(selectedLoan.emi)}
            </div>

            {/* Additional Payment Slider */}
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-primary">
                Additional Monthly Payment
              </label>
              <span className="bg-cta-saffron text-white text-sm font-bold px-3 py-1 rounded-lg">
                {formatINR(extraPayment)}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={extraPayment}
              onChange={(e) => setExtraPayment(parseInt(e.target.value))}
              className="w-full accent-cta-saffron mb-2"
            />
            <div className="flex justify-between text-xs text-slate-400 mb-8">
              <span>Min ₹500</span>
              <span>Max ₹50,000</span>
            </div>

            {/* Recalculate button */}
            <button className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined">calculate</span>
              Recalculate Impact
            </button>
          </Card>

          {/* Amortization Schedule Toggle */}
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full mt-4 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between text-sm font-semibold text-primary hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">
                calendar_month
              </span>
              Amortization Schedule
            </div>
            <span
              className={`material-symbols-outlined transition-transform ${
                showSchedule ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          {showSchedule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2"
            >
              <Card padding="md">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="text-slate-400 border-b">
                        <th className="text-left py-2 font-semibold">Month</th>
                        <th className="text-right py-2 font-semibold">EMI</th>
                        <th className="text-right py-2 font-semibold">
                          Principal
                        </th>
                        <th className="text-right py-2 font-semibold">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.min(impact.extraMonths, 24) }).map(
                        (_, i) => {
                          const monthlyRate = selectedLoan.interestRate / 100 / 12;
                          let bal = selectedLoan.outstanding;
                          const totalEmi = selectedLoan.emi + extraPayment;
                          for (let m = 0; m <= i; m++) {
                            const interest = bal * monthlyRate;
                            bal -= totalEmi - interest;
                          }
                          const interest = (bal + totalEmi - bal) * monthlyRate;
                          return (
                            <tr key={i} className="border-b border-slate-50">
                              <td className="py-2 text-primary">{i + 1}</td>
                              <td className="py-2 text-right">{formatINR(totalEmi)}</td>
                              <td className="py-2 text-right text-success">
                                {formatINR(Math.round(totalEmi - interest))}
                              </td>
                              <td className="py-2 text-right">
                                {formatINR(Math.max(0, Math.round(bal)))}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Right — Results */}
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Impact Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Impact of{" "}
              <span className="text-cta-saffron">
                {formatINR(extraPayment)}
              </span>{" "}
              Extra/Month
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Calculated based on {selectedLoan.name} terms
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-success text-lg">
                  event_available
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  New Payoff Date
                </span>
              </div>
              <p className="text-xl font-bold text-primary">
                {impact.newPayoffDate}
              </p>
              <div className="w-full h-1 bg-success/20 rounded-full mt-3">
                <div className="w-3/4 h-full bg-success rounded-full" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-cta-saffron text-lg">
                  edit_calendar
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Months Saved
                </span>
              </div>
              <p className="text-xl font-bold text-cta-saffron">
                {impact.monthsSaved} Months
              </p>
              <div className="w-full h-1 bg-cta-saffron/20 rounded-full mt-3">
                <div
                  className="h-full bg-cta-saffron rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (impact.monthsSaved / impact.standardMonths) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary-blue text-lg">
                  savings
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Interest Saved
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-blue">
                {formatINR(impact.interestSaved)}
              </p>
              <div className="w-full h-1 bg-secondary-blue/20 rounded-full mt-3">
                <div className="w-1/2 h-full bg-secondary-blue rounded-full" />
              </div>
            </div>
          </div>

          {/* Loan Balance Projection Chart */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">
                Loan Balance Projection
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-slate-300" />
                  <span className="text-xs text-slate-400">Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-cta-saffron" />
                  <span className="text-xs text-slate-400">Optimized</span>
                </div>
              </div>
            </div>

            <div className="h-52 relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 180"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 45, 90, 135, 180].map((y) => (
                  <line
                    key={y}
                    x1="0" y1={y} x2="400" y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                ))}
                {/* Current path (slow decline) */}
                <path
                  d="M 0 10 Q 100 25 200 70 T 400 170"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                />
                {/* Optimized path (faster decline) */}
                <path
                  d="M 0 10 Q 80 35 160 90 T 300 170"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400 px-1">
                <span>TODAY</span>
                <span>2024</span>
                <span>2025</span>
                <span>2026</span>
              </div>
            </div>
          </Card>

          {/* Total Cost Comparison + Smart Suggestion */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Total Cost Comparison */}
            <Card padding="lg" className="md:col-span-3">
              <h3 className="text-lg font-bold text-primary mb-4">
                Total Cost Comparison
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                      Standard Payment
                    </span>
                    <span className="font-bold text-primary">
                      {formatINR(impact.standardTotal)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full">
                    <div className="w-full h-full bg-slate-300 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-success uppercase text-[10px] tracking-wider font-semibold">
                      Optimized Strategy
                    </span>
                    <span className="font-bold text-success">
                      {formatINR(impact.optimizedTotal)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{
                        width: `${
                          (impact.optimizedTotal / impact.standardTotal) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Smart Suggestion */}
            <div className="md:col-span-2 bg-cta-saffron rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <span className="text-sm font-bold uppercase tracking-wider">
                    Smart Suggestion
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  Increasing your extra payment by just{" "}
                  <span className="font-bold underline">₹1,500 more</span>{" "}
                  would clear your loan by{" "}
                  <span className="font-bold">June 2025</span> and save an
                  additional{" "}
                  <span className="font-bold">₹12,400</span>.
                </p>
                <button className="mt-4 bg-white text-cta-saffron font-bold py-2 px-4 rounded-lg text-sm hover:bg-white/90 transition-all cursor-pointer">
                  APPLY SHIFT
                </button>
              </div>
              {/* Decorative wave */}
              <div className="absolute bottom-0 right-0 opacity-20">
                <svg
                  width="120"
                  height="60"
                  viewBox="0 0 120 60"
                  fill="none"
                >
                  <path
                    d="M0 60 Q30 30 60 40 T120 20"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M0 60 Q30 40 60 50 T120 30"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">
            verified_user
          </span>
          <span className="uppercase tracking-wider font-semibold">
            Bank-Grade Security Ensured
          </span>
        </div>
        <div className="flex gap-6 mt-3 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
