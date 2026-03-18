"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ConsultationCta() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24">
      <motion.div
        className="bg-primary rounded-2xl p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 relative z-10">
          <h2 className="text-white text-[28px] md:text-[32px] font-bold leading-tight">
            Need expert help navigating <br className="hidden md:block" />
            your debt?
          </h2>
          <p className="text-slate-300 text-lg">
            Schedule a free 15-minute consultation with our certified financial
            advisors. We help with EMI planning, settlement strategies, and
            credit repair.
          </p>
          <Link
            href="/auth/signup"
            className="w-fit bg-cta-saffron hover:bg-cta-saffron-hover text-white font-bold py-4 px-10 rounded-lg transition-all shadow-xl shadow-cta-saffron/20"
          >
            Talk to an Advisor
          </Link>
        </div>

        {/* Icon */}
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end relative z-10">
          <div className="size-48 md:size-72 bg-white/10 rounded-full border border-white/20 flex items-center justify-center p-8">
            <span className="material-symbols-outlined text-[80px] md:text-[120px] text-white/50">
              support_agent
            </span>
          </div>
        </div>

        {/* Decorative blur */}
        <div className="absolute -right-20 -bottom-20 size-80 bg-cta-saffron/10 rounded-full blur-3xl" />
      </motion.div>
    </section>
  );
}
