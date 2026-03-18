"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="absolute top-4 left-4 right-4 lg:top-6 lg:left-6 lg:right-6 z-50 pointer-events-none px-4 lg:px-12 py-5 lg:py-6 flex justify-between items-start">
      {/* Left Logo */}
      <Link href="/" className="pointer-events-auto flex items-center gap-2 mt-1">
        <span className="text-white text-[24px] md:text-[28px] font-bold tracking-[-0.05em] leading-none select-none">
          // Debto
        </span>
      </Link>

      {/* Right Side Stack */}
      <div className="pointer-events-auto flex flex-col items-end gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className={`${scrolled ? "hidden" : "hidden md:flex"} bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-medium py-2 px-5 rounded-full items-center gap-2 hover:bg-[#0046FF] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.1)]`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Login
          </Link>
          
          {/* Mobile/Floating menu toggle */}
          <button
            className={`${scrolled ? "fixed top-4 right-4 lg:top-6 lg:right-6 z-[60] flex" : "relative flex md:hidden"} text-white bg-white/20 p-2.5 rounded-full backdrop-blur-xl border border-white/10 hover:bg-white/30 transition-all focus:outline-none items-center justify-center w-[44px] h-[44px] shadow-lg`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
        
        <nav className={`${scrolled ? "hidden" : "hidden md:flex"} flex-col items-end gap-3 mt-4`}>
          <a href="#features" className="text-white/80 hover:text-white text-[15px] font-medium transition-colors">Features</a>
          <a href="#how-it-works" className="text-white/80 hover:text-white text-[15px] font-medium transition-colors">How It Works</a>
          <a href="#faq" className="text-white/80 hover:text-white text-[15px] font-medium transition-colors">FAQ</a>
        </nav>
      </div>

      {/* Mobile/Floating menu dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={`pointer-events-auto ${scrolled ? "fixed top-[70px] right-4 lg:top-[90px] lg:right-6" : "absolute top-[80px] right-4"} w-52 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl z-50 ${scrolled ? "flex" : "md:hidden"}`}
        >
          <a
            href="#features"
            className="text-white font-medium text-[15px] hover:text-[#0046FF] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-white font-medium text-[15px] hover:text-[#0046FF] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="text-white font-medium text-[15px] hover:text-[#0046FF] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </a>
          <div className="h-px w-full bg-white/10 my-1" />
          <Link
            href="/auth/login"
            className="text-white font-medium text-[15px] hover:text-[#0046FF] transition-colors flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Login
          </Link>
        </motion.div>
      )}
    </header>
  );
}
