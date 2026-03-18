"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Wallet } from "lucide-react";

const testimonials = [
  {
    quote: "\"Debto helps me monitor all my loans in real time. It feels like having a personal debt advisor beside me 24/7.\"",
    author: "Rahul Sharma",
    role: "Manager, Netdot",
    avatar: "/images/platform/indian_man_avatar.png",
    companyInitial: "N",
    companyName: "Netdot"
  },
  {
    quote: "\"The actionable insights provided by Debto allowed me to optimise my EMIs and reduce my debt burden in record time.\"",
    author: "Priya Patel",
    role: "Director, Innovate",
    avatar: "/images/platform/indian_woman_avatar.png",
    companyInitial: "I",
    companyName: "Innovate"
  },
  {
    quote: "\"I finally have clarity on my finances. The debt restructuring advice was life-changing for my family.\"",
    author: "Amit Singh",
    role: "Founder, TechCorp",
    avatar: "/images/platform/avatar_man.png",
    companyInitial: "T",
    companyName: "TechCorp"
  }
];

export default function PlatformOverview() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[currentTestimonialIndex];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-6">
            Better Insights. Smarter Decisions. Less Interest.
          </h2>
          <p className="text-lg text-gray-500">
            Built for people who want clarity, control, and confidence.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

          {/* Left Column: Stats */}
          <div className="flex flex-col justify-between lg:pr-10 pt-4">
            <div>
              <h3 className="text-[28px] font-bold text-gray-900 mb-6 tracking-tight">Debto stats</h3>
              <p className="text-gray-700 leading-relaxed mb-8 pr-4">
                Relied upon by our users throughtout india, with 98% satisfaction rate.
              </p>
              <button
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-white font-medium transition-transform hover:scale-105"
                style={{ backgroundColor: "rgb(0, 70, 255)" }}
              >
                <ArrowUpRight className="w-5 h-5 mr-2" />
                About Us
              </button>
            </div>

            <div className="flex items-end gap-12 mt-16 lg:mt-0 lg:mb-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">Indian users</p>
                <h4 className="text-[40px] font-bold tracking-tighter text-gray-900 leading-none">1 Lakh</h4>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Satisfaction rate</p>
                <h4 className="text-[40px] font-bold tracking-tighter text-gray-900 leading-none">98%</h4>
              </div>
            </div>
          </div>

          {/* Middle Column: Image */}
          <div className="relative rounded-[2rem] overflow-hidden min-h-[450px] lg:h-auto bg-gray-100 shadow-sm">
            <Image
              src="/images/platform/indian_woman_phone.png"
              alt="User using app"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />

            {/* Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8 bg-white/95 backdrop-blur-md rounded-[20px] p-4 flex items-center shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Wallet className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-[17px] font-bold text-gray-900 leading-tight">Indian Debt</p>
                <p className="text-[13px] text-gray-500 mt-0.5">Optimisation</p>
              </div>
              <button
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white flex-shrink-0 hover:scale-105 transition-transform"
                style={{ backgroundColor: "rgb(0, 70, 255)" }}
              >
                <ArrowUpRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right Column: Testimonial */}
          <div className="rounded-[2rem] p-8 lg:p-10 flex flex-col justify-between shadow-sm min-h-[450px] lg:h-auto transition-colors duration-500" style={{ backgroundColor: "rgba(0, 70, 255, 0.04)" }}>
            <div className={`transition-opacity duration-500`}>
              <div className="flex items-center mb-10">
                <div className="w-8 h-8 bg-[#1a1a1a] rounded flex items-center justify-center mr-3 shadow-sm">
                  <span className="text-white font-bold text-[17px] leading-none tracking-tighter">{t.companyInitial}</span>
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">{t.companyName}</span>
              </div>

              <p className="text-[22px] text-gray-900 font-medium leading-[1.4] tracking-tight min-h-[120px]">
                {t.quote}
              </p>
            </div>

            <div className="flex items-center justify-between mt-12 lg:mt-0">
              <div className="flex items-center">
                <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4 border-2 border-white shadow-sm">
                  <Image
                    key={t.avatar}
                    src={t.avatar}
                    alt={t.author}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 48px, 48px"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[15px] leading-tight mb-0.5">{t.author}</p>
                  <p className="text-gray-500 text-[13px] font-medium leading-tight">{t.role}</p>
                </div>
              </div>

              <div className="flex space-x-[5px]">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonialIndex(i)}
                    className={`h-[7px] rounded-full transition-all duration-300 ${i === currentTestimonialIndex ? "w-4" : "w-[7px]"
                      }`}
                    style={
                      i === currentTestimonialIndex
                        ? { backgroundColor: "rgb(0, 70, 255)" }
                        : { backgroundColor: "rgba(0, 70, 255, 0.2)" }
                    }
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
