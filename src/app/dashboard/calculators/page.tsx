"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const calculators = [
  {
    title: "Extra Payment Calculator",
    description:
      "See how additional monthly payments reduce your interest and timeline.",
    href: "/dashboard/calculators/extra-payment",
    icon: "payments",
    iconColor: "text-white",
    bgClass: "bg-[#8BCAC8]",
    cta: "Open Calculator",
    ctaStyle: "bg-[#F39C12] text-white hover:bg-[#E67E22] border-transparent",
    image: (
      <div className="w-full h-full relative overflow-hidden flex items-end justify-center">
         {/* Simple CSS representation of the coins/arrow graphic */}
         <svg viewBox="0 0 200 100" className="absolute bottom-0 w-full h-full drop-shadow-md">
            <path d="M 20 80 Q 100 80 180 20" fill="none" stroke="white" strokeWidth="3" strokeDasharray="5,5" />
            <polygon points="175,15 185,25 182,12" fill="white" />
            {/* Coins */}
            <rect x="50" y="70" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
            <rect x="50" y="60" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
            
            <rect x="90" y="70" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
            <rect x="90" y="60" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
            <rect x="90" y="50" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
            
            <rect x="130" y="70" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
            <rect x="130" y="60" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
            <rect x="130" y="50" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
            <rect x="130" y="40" width="20" height="10" rx="2" fill="#F4D03F" stroke="#D4AC0D" />
         </svg>
      </div>
    )
  },
  {
    title: "Balance Transfer Analyzer",
    description:
      "Compare potential savings when moving high-interest debt to new cards.",
    href: "/dashboard/calculators/balance-transfer",
    icon: "swap_horiz",
    iconColor: "text-white",
    bgClass: "bg-[#1E565F]",
    cta: "Open Analyzer",
    ctaStyle:
      "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50",
    image: (
      <div className="w-full h-full relative flex items-center justify-center p-4">
         <div className="w-full max-w-[120px] aspect-[4/3] bg-white rounded-md shadow-lg flex items-end justify-around p-2 pt-6">
            <div className="w-1/5 bg-[#8BCAC8] h-[40%] rounded-t-sm"></div>
            <div className="w-1/5 bg-[#1E565F] h-[70%] rounded-t-sm"></div>
            <div className="w-1/5 bg-[#8BCAC8] h-[55%] rounded-t-sm"></div>
            <div className="w-1/5 bg-[#1E565F] h-[90%] rounded-t-sm"></div>
         </div>
      </div>
    )
  },
  {
    title: "Loan Consolidation Planner",
    description:
      "Evaluate the impact of combining multiple loans into a single payment.",
    href: "/dashboard/calculators/consolidation",
    icon: "account_tree",
    iconColor: "text-white",
    bgClass: "bg-[#2C3E50]",
    cta: "Start Planning",
    ctaStyle:
      "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50",
    image: (
      <div className="w-full h-full relative flex flex-col items-center justify-end pb-2">
         {/* Stacked blocks */}
         <div className="w-10 h-8 bg-[#D4AC0D] rounded-sm border border-[#B7950B] mb-1"></div>
         <div className="w-10 h-8 bg-[#F4D03F] rounded-sm border border-[#D4AC0D] mb-1 translate-x-1"></div>
         <div className="w-10 h-8 bg-[#D4AC0D] rounded-sm border border-[#B7950B] mb-1 -translate-x-1"></div>
         <div className="w-10 h-8 bg-[#F4D03F] rounded-sm border border-[#D4AC0D] mb-1"></div>
         <div className="w-10 h-8 bg-[#D4AC0D] rounded-sm border border-[#B7950B]"></div>
      </div>
    )
  },
];

export default function CalculatorsHubPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Calculators Hub</p>
        <h1 className="text-[28px] font-bold text-[#1A1A1A]">
          Financial Calculators
        </h1>
        <p className="text-[15px] text-slate-600 mt-2">
          Explore scenarios and find your fastest path to debt freedom.
        </p>
      </motion.div>

      {/* Calculator Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {calculators.map((calc, i) => (
          <motion.div
            key={calc.title}
            className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            {/* Top Half Media */}
            <div
              className={`h-[180px] w-full ${calc.bgClass} relative`}
            >
              {calc.image}
              <div
                className={`size-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center absolute top-5 left-5 shadow-sm`}
              >
                <span className={`material-symbols-outlined ${calc.iconColor} text-[20px]`}>
                  {calc.icon}
                </span>
              </div>
            </div>

            {/* Bottom Half Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-3 leading-tight">
                {calc.title}
              </h3>
              <p className="text-[14px] text-slate-500 leading-relaxed flex-1">
                {calc.description}
              </p>
              <Link
                href={calc.href}
                className={`mt-8 py-3 w-full rounded-full text-[14px] font-bold text-center transition-all flex items-center justify-center gap-2 ${calc.ctaStyle}`}
              >
                {calc.cta}
                <span className="material-symbols-outlined text-[16px]">
                  {i === 0 ? "arrow_forward" : "open_in_new"}
                </span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Consultation CTA block styled to match mockup */}
      <motion.div
        className="bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 mt-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center">
          <h3 className="text-[24px] font-bold text-[#1A1A1A] mb-3">
            Need personalized advice?
          </h3>
          <p className="text-[15px] text-slate-600 max-w-md leading-relaxed mb-8">
            Our financial advisors are ready to help you craft a custom strategy
            based on your unique debt profile and financial goals.
          </p>
          <Link
            href="/dashboard/consultations"
            className="bg-[#1A1A1A] hover:bg-black text-white font-bold py-3.5 px-8 rounded-full transition-all w-fit"
          >
            Schedule a Free Consultation
          </Link>
        </div>
        <div className="w-full md:w-[40%] bg-gradient-to-t from-slate-100 to-white relative min-h-[250px] md:min-h-auto flex items-end justify-center">
            {/* Note: This is a placeholder for the portrait image in the mockup */}
            <div className="w-[80%] aspect-[2/3] max-w-[280px] bg-slate-200 rounded-t-[100px] overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" alt="Financial Advisor" className="w-full h-full object-cover" />
            </div>
        </div>
      </motion.div>
    </div>
  );
}
