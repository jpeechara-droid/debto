import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Wallet, TrendingUp, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-12 lg:py-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">

        {/* Main Footer Body */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-20 mb-20">

          {/* Left Column */}
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              {/* Header Title with inline circles */}
              <h2 className="text-[36px] sm:text-[3ß4px] md:text-[46px] leading-[1.05] font-medium tracking-tight text-[#111111] mb-12 lg:mb-20 max-w-[800px] flex flex-wrap items-center">
                <span>Transforming </span>
                <div className="inline-flex items-center mx-2 sm:mx-3 py-1">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full z-10 flex items-center justify-center border-2 border-white shadow-sm -mr-3 transition-transform hover:z-40 hover:scale-110" style={{ backgroundColor: 'rgba(0, 70, 255, 0.1)' }}>
                    <Wallet className="w-5 h-5" style={{ color: 'rgb(0, 70, 255)' }} />
                  </div>
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-100 z-20 flex items-center justify-center border-2 border-white shadow-sm -mr-3 transition-transform hover:z-40 hover:scale-110">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black z-30 flex items-center justify-center border-2 border-white shadow-sm transition-transform hover:z-40 hover:scale-110">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span> Debt Management with innovative, data-driven solutions</span>
              </h2>

              {/* Links Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-bold text-gray-500 mb-6 tracking-wide">Product</h4>
                  <ul className="flex flex-col gap-4 font-semibold text-[#444444] text-[15px]">
                    <li><Link href="/auth/signup" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Debt Analysis</Link></li>
                    <li><Link href="/auth/signup" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Credit Monitoring</Link></li>
                    <li><Link href="/auth/signup" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Savings Calculator</Link></li>
                    <li><Link href="/auth/signup" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Expert Help</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-500 mb-6 tracking-wide">Company</h4>
                  <ul className="flex flex-col gap-4 font-semibold text-[#444444] text-[15px]">
                    <li><Link href="#" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">About Us</Link></li>
                    <li><Link href="#" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Careers</Link></li>
                    <li><Link href="#" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Press</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-500 mb-6 tracking-wide">Support</h4>
                  <ul className="flex flex-col gap-4 font-semibold text-[#444444] text-[15px]">
                    <li><Link href="#" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Help Center</Link></li>
                    <li><Link href="#" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Contact Support</Link></li>
                    <li><Link href="#" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">RBI Fair Practices</Link></li>
                    <li><Link href="#" className="hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all">Grievance Redressal</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column / Card */}
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-100 flex-shrink-0 w-full lg:w-[480px] h-[360px] lg:h-[420px] flex flex-col justify-end p-8 mt-12 lg:mt-0 group">
            <Image
              src="/images/platform/abstract_wave_footer_blue.png"
              alt="Future of finance"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 480px"
            />

            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            <div className="relative z-10 flex items-end justify-between w-full mt-auto">
              <h3 className="text-white text-2xl lg:text-[28px] font-medium tracking-tight max-w-[220px] leading-[1.25]">
                Explore the feeling of being debt free
              </h3>
              <button
                className="h-[52px] w-[52px] rounded-full flex items-center justify-center text-white flex-shrink-0 hover:scale-105 transition-transform shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                style={{ backgroundColor: "rgb(0, 70, 255)" }}
              >
                <ArrowUpRight className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar Container */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-4 w-full">

          {/* Left Side Pill Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="#"
              className="bg-[#f0f2f5] hover:bg-[#e4e6e9] text-[#111111] text-[13px] font-semibold py-[10px] px-5 rounded-full transition-colors flex items-center"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="bg-[#f0f2f5] hover:bg-[#e4e6e9] text-[#111111] text-[13px] font-semibold py-[10px] px-5 rounded-full transition-colors flex items-center"
            >
              Terms & Conditions
            </Link>

            {/* Added RBI compliance badge from original footer as a pill */}
            <div
              className="hidden md:flex text-[12px] font-bold py-[10px] px-5 rounded-full items-center gap-1.5 ml-2 border"
              style={{ backgroundColor: 'rgba(0, 70, 255, 0.05)', color: 'rgb(0, 70, 255)', borderColor: 'rgba(0, 70, 255, 0.15)' }}
            >
              <ShieldCheck className="w-[14px] h-[14px]" strokeWidth={2.5} />
              RBI Registered NBFC Partner
            </div>
          </div>

          {/* Right Side Info */}
          <div className="flex flex-row items-center justify-between lg:justify-end gap-x-6 sm:gap-x-12 text-sm text-[#444444] font-medium w-full lg:w-auto">
            <a href="mailto:hello@debto.com" className="hover:text-black transition-colors font-semibold">
              hello@debto.com
            </a>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-lg">©</span>
              <span>2026 Debto all rights reserved</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
