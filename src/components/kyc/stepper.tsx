"use client";

import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: { label: string; icon?: string }[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-10">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center relative flex-1">
          {/* Connector line */}
          {i > 0 && (
            <div
              className={cn(
                "absolute top-5 -left-1/2 w-full h-0.5",
                i <= currentStep ? "bg-cta-saffron" : "bg-slate-200"
              )}
            />
          )}

          {/* Step circle */}
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center text-sm font-bold relative z-10 transition-all",
              i < currentStep
                ? "bg-cta-saffron text-white"
                : i === currentStep
                ? "bg-cta-saffron text-white shadow-lg shadow-cta-saffron/30"
                : "bg-slate-100 text-slate-400 border border-slate-200"
            )}
          >
            {i < currentStep ? (
              <span className="material-symbols-outlined text-sm">check</span>
            ) : (
              i + 1
            )}
          </div>

          {/* Label */}
          <span
            className={cn(
              "text-xs font-semibold mt-2",
              i <= currentStep ? "text-primary" : "text-slate-400"
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
