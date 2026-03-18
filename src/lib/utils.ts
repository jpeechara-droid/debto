import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatLakh(amount: number): string {
  const lakhs = amount / 100000;
  if (lakhs >= 1) {
    return `₹${lakhs.toFixed(1)}L`;
  }
  return formatCurrency(amount);
}
