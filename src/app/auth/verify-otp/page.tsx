"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function OtpVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }
      // Route based on KYC status
      if (data.user?.kycComplete) {
        router.push("/dashboard");
      } else {
        router.push("/kyc/identity");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(30);
    setOtp(Array(6).fill(""));
    setError("");
    inputRefs.current[0]?.focus();
    // Resend OTP
    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
    } catch {
      setError("Failed to resend OTP");
    }
  };

  const maskedPhone = phone
    ? `+91 ${phone.slice(0, 2)}*** ***${phone.slice(-2)}`
    : "+91 *****";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light p-6">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="size-8 bg-primary rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-cta-saffron text-lg">
                account_balance_wallet
              </span>
            </div>
            <span className="text-primary text-xl font-bold">Debto</span>
          </Link>
          <h2 className="text-2xl font-bold text-primary mb-2">
            Verify Your Number
          </h2>
          <p className="text-slate-500 text-sm">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-primary">{maskedPhone}</span>
          </p>
        </div>

        {/* OTP Input boxes */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 outline-none ${
                digit
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:border-slate-300"
              } ${
                error ? "border-danger" : ""
              } focus:border-secondary-blue focus:ring-2 focus:ring-secondary-blue/20`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <motion.p
            className="text-danger text-sm text-center mb-4 flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </motion.p>
        )}

        {/* Verify Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={handleVerify}
          className="mb-4"
        >
          Verify OTP
        </Button>

        {/* Resend */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-secondary-blue font-semibold text-sm hover:underline cursor-pointer"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-slate-400 text-sm">
              Resend code in{" "}
              <span className="text-primary font-semibold">
                {countdown}s
              </span>
            </p>
          )}
        </div>

        {/* Back */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/auth/signup"
            className="text-sm text-slate-500 hover:text-primary transition-colors"
          >
            ← Change phone number
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-light">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <OtpVerificationContent />
    </Suspense>
  );
}
