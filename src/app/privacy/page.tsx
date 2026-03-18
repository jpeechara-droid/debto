import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Debto",
  description: "How Debto collects, uses, and protects your personal and financial data in compliance with DPDP Act 2023.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1B2A4A] text-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors">
            <span className="material-symbols-rounded text-lg">arrow_back</span>
            Back to Debto
          </Link>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-white/60 mt-2">Last updated: March 12, 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray prose-lg">
        <h2>1. Information We Collect</h2>
        <p>Debto collects the following information to provide our debt management services:</p>
        <ul>
          <li><strong>Identity Information:</strong> Full name, PAN number, date of birth, Aadhaar number (stored as one-way hash only)</li>
          <li><strong>Contact Information:</strong> Phone number, email address</li>
          <li><strong>Financial Information:</strong> CIBIL credit report (fetched with your explicit consent), loan details, credit card information</li>
          <li><strong>Usage Data:</strong> Pages visited, features used, session duration</li>
          <li><strong>Device Information:</strong> Browser type, IP address, operating system</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>Fetching your CIBIL credit report via our authorized partner Decentro</li>
          <li>Generating personalized AI-powered debt analysis and repayment strategies</li>
          <li>Providing calculator tools for extra payments and balance transfers</li>
          <li>Facilitating expert consultation bookings</li>
          <li>Sending important notifications about your debt progress</li>
          <li>Improving our services through anonymized analytics</li>
        </ul>

        <h2>3. Data Security (DPDP Act 2023 Compliance)</h2>
        <p>We implement industry-leading security measures:</p>
        <ul>
          <li><strong>AES-256-GCM Encryption:</strong> All PAN numbers are encrypted at rest using AES-256-GCM</li>
          <li><strong>Aadhaar Hash:</strong> We never store raw Aadhaar numbers. Only a SHA-256 hash is stored for matching purposes</li>
          <li><strong>Data Residency:</strong> All data is stored in Indian data centers (AWS Mumbai region)</li>
          <li><strong>Auto-Expiry:</strong> Credit report data is automatically deleted after 90 days</li>
          <li><strong>Secure Transmission:</strong> All data in transit is encrypted using TLS 1.3</li>
        </ul>

        <h2>4. Consent</h2>
        <p>We obtain explicit consent before:</p>
        <ul>
          <li>Fetching your CIBIL credit report (mandatory consent with audit trail)</li>
          <li>Processing your PAN and Aadhaar for KYC verification</li>
          <li>Sending promotional communications (optional consent)</li>
        </ul>
        <p>Each consent record includes timestamp, IP address, user agent, and consent version for audit purposes.</p>

        <h2>5. Data Sharing</h2>
        <p>We share data only with:</p>
        <ul>
          <li><strong>Decentro:</strong> For PAN verification and CIBIL report fetching (as authorized by you)</li>
          <li><strong>Razorpay:</strong> For processing consultation payments</li>
          <li><strong>Anthropic:</strong> Anonymized financial metrics (no PII) for AI analysis generation</li>
        </ul>
        <p>We never sell your personal data to third parties.</p>

        <h2>6. Your Rights</h2>
        <p>Under the Digital Personal Data Protection Act 2023, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Download all your data from Settings → Data & Privacy</li>
          <li><strong>Correction:</strong> Update your profile information at any time</li>
          <li><strong>Erasure:</strong> Delete your account and all associated data</li>
          <li><strong>Consent Withdrawal:</strong> Revoke CIBIL consent from Settings → Data & Privacy</li>
          <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
        </ul>

        <h2>7. Cookies</h2>
        <p>We use essential cookies for session management (httpOnly, secure). We do not use tracking cookies or third-party advertising cookies.</p>

        <h2>8. Contact Us</h2>
        <p>For privacy-related queries, contact our Data Protection Officer:</p>
        <ul>
          <li>Email: <a href="mailto:privacy@debto.in">privacy@debto.in</a></li>
          <li>Address: Mumbai, Maharashtra, India</li>
        </ul>

        <h2>9. Changes</h2>
        <p>We may update this policy periodically. Material changes will be communicated via email or in-app notification.</p>
      </main>

      {/* Footer Links */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-3xl mx-auto px-6 flex gap-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-[#1B2A4A] transition-colors">Terms of Service</Link>
          <Link href="/cookie-policy" className="hover:text-[#1B2A4A] transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-[#1B2A4A] transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
}
