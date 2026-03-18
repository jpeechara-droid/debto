import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Debto",
  description: "How Debto uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1B2A4A] text-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors">
            <span className="material-symbols-rounded text-lg">arrow_back</span>
            Back to Debto
          </Link>
          <h1 className="text-4xl font-bold">Cookie Policy</h1>
          <p className="text-white/60 mt-2">Last updated: March 12, 2026</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray prose-lg">
        <h2>1. What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and provide a better experience.</p>

        <h2>2. Cookies We Use</h2>
        <p>Debto uses a minimal set of cookies:</p>

        <table>
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Purpose</th>
              <th>Type</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>debto_session</code></td>
              <td>Authentication session token (JWT)</td>
              <td>Essential</td>
              <td>30 days</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Cookie Details</h2>
        <h3>Essential Cookies (Required)</h3>
        <p>Our session cookie (<code>debto_session</code>) is:</p>
        <ul>
          <li><strong>httpOnly:</strong> Cannot be accessed by JavaScript</li>
          <li><strong>Secure:</strong> Only sent over HTTPS in production</li>
          <li><strong>SameSite: Lax:</strong> Protected against CSRF attacks</li>
          <li><strong>Contains:</strong> User ID, phone number, name, KYC status (no sensitive data)</li>
        </ul>

        <h3>No Tracking Cookies</h3>
        <p>Debto does <strong>not</strong> use:</p>
        <ul>
          <li>Third-party advertising cookies</li>
          <li>Social media tracking pixels</li>
          <li>Cross-site tracking cookies</li>
          <li>Analytics cookies that identify individual users</li>
        </ul>

        <h2>4. Managing Cookies</h2>
        <p>Since we only use one essential cookie for authentication, disabling it will prevent you from logging into the platform. You can clear this cookie by:</p>
        <ul>
          <li>Clicking &quot;Logout&quot; in the dashboard sidebar</li>
          <li>Clearing cookies in your browser settings</li>
          <li>Using your browser&apos;s private/incognito mode</li>
        </ul>

        <h2>5. Local Storage</h2>
        <p>We may use browser localStorage for non-sensitive UI preferences (e.g., sidebar state, last active tab). This data never leaves your device and can be cleared through your browser settings.</p>

        <h2>6. Contact</h2>
        <p>Questions about our cookie practices: <a href="mailto:privacy@debto.in">privacy@debto.in</a></p>
      </main>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-3xl mx-auto px-6 flex gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-[#1B2A4A] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#1B2A4A] transition-colors">Terms of Service</Link>
          <Link href="/" className="hover:text-[#1B2A4A] transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
}
