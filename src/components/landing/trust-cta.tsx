import React from "react";
import Image from "next/image";
import { ArrowUpRight, Phone } from "lucide-react";

export default function TrustCta() {
  return (
    <section className="py-24 bg-white overflow-hidden font-sans">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Left Card */}
          <div className=" rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden min-h-[550px] lg:min-h-[640px]" style={{ backgroundColor: "rgba(0, 70, 255, 0.04)" }}>
            {/* Top Section */}
            <div className="z-10 relative">
              <h2 className="text-[36px] sm:text-[42px] lg:text-[48px] font-medium tracking-tight text-[#111111] leading-[1.1] mb-8 max-w-[400px]">
                Users trust us to manage their finances.
              </h2>
              <button
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-sm font-bold shadow-sm hover:shadow-md transition-all group"
                style={{ color: "rgb(0, 70, 255)" }}
              >
                <ArrowUpRight className="w-[18px] h-[18px] mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                <span className="text-[#111111]">More Stories</span>
              </button>
            </div>

            {/* Bottom Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 z-10 relative items-end">
              {/* Left text portion */}
              <div className="flex flex-col justify-end">

                <p className="text-[#111111] text-[14px] leading-[1.8] mb-8 font-medium tracking-tight max-w-[260px]">
                  "I never imagined I’d be debt-free so soon. Debto helped me reduce my interest and clear my loans faster. With the savings, I finally took the beach holiday I had been dreaming about for years. The freedom feels amazing."
                </p>

                <div className="flex items-center">

                  <div>
                    <h4 className="font-bold text-[15px] text-[#111111] leading-tight mb-0.5">Priya Sharma</h4>
                  </div>
                </div>
              </div>

              {/* Right image portion */}
              <div className="relative w-full aspect-[4/5] sm:aspect-auto sm:h-[320px] rounded-[2rem] overflow-hidden shadow-sm">
                <Image
                  src="/images/platform/travel_woman_luggage.png"
                  alt="Traveler with luggage"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 320px"
                />
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative rounded-[2.5rem] overflow-hidden min-h-[550px] lg:min-h-[640px] flex flex-col justify-end p-8 sm:p-12 group">
            <Image
              src="/images/platform/woman_phone_sunlight.png"
              alt="Experience the future"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="relative z-10 w-full max-w-[420px]">
              <h2 className="text-[40px] sm:text-[40px] lg:text-[40px] font-medium tracking-tight text-white leading-[1.05] mb-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                Get ready to experience the freedom of living without debt.
              </h2>

              <button
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
                style={{ backgroundColor: "rgb(0, 70, 255)" }}
              >
                <Phone className="w-[18px] h-[18px] mr-2" strokeWidth={2.5} />
                Contact Us
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
