import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftAddon,
  rightAddon,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative flex">
        {leftAddon && (
          <div className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg text-sm font-medium text-slate-500">
            {leftAddon}
          </div>
        )}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full px-4 py-3 border border-slate-200 text-sm transition-all duration-200",
            "placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-secondary-blue/20 focus:border-secondary-blue",
            "disabled:bg-slate-50 disabled:text-slate-400",
            leftAddon ? "rounded-r-lg" : rightAddon ? "rounded-l-lg" : "rounded-lg",
            icon && "pl-10",
            error && "border-danger focus:ring-danger/20 focus:border-danger",
            className
          )}
          {...props}
        />
        {rightAddon && (
          <div className="flex items-center px-3 bg-slate-50 border border-l-0 border-slate-200 rounded-r-lg">
            {rightAddon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-danger font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
