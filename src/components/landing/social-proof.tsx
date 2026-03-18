"use client";

import { motion } from "framer-motion";

export default function SocialProof() {
  return (
    <section className="bg-white border-y border-slate-100 py-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-10">
        <motion.div
          className="flex flex-col gap-1 items-center md:items-start"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-1 text-cta-saffron">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined fill-1">
                star
              </span>
            ))}
          </div>
          <p className="text-primary font-bold">Trusted by 25,000+ Indians</p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
          {["HDFC Bank", "SBI", "ICICI", "Axis Bank"].map((bank) => (
            <div
              key={bank}
              className="h-8 px-4 flex items-center justify-center"
            >
              <span className="text-sm font-bold text-slate-600 tracking-wider uppercase">
                {bank}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
