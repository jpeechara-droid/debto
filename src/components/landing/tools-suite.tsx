import React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  CreditCard,
  Building,
  Home,
  Briefcase,
  ChevronRight,
  LineChart,
  Lightbulb,
  Calculator,
  ArrowRightLeft,
  Gauge,
  Headphones,
} from "lucide-react";

export default function ToolsSuite() {
  return (
    <section className="py-12 lg:py-24 bg-white overflow-hidden font-sans">
      <div className="container mx-auto max-w-7xl">
        {/* Main large Container with background image */}
        <div className="relative rounded-[3rem] overflow-hidden min-h-[850px] w-full pt-16 lg:pt-24 pb-12 lg:pb-16 px-6 lg:px-12 flex flex-col items-center">
          {/* Header Text */}
          <div className="relative z-10 text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-[40px] md:text-[44px] lg:text-[44px] font-medium tracking-tight text-[#111111] leading-[1.05] mb-6">
              A suite of tools to help you take charge of your financial future
            </h2>
            <p className="text-lg md:text-[20px] text-gray-700 font-medium">
              Our platform provides personalized insights and flexible financial
              tools.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-auto">
            {/* Left Card: Features (Budgeting/Tracking) */}
            <div
              className="rounded-[2.5rem] p-8 lg:p-12 overflow-hidden relative backdrop-blur-2xl flex flex-col justify-between aspect-square lg:aspect-auto min-h-[500px] group transition-all duration-500"
              style={{ backgroundColor: "rgba(0, 70, 255, 0.04)" }}
            >
              {/* Background cleanly handled by inline styling */}

              <div className="relative z-10">
                <h3 className="text-[#111111] text-[32px] md:text-[38px] font-medium tracking-tight leading-tight mb-4 max-w-[400px]">
                  Powerful Debt Tools
                </h3>
                <p className="text-gray-700 text-[16px] leading-relaxed mb-8 max-w-[340px] font-medium">
                  Everything you need to manage, track, and eliminate debt in
                  one place. Our AI examines your financial trends.
                </p>
                <button
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-sm font-bold shadow-sm hover:shadow-md transition-all group"
                  style={{ color: "rgb(0, 70, 255)" }}
                >
                  <ArrowUpRight
                    className="w-[18px] h-[18px] mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                    strokeWidth={2.5}
                  />
                  Try Now
                </button>
              </div>

              {/* Features Grid */}
              <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-end">
                {[
                  {
                    icon: LineChart,
                    title: "Debt Timeline",
                    desc: "Visual chart showing exactly when you will be debt-free based on current payments.",
                  },
                  {
                    icon: Lightbulb,
                    title: "Smart Strategy",
                    desc: "AI recommendations for Avalanche or Snowball methods tailored to your EMI flow.",
                  },
                  {
                    icon: Calculator,
                    title: "Savings Calculator",
                    desc: "Calculate exactly how much ₹ you save by making small extra monthly payments.",
                  },
                  {
                    icon: ArrowRightLeft,
                    title: "Balance Transfer",
                    desc: "Identify high-interest personal loans and credit cards for low-interest transfers.",
                  },
                  {
                    icon: Gauge,
                    title: "Credit Score Monitor",
                    desc: "Monthly credit score tracking with alerts on factors affecting your profile.",
                  },
                  {
                    icon: Headphones,
                    title: "Expert Guidance",
                    desc: "Direct access to debt counselors for complex cases and legal inquiries.",
                  },
                ].map((ft, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <ft.icon
                      className="w-5 h-5 mb-3"
                      strokeWidth={2.5}
                      style={{ color: "rgb(0, 70, 255)" }}
                    />
                    <h4 className="text-[#111111] font-bold text-[14px] mb-2">
                      {ft.title}
                    </h4>
                    <p className="text-gray-600 text-[12px] leading-relaxed font-medium">
                      {ft.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Analysis Preview */}
            <div
              className="rounded-[2.5rem] p-8 lg:p-12 overflow-hidden relative backdrop-blur-2xl flex flex-col justify-between aspect-square lg:aspect-auto min-h-[500px] group transition-all duration-500"
              style={{ backgroundColor: "rgba(0, 70, 255, 0.04)" }}
            >
              {/* Clean style overlay handled natively without black shade */}

              <div className="relative z-10 w-full">
                <h3 className="text-[#111111] text-[32px] md:text-[38px] font-medium tracking-tight leading-tight mb-6 max-w-[380px]">
                  Detailed Analysis of Your Financial Health
                </h3>
                <p className="text-gray-600 text-[16px] leading-relaxed mb-8 max-w-[480px] font-medium">
                  Our AI analyzes over 50 data points from your credit history
                  to generate a comprehensive 12-page report. Know your
                  Debt-to-Income ratio, interest leakage, and potential savings
                  in under 2 minutes.
                </p>

                <ul className="text-gray-700 space-y-3 font-medium text-[15px]">
                  {[
                    "Interest Leakage Identification",
                    "Pre-payment Impact Analysis",
                    "Lender Negotiation Tips",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div
                        className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(0, 70, 255, 0.1)" }}
                      >
                        <Check
                          className="w-3 h-3"
                          strokeWidth={3}
                          style={{ color: "rgb(0, 70, 255)" }}
                        />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mock UI section */}
              <div className="relative z-10 mt-16 flex items-center justify-center h-[280px]">
                {/* Background UI Card */}
                <div className="absolute left-[5%] bottom-0 w-[280px] h-[180px] bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/40 shadow-lg transform translate-y-8 opacity-80 z-10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium text-sm">
                      Overview
                    </span>
                    <span className="text-gray-400 text-xs">This month</span>
                  </div>
                  <h4 className="text-[#111111] text-3xl font-medium tracking-tighter opacity-40 mb-6">
                    ₹3,20,000
                  </h4>
                  <div
                    className="w-[120px] h-4 rounded-full opacity-40"
                    style={{ backgroundColor: "rgba(0, 70, 255, 0.4)" }}
                  />
                </div>

                {/* Foreground UI Card 1 */}
                <div className="absolute right-[15%] bottom-[8%] w-[320px] h-[180px] bg-white rounded-[20px] p-5 shadow-2xl z-20 border border-gray-100 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#111111] font-bold text-[15px]">
                      Overview
                    </span>
                    <span className="text-gray-500 text-[11px] font-medium px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1">
                      This month{" "}
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "rgb(0, 70, 255)" }}
                      ></span>
                    </span>
                  </div>
                  <div className="flex justify-between items-end mb-6">
                    <h4 className="text-[#111111] text-[34px] font-medium tracking-tighter leading-none">
                      ₹3,20,000
                    </h4>
                    <span className="text-gray-500 text-[13px] font-medium pb-1">
                      From ₹13,00,000
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center gap-3">
                      <div className="h-2.5 flex-1 rounded-full relative overflow-hidden bg-gray-100">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full"
                          style={{
                            width: "65%",
                            backgroundColor: "rgb(0, 70, 255)",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 w-12 text-right">
                        Personal
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <div className="h-2.5 flex-1 rounded-full relative overflow-hidden bg-gray-100">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-gray-300"
                          style={{ width: "25%" }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 w-12 text-right">
                        Others
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Goal Tag */}
                <div className="absolute top-8 right-[20%] bg-white rounded-[16px] p-3 shadow-xl z-30 flex flex-col border border-gray-100 w-[180px] transform rotate-3 group-hover:rotate-1 transition-transform duration-500">
                  <span className="text-gray-500 text-[11px] font-medium mb-1.5">
                    Debt Tracking
                  </span>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center p-0.5"
                      style={{ backgroundColor: "rgba(0, 70, 255, 0.1)" }}
                    >
                      <CreditCard
                        className="w-3 h-3"
                        style={{ color: "rgb(0, 70, 255)" }}
                      />
                    </div>
                    <span className="text-[#111111] text-[13px] font-bold">
                      Personal Loan
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-[#111111]">
                      ₹7,000
                      <span className="text-gray-400 font-medium">
                        /₹80,000
                      </span>
                    </span>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "rgb(0, 70, 255)" }}
                    >
                      80%
                    </span>
                  </div>
                </div>
              </div>

              {/* Mock UI section (Multi-account Nodes) */}
              <div className="relative z-10 mt-16 lg:mt-24 h-[180px] w-full flex items-center justify-center">
                {/* Node Graph Base structure */}
                <div className="w-[85%] h-full relative">
                  {/* Connecting lines SVG */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ overflow: "visible" }}
                  >
                    <path
                      d="M 40,30 C 100,30 80,90 150,90"
                      fill="none"
                      stroke="rgba(0, 70, 255, 0.2)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 40,90 C 100,90 80,90 150,90"
                      fill="none"
                      stroke="rgba(0, 70, 255, 0.2)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 40,150 C 100,150 80,90 150,90"
                      fill="none"
                      stroke="rgba(0, 70, 255, 0.2)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 170,90 C 190,90 220,50 250,50"
                      fill="none"
                      stroke="rgba(0, 70, 255, 0.2)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 170,90 C 190,90 220,130 250,130"
                      fill="none"
                      stroke="rgba(0, 70, 255, 0.2)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  </svg>

                  {/* Far Left Nodes */}
                  <div className="absolute top-[20px] left-[20px] w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <Building
                      className="w-5 h-5"
                      style={{ color: "rgb(0, 70, 255)" }}
                    />
                  </div>
                  <div className="absolute top-[80px] left-[20px] w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute top-[140px] left-[20px] w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <Home className="w-5 h-5 text-slate-800" />
                  </div>

                  {/* Center Hub Node */}
                  <div
                    className="absolute top-[70px] left-[130px] w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl z-20 transform group-hover:scale-110 transition-transform duration-500 border-[3px] border-transparent"
                    style={{ borderColor: "rgba(0, 70, 255, 0.2)" }}
                  >
                    <span
                      className="font-bold text-[26px] tracking-tighter"
                      style={{ color: "rgb(0, 70, 255)" }}
                    >
                      D
                    </span>
                  </div>

                  {/* Far Right Nodes */}
                  <div className="absolute top-[40px] left-[240px] w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute top-[120px] left-[240px] w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>

                  {/* Floating Notification Box */}
                  <div className="absolute -top-[10px] left-[70px] w-[200px] bg-white rounded-xl shadow-2xl p-3 z-30 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: "rgba(0, 70, 255, 0.1)" }}
                        >
                          <Building
                            className="w-3 h-3"
                            style={{ color: "rgb(0, 70, 255)" }}
                          />
                        </div>
                        <span className="text-[13px] font-bold text-[#111111]">
                          HDFC Bank
                        </span>
                      </div>
                      <span className="text-[13px] font-bold text-red-500">
                        -₹3,450.40
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center bg-black">
                          <CreditCard className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[13px] font-bold text-[#111111]">
                          Axis Card
                        </span>
                      </div>
                      <span className="text-[13px] font-bold text-red-500">
                        -₹1,120.20
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
