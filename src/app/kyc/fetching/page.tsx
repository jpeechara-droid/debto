"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Stepper from "@/components/kyc/stepper";

const kycSteps = [
  { label: "Identity" },
  { label: "Consent" },
  { label: "Report" },
];

const fetchSteps = [
  {
    label: "Verifying PAN card...",
    done: "PAN verified successfully",
    icon: "badge",
  },
  {
    label: "Validating Aadhaar...",
    done: "Aadhaar validated",
    icon: "fingerprint",
  },
  {
    label: "Fetching CIBIL report...",
    done: "Credit report fetched",
    icon: "description",
  },
  {
    label: "Generating AI analysis...",
    done: "AI analysis complete",
    icon: "psychology",
  },
];

type FetchState = "loading" | "success" | "error";

export default function KycFetchingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<FetchState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (state !== "loading") return;

    let cancelled = false;

    async function fetchReport() {
      // Step 1: PAN verified (already done in identity step)
      await new Promise((r) => setTimeout(r, 800));
      if (cancelled) return;
      setCurrentStep(1);

      // Step 2: Aadhaar validated (stored in DB)
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;
      setCurrentStep(2);

      // Step 3: Fetch CIBIL report via API
      try {
        const res = await fetch("/api/cibil/fetch-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setErrorMessage(data.error || "Failed to fetch credit report");
          setState("error");
          return;
        }

        setCurrentStep(3);

        // Step 4: AI analysis (brief pause for UX)
        await new Promise((r) => setTimeout(r, 1000));
        if (cancelled) return;
        setCurrentStep(4);

        await new Promise((r) => setTimeout(r, 500));
        if (cancelled) return;
        setState("success");
      } catch {
        if (cancelled) return;
        setErrorMessage("Network error. Please check your connection and try again.");
        setState("error");
      }
    }

    fetchReport();
    return () => { cancelled = true; };
  }, [state]);

  // Auto-redirect after success
  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  const handleRetry = () => {
    setCurrentStep(0);
    setState("loading");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center">
      <motion.div
        className="max-w-[700px] w-full mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12">
          <Stepper currentStep={2} steps={kycSteps} />

          <AnimatePresence mode="wait">
            {/* Loading state */}
            {state === "loading" && (
              <motion.div
                key="loading"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  Fetching Your Credit Report
                </h1>
                <p className="text-slate-500 mb-10">
                  Please wait while we securely retrieve your data...
                </p>

                {/* Progress steps */}
                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                  {fetchSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0.3 }}
                      animate={{
                        opacity: i < currentStep ? 1 : i === currentStep ? 0.7 : 0.3,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`size-10 rounded-full flex items-center justify-center transition-all ${
                          i < currentStep
                            ? "bg-success text-white"
                            : i === currentStep
                            ? "bg-cta-saffron text-white animate-pulse"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {i < currentStep ? (
                          <span className="material-symbols-outlined text-sm">
                            check
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-sm">
                            {step.icon}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          i < currentStep
                            ? "text-success"
                            : i === currentStep
                            ? "text-primary"
                            : "text-slate-400"
                        }`}
                      >
                        {i < currentStep ? step.done : step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Spinner */}
                <div className="mt-10">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cta-saffron to-secondary-blue rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${(currentStep / fetchSteps.length) * 100}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success state */}
            {state === "success" && (
              <motion.div
                key="success"
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="size-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.2,
                  }}
                >
                  <span className="material-symbols-outlined text-success text-4xl fill-1">
                    check_circle
                  </span>
                </motion.div>

                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  Report Fetched Successfully!
                </h1>
                <p className="text-slate-500 mb-4">
                  Your CIBIL credit report and AI analysis are ready.
                </p>
                <p className="text-sm text-slate-400">
                  Redirecting to your dashboard...
                </p>

                {/* Loading dots */}
                <div className="flex justify-center gap-1 mt-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="size-2 bg-cta-saffron rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Error state */}
            {state === "error" && (
              <motion.div
                key="error"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="size-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-danger text-4xl">
                    error
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-primary mb-2">
                  Unable to Fetch Report
                </h1>
                <p className="text-slate-500 mb-6">
                  {errorMessage ||
                    "Something went wrong while fetching your credit report. Please try again."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRetry}
                    className="bg-cta-saffron hover:bg-cta-saffron-hover text-white font-bold py-3 px-8 rounded-lg transition-all cursor-pointer"
                  >
                    Try Again
                  </button>
                  <a
                    href="mailto:support@debto.in"
                    className="border border-slate-200 text-primary font-bold py-3 px-8 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    Contact Support
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
