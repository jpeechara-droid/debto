"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 10) return;
    setPhone(cleaned);
    setError("");
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid Indian mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }
      router.push(`/auth/verify-otp?phone=${phone}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <motion.div
        className="hidden lg:flex w-[45%] bg-primary p-16 flex-col justify-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-12">
          <div className="size-8 bg-white/10 rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-cta-saffron">
              account_balance_wallet
            </span>
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight">
            Debto
          </h2>
        </div>

        <h1 className="text-white text-[36px] font-extrabold leading-tight mb-8">
          Welcome back to your debt-free journey
        </h1>

        <p className="text-slate-300 text-lg leading-relaxed max-w-md">
          Log in to view your personalized debt analysis, track your progress,
          and access your financial tools.
        </p>

        {/* Decorative */}
        <div className="absolute -bottom-32 -left-32 size-64 border border-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 size-48 border border-white/5 rounded-full" />
      </motion.div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-2">
            Log In
          </h2>
          <p className="text-slate-500 mb-8">
            Enter your registered mobile number to continue.
          </p>

          {/* Google OAuth */}
          <button className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-700 mb-6 cursor-pointer">
            <svg className="size-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-sm text-slate-400 font-medium">OR</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <div className="mb-6">
            <Input
              label="Phone Number"
              leftAddon="+91"
              placeholder="00000 00000"
              value={phone}
              onChange={(e) => validatePhone(e.target.value)}
              error={error}
              type="tel"
              maxLength={10}
              inputMode="numeric"
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-bold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
