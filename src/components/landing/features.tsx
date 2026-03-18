"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "timeline",
    title: "Debt Timeline",
    description:
      "Visual chart showing exactly when you will be debt-free based on current payments.",
  },
  {
    icon: "psychology",
    title: "Smart Strategy",
    description:
      "AI recommendations for Avalanche or Snowball methods tailored to your EMI flow.",
  },
  {
    icon: "calculate",
    title: "Savings Calculator",
    description:
      "Calculate exactly how much ₹ you save by making small extra monthly payments.",
  },
  {
    icon: "swap_horiz",
    title: "Balance Transfer",
    description:
      "Identify high-interest personal loans and credit cards for low-interest transfers.",
  },
  {
    icon: "speed",
    title: "Credit Score Monitor",
    description:
      "Monthly credit score tracking with alerts on factors affecting your profile.",
  },
  {
    icon: "support_agent",
    title: "Expert Guidance",
    description:
      "Direct access to debt counselors for complex cases and legal inquiries.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-primary py-24 text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <motion.h2
            className="text-white text-[28px] font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Powerful Debt Tools
          </motion.h2>
          <p className="text-slate-300">
            Everything you need to manage, track, and eliminate debt in one
            place.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors cursor-default"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <span className="material-symbols-outlined text-cta-saffron mb-4 text-3xl block">
                {feature.icon}
              </span>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
