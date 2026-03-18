"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Is Debto safe and regulated?",
    answer:
      "Yes, Debto is fully RBI compliant and uses bank-grade 256-bit encryption to protect your data. We never share your personal information with third-party lenders without your explicit consent.",
  },
  {
    question: "Does checking my debt status affect my credit score?",
    answer:
      "No. Debto performs a 'soft pull' of your credit report, which does not impact your CIBIL score. Only hard inquiries made by lenders during loan applications can affect your score.",
  },
  {
    question: "Which banks do you support?",
    answer:
      "Debto works with all major Indian banks and NBFCs including HDFC, SBI, ICICI, Axis, Kotak, Bajaj Finserv, and more. We fetch your credit report from CIBIL which covers all regulated lenders.",
  },
  {
    question: "How long does the AI analysis take?",
    answer:
      "Our AI analysis is generated in under 2 minutes. It analyzes over 50 data points from your credit report to create a comprehensive 12-page report with actionable insights.",
  },
  {
    question: "Can you help if I am already in default?",
    answer:
      "Yes, absolutely. Our expert consultation service includes certified counselors who specialize in debt settlement, legal advice, and credit repair strategies for users in difficult financial situations.",
  },
  {
    question: "Is the basic debt report free?",
    answer:
      "Yes! The basic debt analysis, credit report view, and AI-powered recommendations are completely free. Premium features like expert consultations and detailed PDF reports are available for a fee.",
  },
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-[800px] mx-auto px-6 py-24">
      <motion.h2
        className="text-primary text-[28px] font-semibold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Frequently Asked Questions
      </motion.h2>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            className="border border-slate-200 rounded-xl bg-white overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              className="w-full px-6 py-5 text-left flex justify-between items-center group cursor-pointer"
              onClick={() =>
                setActiveIndex(activeIndex === i ? null : i)
              }
            >
              <span className="font-bold text-primary pr-4">
                {faq.question}
              </span>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors flex-shrink-0">
                {activeIndex === i ? "remove" : "add"}
              </span>
            </button>
            <AnimatePresence>
              {activeIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
