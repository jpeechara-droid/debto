"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rajesh K.",
    location: "Bangalore, Karnataka",
    text: "Debto helped me consolidate 3 credit cards into one low-interest loan. I'm saving ₹4,500 every month on interest alone!",
    initials: "RK",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Priyanka M.",
    location: "Mumbai, Maharashtra",
    text: "The AI analysis revealed exactly how much I was overpaying my private bank. Following the roadmap made everything simple.",
    initials: "PM",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Amit S.",
    location: "Gurugram, Haryana",
    text: "I finally have a clear date for when I will be debt-free. That peace of mind is worth everything. Highly recommend.",
    initials: "AS",
    color: "from-amber-500 to-orange-600",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <motion.h2
          className="text-primary text-[28px] font-semibold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Stories from Debt-Free Indians
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Stars */}
              <div className="flex gap-1 text-cta-saffron mb-4">
                {[...Array(5)].map((_, j) => (
                  <span
                    key={j}
                    className="material-symbols-outlined fill-1 text-sm"
                  >
                    star
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-600 italic mb-6 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-primary font-bold text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
