"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const MOCK_LOANS = [
  { id: "1", name: "SBI Personal Loan", balance: 112000, apr: 14.5, emi: 8500, remaining: 14 },
  { id: "2", name: "HDFC Home Loan", balance: 2545000, apr: 8.5, emi: 28500, remaining: 156 },
  { id: "3", name: "ICICI Credit Card", balance: 150000, apr: 42, emi: 0, remaining: 0 },
  { id: "4", name: "Axis Auto Loan", balance: 380000, apr: 9.2, emi: 12400, remaining: 32 },
];

const TRANSFER_OFFERS = [
  { bank: "IDFC First", apr: 10.75, fee: 1.5, tenure: 36 },
  { bank: "Kotak Mahindra", apr: 11.25, fee: 2, tenure: 48 },
  { bank: "Federal Bank", apr: 10.9, fee: 1, tenure: 24 },
];

export default function BalanceTransferPage() {
  const [selectedLoan, setSelectedLoan] = useState(MOCK_LOANS[0]);
  const [selectedOffer, setSelectedOffer] = useState(TRANSFER_OFFERS[0]);
  const [isCalculated, setIsCalculated] = useState(true);

  const monthlyRate1 = selectedLoan.apr / 12 / 100;
  const monthlyRate2 = selectedOffer.apr / 12 / 100;
  const tenure = selectedOffer.tenure;
  const fee = selectedLoan.balance * (selectedOffer.fee / 100);

  const emi1 = monthlyRate1 > 0
    ? (selectedLoan.balance * monthlyRate1 * Math.pow(1 + monthlyRate1, tenure)) / (Math.pow(1 + monthlyRate1, tenure) - 1)
    : selectedLoan.balance / tenure;

  const transferBalance = selectedLoan.balance + fee;
  const emi2 = monthlyRate2 > 0
    ? (transferBalance * monthlyRate2 * Math.pow(1 + monthlyRate2, tenure)) / (Math.pow(1 + monthlyRate2, tenure) - 1)
    : transferBalance / tenure;

  const totalCurrent = emi1 * tenure;
  const totalTransfer = emi2 * tenure;
  const totalSavings = totalCurrent - totalTransfer;
  const monthlySavings = emi1 - emi2;
  const interestCurrent = totalCurrent - selectedLoan.balance;
  const interestTransfer = totalTransfer - transferBalance;
  const worthIt = totalSavings > fee;

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard/calculators" className="hover:text-[#1B2A4A] transition-colors">
            Calculators
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Balance Transfer Analyzer</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Balance Transfer Analyzer</h1>
        <p className="text-gray-500 mt-1">Compare your current loan against transfer offers to find savings</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel — Loan Selection & Offer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select Loan */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4">Select Loan to Transfer</h2>
              <div className="space-y-3">
                {MOCK_LOANS.map((loan) => (
                  <button
                    key={loan.id}
                    onClick={() => { setSelectedLoan(loan); setIsCalculated(true); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedLoan.id === loan.id
                        ? "border-[#FF6B00] bg-orange-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#1B2A4A]">{loan.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {loan.apr}% APR • {loan.remaining} months left
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1B2A4A]">{formatINR(loan.balance)}</p>
                        {loan.emi > 0 && (
                          <p className="text-xs text-gray-400">{formatINR(loan.emi)}/mo</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Transfer Offers */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[#1B2A4A] mb-1">Transfer Offers</h2>
              <p className="text-sm text-gray-500 mb-4">Select a bank to compare against</p>
              <div className="space-y-3">
                {TRANSFER_OFFERS.map((offer, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedOffer(offer); setIsCalculated(true); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedOffer.bank === offer.bank
                        ? "border-[#2E75B6] bg-blue-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="material-symbols-rounded text-[#2E75B6] text-xl">account_balance</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#1B2A4A]">{offer.bank}</p>
                          <p className="text-sm text-gray-500">{offer.tenure} month tenure</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{offer.apr}%</p>
                        <p className="text-xs text-gray-400">{offer.fee}% fee</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Panel — Results */}
          <div className="lg:col-span-3 space-y-6">
            {isCalculated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Verdict Card */}
                <Card className={`p-6 border-2 ${worthIt ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${worthIt ? "bg-green-100" : "bg-orange-100"}`}>
                      <span className={`material-symbols-rounded text-2xl ${worthIt ? "text-green-600" : "text-orange-600"}`}>
                        {worthIt ? "check_circle" : "warning"}
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${worthIt ? "text-green-800" : "text-orange-800"}`}>
                        {worthIt ? "Transfer Recommended ✓" : "Transfer Not Recommended"}
                      </h3>
                      <p className={`text-sm mt-1 ${worthIt ? "text-green-700" : "text-orange-700"}`}>
                        {worthIt
                          ? `You'll save ${formatINR(Math.round(totalSavings))} over ${tenure} months. The ${selectedOffer.fee}% processing fee (${formatINR(Math.round(fee))}) is recovered in ${Math.ceil(fee / Math.max(monthlySavings, 1))} months.`
                          : `The processing fee of ${formatINR(Math.round(fee))} outweighs the interest savings. Not recommended for this scenario.`
                        }
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Current */}
                  <Card className="p-5 border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <h3 className="font-semibold text-[#1B2A4A]">Current Loan</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">APR</p>
                        <p className="text-2xl font-bold text-red-600">{selectedLoan.apr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Monthly EMI</p>
                        <p className="text-lg font-semibold text-[#1B2A4A]">{formatINR(Math.round(emi1))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Interest</p>
                        <p className="text-lg font-semibold text-red-600">{formatINR(Math.round(interestCurrent))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Cost</p>
                        <p className="text-lg font-semibold text-[#1B2A4A]">{formatINR(Math.round(totalCurrent))}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Transfer */}
                  <Card className="p-5 border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <h3 className="font-semibold text-[#1B2A4A]">{selectedOffer.bank}</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">APR</p>
                        <p className="text-2xl font-bold text-green-600">{selectedOffer.apr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Monthly EMI</p>
                        <p className="text-lg font-semibold text-[#1B2A4A]">{formatINR(Math.round(emi2))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Interest</p>
                        <p className="text-lg font-semibold text-green-600">{formatINR(Math.round(interestTransfer))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Cost</p>
                        <p className="text-lg font-semibold text-[#1B2A4A]">{formatINR(Math.round(totalTransfer))}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Savings Breakdown */}
                {worthIt && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-[#1B2A4A] mb-4">Savings Breakdown</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <p className="text-2xl font-bold text-green-600">{formatINR(Math.round(totalSavings))}</p>
                        <p className="text-xs text-gray-500 mt-1">Total Saved</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-bold text-[#2E75B6]">{formatINR(Math.round(monthlySavings))}</p>
                        <p className="text-xs text-gray-500 mt-1">Monthly Savings</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-xl">
                        <p className="text-2xl font-bold text-[#FF6B00]">{formatINR(Math.round(fee))}</p>
                        <p className="text-xs text-gray-500 mt-1">Processing Fee</p>
                      </div>
                    </div>

                    {/* Visual comparison bar */}
                    <div className="mt-6 space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Current Total</span>
                          <span className="font-medium">{formatINR(Math.round(totalCurrent))}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: "100%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">After Transfer</span>
                          <span className="font-medium text-green-600">{formatINR(Math.round(totalTransfer))}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-400 rounded-full transition-all duration-700"
                            style={{ width: `${(totalTransfer / totalCurrent) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Fee Impact Warning */}
                <Card className="p-5 bg-amber-50 border-amber-200">
                  <div className="flex gap-3">
                    <span className="material-symbols-rounded text-amber-600 text-xl flex-shrink-0">info</span>
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">Fee Impact Notice</h4>
                      <p className="text-sm text-amber-700">
                        The {selectedOffer.fee}% processing fee ({formatINR(Math.round(fee))}) is added to your
                        transferred balance, making the effective amount {formatINR(Math.round(transferBalance))}.
                        This fee is typically non-refundable. Always read the full terms before proceeding.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* CTA */}
                <div className="flex gap-3">
                  <Link
                    href="/dashboard/consultations"
                    className="flex-1 bg-[#1B2A4A] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#2a3d6b] transition-colors"
                  >
                    Consult an Expert
                  </Link>
                  <button className="px-6 py-3 border-2 border-gray-200 rounded-xl text-[#1B2A4A] font-medium hover:border-gray-300 transition-colors flex items-center gap-2">
                    <span className="material-symbols-rounded text-lg">download</span>
                    Export
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
