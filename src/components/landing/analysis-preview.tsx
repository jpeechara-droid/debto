"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AnalysisPreview() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24 flex flex-col lg:flex-row items-center gap-16">
      {/* Left content */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col gap-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-primary text-[28px] font-semibold leading-tight">
          Detailed Analysis of Your Financial Health
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Our AI analyzes over 50 data points from your credit history to
          generate a comprehensive 12-page report. Know your Debt-to-Income
          ratio, interest leakage, and potential savings in under 2 minutes.
        </p>
        <div className="flex flex-col gap-4 mb-4">
          {[
            "Interest Leakage Identification",
            "Pre-payment Impact Analysis",
            "Lender Negotiation Tips",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary-blue">
                check_circle
              </span>
              <p className="text-slate-700 font-medium">{item}</p>
            </div>
          ))}
        </div>
        <Link
          href="/auth/signup"
          className="w-fit bg-cta-saffron hover:bg-cta-saffron-hover text-white font-bold py-3.5 px-8 rounded-lg transition-all flex items-center gap-2"
        >
          See Your Report
          <span className="material-symbols-outlined">description</span>
        </Link>
      </motion.div>

      {/* Right - Chart mockup */}
      <motion.div
        className="w-full lg:w-1/2"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4">
          <div
            className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100 rounded-lg aspect-video flex flex-col p-6 gap-4"
          >
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="flex-1 flex items-end gap-2 px-4">
              <div className="flex-1 bg-secondary-blue/40 h-[90%] rounded-t-sm transition-all hover:bg-secondary-blue/60" />
              <div className="flex-1 bg-secondary-blue/50 h-[75%] rounded-t-sm transition-all hover:bg-secondary-blue/70" />
              <div className="flex-1 bg-secondary-blue/60 h-[60%] rounded-t-sm transition-all hover:bg-secondary-blue/80" />
              <div className="flex-1 bg-secondary-blue/70 h-[45%] rounded-t-sm transition-all hover:bg-secondary-blue/90" />
              <div className="flex-1 bg-cta-saffron h-[30%] rounded-t-sm transition-all hover:bg-cta-saffron-hover" />
              <div className="flex-1 bg-cta-saffron h-[15%] rounded-t-sm transition-all hover:bg-cta-saffron-hover" />
            </div>
            <div className="flex justify-between px-2">
              <span className="text-[10px] text-slate-400">2026</span>
              <span className="text-[10px] text-slate-400">2027</span>
              <span className="text-[10px] text-slate-400">2028</span>
              <span className="text-[10px] text-slate-400">2029</span>
              <span className="text-[10px] text-cta-saffron font-bold uppercase tracking-tighter">
                Debt Free!
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
