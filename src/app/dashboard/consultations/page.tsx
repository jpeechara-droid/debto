"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

const services = [
  {
    id: "debt_strategy",
    name: "Debt Strategy Session",
    description: "Personalized roadmap to clear your high-interest debts.",
    price: 999,
    icon: "psychology",
  },
  {
    id: "credit_cleanup",
    name: "Credit Score Cleanup",
    description: "Improve your creditworthiness with expert advice.",
    price: 1499,
    icon: "trending_up",
  },
  {
    id: "legal_advice",
    name: "Legal Debt Advice",
    description: "Legal consultation for harassment or settlement issues.",
    price: 1999,
    icon: "gavel",
  },
];

const advisors = [
  {
    id: "anil",
    name: "Anil Sharma",
    title: "Senior Debt Consultant",
    rating: 4.9,
    reviews: 120,
    initials: "AS",
    color: "bg-primary",
  },
  {
    id: "priya",
    name: "Priya Verma",
    title: "Credit Specialist",
    rating: 4.7,
    reviews: 85,
    initials: "PV",
    color: "bg-secondary-blue",
  },
  {
    id: "rohan",
    name: "Rohan Das",
    title: "Legal Expert",
    rating: 4.8,
    reviews: 92,
    initials: "RD",
    color: "bg-cta-saffron",
  },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "12:30 PM", "02:00 PM", "04:30 PM", "06:00 PM",
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon = 0
  const days: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }
  return days;
}

