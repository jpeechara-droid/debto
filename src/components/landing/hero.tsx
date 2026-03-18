"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="p-3 md:p-4 lg:p-6 w-full h-[100svh] min-h-[750px] md:h-[90vh] mb-12 relative flex">
      <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-[#00144d]">

        {/* Background Image - Indian context, blue theme */}
        <img
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2550&auto=format&fit=crop"
          alt="Indian professional managing finances"
          className="absolute inset-0 w-full h-full object-cover object-[65%_20%] md:object-top"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00144d] via-[#0046FF]/60 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 md:to-black/60" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_40%,rgba(0,70,255,0.3)_0%,transparent_60%)] mix-blend-screen" />

        {/* Hero Content Wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end md:justify-center px-4 py-8 md:p-12 lg:px-24">

          <div className="max-w-3xl mb-auto md:mb-0 mt-24 md:mt-0">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-[36px] sm:text-[40px] md:text-[52px] lg:text-[64px] font-bold tracking-tight text-white leading-[1.15] md:leading-[1.1] mb-3 md:mb-4">
                Understand <span className="text-white/60 font-light px-1">•<br /></span> Optimise <span className="text-white/60 font-light px-1">•<br /></span> Eliminate
              </h1>
              <p className="text-[20px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-medium text-white/90 leading-snug">
                The smarter, faster way to become debt-free.
              </p>
            </motion.div>

            {/* The glowing stat card - left side below title */}
            <motion.div
              className="mt-8 md:mt-14 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-3 md:p-4 w-[280px] sm:w-[320px] md:w-72 shadow-2xl relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Visual stacked effect under the card */}
              <div className="absolute -bottom-2 inset-x-4 h-4 bg-white/60 backdrop-blur-xl border border-white/30 rounded-b-2xl -z-10 shadow-lg" />
              <div className="absolute -bottom-4 inset-x-8 h-4 bg-white/40 backdrop-blur-xl border border-white/20 rounded-b-2xl -z-20 shadow-sm" />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 md:size-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white">
                    <img src="https://i.pravatar.cc/150?img=5" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#0046FF] text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[12px] md:text-[14px]">menu_book</span>
                      Debt Free Plan
                    </div>
                    <div className="text-slate-600 text-[11px] md:text-sm font-medium mt-0.5">Optimized Pathway</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end mt-2 md:mt-3">
                <div>
                  <div className="text-slate-900 font-bold tracking-tight text-base md:text-lg">
                    ₹25,000<span className="text-slate-500 text-[11px] md:text-sm font-normal">/₹1,40,000</span>
                  </div>
                </div>
                <div className="text-[#ff5c5c] text-xs md:text-sm font-bold">
                  18%
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Right Content */}
          <motion.div
            className="w-full md:absolute md:bottom-12 md:right-12 lg:right-24 md:max-w-sm flex flex-col items-start md:items-end text-left md:text-right mt-12 md:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-white/90 text-sm md:text-[17px] leading-relaxed mb-6 font-medium max-w-[340px] md:max-w-none">
              India&apos;s most trusted AI-powered debt optimization platform. We analyze your loans from HDFC, SBI, ICICI and more to build a personalized path to freedom.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/auth/signup"
                className="inline-flex flex-row items-center justify-center gap-2 bg-[#0046FF] hover:bg-[#003BCC] text-white text-[15px] md:text-base font-bold py-3.5 md:py-4 px-6 md:px-8 rounded-full transition-all shadow-[0_4px_16px_rgba(0,70,255,0.4)] w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                Get Free Debt Analysis
              </Link>
              {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
                <Link
                  href="/dashboard"
                  className="inline-flex flex-row items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-[15px] md:text-base font-bold py-3.5 md:py-4 px-6 md:px-8 rounded-full transition-all hover:bg-white/25 w-full sm:w-auto"
                >
                  <span className="material-symbols-outlined text-lg">play_circle</span>
                  Try Live Demo
                </Link>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
