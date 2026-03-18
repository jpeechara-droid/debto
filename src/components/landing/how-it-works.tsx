"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description:
      "Create your secure account using your mobile number linked to your bank.",
  },
  {
    number: 2,
    title: "Fetch CIBIL",
    description:
      "We securely fetch your credit report and active loan details in seconds.",
  },
  {
    number: 3,
    title: "AI Analysis",
    description:
      "Receive a custom roadmap to pay off debt 40% faster with interest savings.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24"
    >
      <div className="text-center mb-16">
        <motion.h2
          className="text-primary text-[28px] font-semibold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Your Path to Debt-Freedom
        </motion.h2>
        <p className="text-slate-500">
          Three simple steps to start saving on your interest payments.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Dotted line connector */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] border-t-2 border-dotted border-slate-200 -z-10" />

        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            className="flex flex-col items-center text-center group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <div className="size-16 rounded-full bg-cta-saffron flex items-center justify-center text-white text-2xl font-bold mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cta-saffron/30">
              {step.number}
            </div>
            <h3 className="text-primary text-xl font-bold mb-2">
              {step.title}
            </h3>
            <p className="text-slate-500 leading-relaxed px-4">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
