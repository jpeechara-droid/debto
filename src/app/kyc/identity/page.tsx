"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Stepper from "@/components/kyc/stepper";

const kycSteps = [
  { label: "Identity" },
  { label: "Consent" },
  { label: "Report" },
];

export default function KycIdentityPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [panVerifying, setPanVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePan = async (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleaned.length > 10) return;
    setPan(cleaned);
    setPanVerified(false);

    if (cleaned.length === 10) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (panRegex.test(cleaned)) {
        setPanVerifying(true);
        try {
          const res = await fetch("/api/kyc/verify-pan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ panNumber: cleaned }),
          });
          const data = await res.json();
          if (data.verified) {
            setPanVerified(true);
            if (!fullName && data.name) {
              setFullName(data.name);
            }
          } else {
            setErrors((prev) => ({ ...prev, pan: "PAN verification failed" }));
          }
        } catch {
          setErrors((prev) => ({ ...prev, pan: "Could not verify PAN" }));
        } finally {
          setPanVerifying(false);
        }
      }
    }
  };

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 12) return;
    // Format as XXXX XXXX XXXX
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setAadhaar(formatted);
  };

  const handleContinue = async () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (pan.length !== 10) newErrors.pan = "Enter valid 10-character PAN";
    if (!dob) newErrors.dob = "Date of birth is required";
    if (aadhaar.replace(/\s/g, "").length !== 12)
      newErrors.aadhaar = "Enter valid 12-digit Aadhaar number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/kyc/submit-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          panNumber: pan,
          dateOfBirth: dob,
          aadhaarNumber: aadhaar,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || "Failed to save details" });
        return;
      }
      router.push("/kyc/consent");
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Back link */}
      <div className="max-w-[800px] mx-auto px-6 pt-8">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back
          </span>
          Back to dashboard
        </Link>
      </div>

      <motion.div
        className="max-w-[700px] mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12">
          {/* Stepper */}
          <Stepper currentStep={0} steps={kycSteps} />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Verify Your Identity
            </h1>
            <p className="text-slate-500">
              We need your PAN and Aadhaar to fetch your CIBIL credit report.
            </p>
          </div>

          {/* Security notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary-blue fill-1 mt-0.5">
              shield
            </span>
            <p className="text-sm text-slate-700">
              Your data is safe with us. We use bank-grade 256-bit encryption to
              keep your personal information secure.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6">
            {/* Full Name */}
            <Input
              label="FULL NAME"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              error={errors.fullName}
              rightAddon={
                fullName && (
                  <span className="material-symbols-outlined text-slate-400 text-sm">
                    lock
                  </span>
                )
              }
            />

            {/* PAN */}
            <Input
              label="PAN CARD NUMBER *"
              placeholder="ABCDE1234F"
              value={pan}
              onChange={(e) => {
                validatePan(e.target.value);
                setErrors((prev) => ({ ...prev, pan: "" }));
              }}
              error={errors.pan}
              className="uppercase tracking-wider"
              rightAddon={
                panVerifying ? (
                  <div className="h-5 w-5 border-2 border-cta-saffron border-t-transparent rounded-full animate-spin" />
                ) : panVerified ? (
                  <span className="material-symbols-outlined text-success fill-1">
                    check_circle
                  </span>
                ) : null
              }
            />

            {/* DOB */}
            <Input
              label="DATE OF BIRTH *"
              placeholder="DD/MM/YYYY"
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setErrors((prev) => ({ ...prev, dob: "" }));
              }}
              error={errors.dob}
            />

            {/* Aadhaar */}
            <div className="relative">
              <Input
                label="AADHAAR NUMBER *"
                placeholder="XXXX XXXX XXXX"
                value={showAadhaar ? aadhaar : aadhaar.replace(/\d/g, "•").replace(/(•{4}) ?(•{4}) ?(•*)/, "$1 $2 $3")}
                onChange={(e) => {
                  if (showAadhaar) {
                    formatAadhaar(e.target.value);
                    setErrors((prev) => ({ ...prev, aadhaar: "" }));
                  }
                }}
                onFocus={() => setShowAadhaar(true)}
                error={errors.aadhaar}
                type="text"
                inputMode="numeric"
                rightAddon={
                  <button
                    type="button"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                    className="text-slate-400 hover:text-primary cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showAadhaar ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                }
              />
            </div>

            {/* Continue button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleContinue}
              icon={
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              }
            >
              Continue to Consent
            </Button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 mt-8 text-slate-400">
          {[
            { icon: "shield", label: "256-bit encrypted" },
            { icon: "cloud_done", label: "Data stored in India" },
            { icon: "verified_user", label: "RBI compliant" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">
                {badge.icon}
              </span>
              <span className="text-xs font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
