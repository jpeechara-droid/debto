import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Debto — AI-Powered Debt Management for India",
  description:
    "India's first AI-powered debt management platform. Fetch your CIBIL report, get personalized debt analysis, and build a roadmap to become debt-free faster.",
  keywords: [
    "debt management",
    "CIBIL score",
    "debt free",
    "loan repayment",
    "AI financial analysis",
    "India",
    "EMI calculator",
    "credit report",
  ],
  openGraph: {
    title: "Debto — Reclaim Your Financial Future",
    description:
      "Free AI-powered debt analysis. Fetch your CIBIL report and get a personalized roadmap to zero debt.",
    siteName: "Debto",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