export default function ConsultationsPage() {
  const [selectedService, setSelectedService] = useState("debt_strategy");
  const [selectedAdvisor, setSelectedAdvisor] = useState("anil");
  const [selectedDate, setSelectedDate] = useState(18);
  const [selectedTime, setSelectedTime] = useState("10:30 AM");
  const [callMode, setCallMode] = useState<"video" | "phone">("video");
  const [currentMonth] = useState({ year: 2026, month: 2 }); // March 2026

  const today = 13;
  const calendarDays = getCalendarDays(currentMonth.year, currentMonth.month);
  const monthName = new Date(
    currentMonth.year,
    currentMonth.month
  ).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const service = services.find((s) => s.id === selectedService)!;
  const advisor = advisors.find((a) => a.id === selectedAdvisor)!;
  const gst = Math.round(service.price * 0.18);
  const total = service.price + gst;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Book a Consultation
        </h1>
        <p className="text-slate-500 mt-1">
          Expert financial guidance for your debt management journey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Select Service */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="size-7 bg-cta-saffron text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h2 className="text-lg font-bold text-primary">
                Select Service
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => setSelectedService(svc.id)}
                  className={`relative border-2 rounded-xl p-5 text-left transition-all cursor-pointer ${
                    selectedService === svc.id
                      ? "border-cta-saffron bg-cta-saffron/5"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {selectedService === svc.id && (
                    <span className="absolute top-3 right-3 text-xs font-bold text-cta-saffron uppercase">
                      Selected
                    </span>
                  )}
                  <span
                    className={`material-symbols-outlined text-2xl mb-3 ${
                      selectedService === svc.id
                        ? "text-cta-saffron"
                        : "text-slate-400"
                    }`}
                  >
                    {svc.icon}
                  </span>
                  <p className="font-bold text-primary text-sm mb-1">
                    {svc.name}
                  </p>
                  <p className="text-xs text-slate-400 mb-3">
                    {svc.description}
                  </p>
                  <p className="text-lg font-bold text-cta-saffron">
                    {formatINR(svc.price)}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Step 2: Choose Advisor */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="size-7 bg-cta-saffron text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h2 className="text-lg font-bold text-primary">
                Choose Advisor
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {advisors.map((adv) => (
                <button
                  key={adv.id}
                  onClick={() => setSelectedAdvisor(adv.id)}
                  className={`relative border-2 rounded-xl p-5 text-center transition-all cursor-pointer ${
                    selectedAdvisor === adv.id
                      ? "border-cta-saffron bg-cta-saffron/5"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {selectedAdvisor === adv.id && (
                    <div className="absolute top-3 right-3 size-5 bg-cta-saffron rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm">
                        check
                      </span>
                    </div>
                  )}
                  {/* Avatar */}
                  <div
                    className={`size-16 rounded-full mx-auto mb-3 ${adv.color} text-white flex items-center justify-center text-xl font-bold`}
                  >
                    {adv.initials}
                  </div>
                  <p className="font-bold text-primary text-sm">{adv.name}</p>
                  <p className="text-xs text-cta-saffron mb-2">{adv.title}</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-cta-saffron text-sm">★</span>
                    <span className="text-sm font-semibold text-primary">
                      {adv.rating}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({adv.reviews}+ reviews)
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Step 3: Select Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="size-7 bg-cta-saffron text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h2 className="text-lg font-bold text-primary">
                Select Date & Time
              </h2>
            </div>

            <Card padding="lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-primary">{monthName}</h3>
                    <div className="flex gap-2">
                      <button className="size-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-sm">
                          chevron_left
                        </span>
                      </button>
                      <button className="size-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-sm">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-[10px] text-slate-400 font-semibold py-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {calendarDays.map((day, i) => (
                      <button
                        key={i}
                        disabled={!day || day < today}
                        onClick={() => day && setSelectedDate(day)}
                        className={`py-2 text-sm rounded-lg transition-all cursor-pointer ${
                          !day
                            ? "invisible"
                            : day < today
                            ? "text-slate-300 cursor-not-allowed"
                            : day === selectedDate
                            ? "bg-cta-saffron text-white font-bold"
                            : "text-primary hover:bg-slate-100 font-medium"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="font-bold text-primary mb-4">
                    Available Slots
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 px-4 border rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          selectedTime === time
                            ? "bg-cta-saffron text-white border-cta-saffron"
                            : "border-slate-200 text-primary hover:border-cta-saffron"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call Mode */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-primary mb-3">
                  Preferred Mode
                </h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="callMode"
                      value="video"
                      checked={callMode === "video"}
                      onChange={() => setCallMode("video")}
                      className="accent-cta-saffron"
                    />
                    <span className="text-sm text-primary font-medium">
                      Video Call (Google Meet)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="callMode"
                      value="phone"
                      checked={callMode === "phone"}
                      onChange={() => setCallMode("phone")}
                      className="accent-cta-saffron"
                    />
                    <span className="text-sm text-slate-500">Phone Call</span>
                  </label>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right — Booking Summary (Sticky) */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="sticky top-24">
            <Card padding="lg">
              <h3 className="text-lg font-bold text-primary mb-5">
                Booking Summary
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">
                    design_services
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Service
                    </p>
                    <p className="font-semibold text-primary text-sm">
                      {service.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">
                    person
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Advisor
                    </p>
                    <p className="font-semibold text-primary text-sm">
                      {advisor.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">
                    calendar_today
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Date & Time
                    </p>
                    <p className="font-semibold text-primary text-sm">
                      March {selectedDate}, 2026 at {selectedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">
                    videocam
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Mode
                    </p>
                    <p className="font-semibold text-primary text-sm">
                      {callMode === "video" ? "Video Call" : "Phone Call"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 mt-5 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-primary">
                    {formatINR(service.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">GST (18%)</span>
                  <span className="font-medium text-primary">
                    {formatINR(gst)}
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-slate-200">
                  <span className="font-bold text-primary">Total</span>
                  <span className="font-extrabold text-primary">
                    {formatINR(total)}
                  </span>
                </div>
              </div>

              <button className="w-full mt-6 bg-cta-saffron hover:bg-cta-saffron-hover text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                Pay {formatINR(total)}
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </button>

              <p className="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs">
                  verified_user
                </span>
                Secure Payment by Razorpay
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
