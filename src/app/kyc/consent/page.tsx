"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/kyc/stepper";

const kycSteps = [
  { label: "Identity" },
  { label: "Consent" },
  { label: "Report" },
];

export default function KycConsentPage() {
  const router = useRouter();
  const [mandatoryConsent, setMandatoryConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleProceed = async () => {
    if (!mandatoryConsent) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/kyc/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentGiven: true, marketingConsent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to record consent");
        return;
      }
      router.push("/kyc/fetching");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[800px] mx-auto px-6 pt-8">
        <Link
          href="/kyc/identity"
          className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back
          </span>
          Back to Identity
        </Link>
      </div>

      <motion.div
        className="max-w-[700px] mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12">
          <Stepper currentStep={1} steps={kycSteps} />

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Credit Bureau Consent
            </h1>
            <p className="text-slate-500">
              We need your consent to fetch your CIBIL credit report.
            </p>
          </div>

          {/* Consent text box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 max-h-60 overflow-y-auto">
            <h3 className="font-bold text-primary text-sm mb-3">
              AUTHORIZATION TO ACCESS CREDIT INFORMATION
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed space-y-3">
              <p>
                I hereby authorize Debto Technologies Pvt Ltd (&ldquo;Debto&rdquo;) to access
                my credit information from CIBIL (TransUnion), a licensed credit
                bureau operating in India, for the purpose of:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Retrieving my credit score and detailed credit report
                </li>
                <li>
                  Analyzing my existing loans, credit cards, and payment history
                </li>
                <li>
                  Generating a personalized debt management strategy and
                  financial analysis
                </li>
                <li>
                  Providing recommendations for debt repayment optimization
                </li>
              </ul>
              <p>
                I understand that this is a &ldquo;soft inquiry&rdquo; and will NOT affect my
                credit score. My data will be encrypted using AES-256 encryption
                and stored in compliance with the Digital Personal Data
                Protection (DPDP) Act, 2023.
              </p>
              <p>
                I acknowledge that my credit report data will be retained for a
                maximum of 90 days and I can request deletion at any time
                through the Settings &gt; Data &amp; Privacy section.
              </p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Mandatory consent */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={mandatoryConsent}
                onChange={(e) => setMandatoryConsent(e.target.checked)}
                className="mt-1 size-4 accent-cta-saffron cursor-pointer"
              />
              <span className="text-sm text-slate-700 group-hover:text-primary transition-colors">
                <span className="font-semibold">I agree</span> to the terms
                above and authorize Debto to fetch my credit report from CIBIL.{" "}
                <span className="text-danger text-xs font-bold">
                  (Required)
                </span>
              </span>
            </label>

            {/* Optional consent */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-1 size-4 accent-cta-saffron cursor-pointer"
              />
              <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                I consent to receiving personalized financial tips and product
                updates from Debto via SMS and email. (Optional)
              </span>
            </label>
          </div>

          {/* Proceed */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!mandatoryConsent}
            onClick={handleProceed}
            icon={
              <span className="material-symbols-outlined">arrow_forward</span>
            }
          >
            Fetch My Credit Report
          </Button>

          {/* Info */}
          <p className="text-center text-xs text-slate-400 mt-4">
            This action will perform a soft inquiry that does NOT impact your
            credit score.
          </p>
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
