"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface UserProfile {
  id: string;
  fullName: string | null;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  city: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastReportSync: string | null;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    emi_reminders: true,
    score_updates: true,
    promotional: false,
    whatsapp: true,
    email: true,
    sms: false,
  });

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");

  useEffect(() => {
    fetch("/api/settings/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setProfile(d);
          setFormName(d.fullName || "");
          setFormEmail(d.email || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const r = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: formName, email: formEmail }),
      });
      if (!r.ok) throw new Error("Failed to save");
      const updated = await r.json();
      setProfile((prev) => (prev ? { ...prev, ...updated } : prev));
      setSaveMsg("Saved successfully!");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const formatPhone = (phone: string) =>
    `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;

  const formatDob = (dob: string | null) => {
    if (!dob) return "Not set";
    return new Date(dob).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const sections = [
    { id: "profile", label: "Profile", icon: "person" },
    { id: "security", label: "Security", icon: "lock" },
    { id: "notifications", label: "Notifications", icon: "notifications" },
    { id: "data", label: "Data & Privacy", icon: "shield" },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-32 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 h-48" />
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-8 h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Settings
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your account preferences and data
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Nav */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card padding="sm">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeSection === section.id
                      ? "bg-primary/5 text-primary"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {section.icon}
                  </span>
                  {section.label}
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Right Content */}
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="text-lg font-bold text-primary mb-6">
                  Personal Information
                </h3>
                <div className="flex items-center gap-6 mb-8">
                  <div className="size-20 bg-primary rounded-full text-white text-2xl font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-lg">
                      {profile?.fullName || "User"}
                    </p>
                    <p className="text-sm text-slate-400">
                      Customer ID: {profile?.id?.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-cta-saffron/30 focus:border-cta-saffron"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profile?.phone ? formatPhone(profile.phone) : ""}
                      disabled
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-400 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-cta-saffron/30 focus:border-cta-saffron"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="text"
                      value={formatDob(profile?.dateOfBirth || null)}
                      disabled
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-400 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  {saveMsg && (
                    <span
                      className={`text-sm font-medium ${
                        saveMsg.includes("success")
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {saveMsg}
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-lg transition-all text-sm cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </Card>

              {/* Linked Accounts */}
              <Card padding="lg">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Linked Accounts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <span className="text-red-500 font-bold text-sm">
                          G
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-primary">
                          Google Account
                        </p>
                        <p className="text-xs text-slate-400">
                          {profile?.email || "Not connected"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        profile?.email
                          ? "text-success"
                          : "text-slate-400"
                      }`}
                    >
                      {profile?.email ? "Connected" : "Not linked"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary-blue">
                          account_balance
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-primary">
                          CIBIL / Decentro
                        </p>
                        <p className="text-xs text-slate-400">
                          {profile?.lastReportSync
                            ? `Last synced: ${new Date(profile.lastReportSync).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}`
                            : "Not synced yet"}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-cta-saffron cursor-pointer">
                      Re-sync
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="text-lg font-bold text-primary mb-6">
                  Security Settings
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-sm text-primary">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-slate-400">
                        Extra verification via phone OTP
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-sm text-primary">
                        Active Sessions
                      </p>
                      <p className="text-xs text-slate-400">
                        1 device currently logged in
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-danger cursor-pointer">
                      Logout All
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-sm text-primary">
                        Login History
                      </p>
                      <p className="text-xs text-slate-400">
                        View recent login activity
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-cta-saffron cursor-pointer">
                      View Logs
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="text-lg font-bold text-primary mb-6">
                  Notification Preferences
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      key: "emi_reminders",
                      title: "EMI Payment Reminders",
                      desc: "Get reminded 3 days before every EMI due date",
                    },
                    {
                      key: "score_updates",
                      title: "Credit Score Updates",
                      desc: "Monthly CIBIL score change notifications",
                    },
                    {
                      key: "promotional",
                      title: "Promotional Offers",
                      desc: "Balance transfer and refinancing opportunities",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-sm text-primary">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]:
                              !prev[item.key as keyof typeof notifications],
                          }))
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                          notifications[
                            item.key as keyof typeof notifications
                          ]
                            ? "bg-success"
                            : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`absolute size-5 bg-white rounded-full top-0.5 transition-transform shadow-sm ${
                            notifications[
                              item.key as keyof typeof notifications
                            ]
                              ? "translate-x-[22px]"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Delivery Channels
                </h3>
                <div className="space-y-4">
                  {[
                    { key: "whatsapp", label: "WhatsApp", icon: "chat" },
                    { key: "email", label: "Email", icon: "mail" },
                    { key: "sms", label: "SMS", icon: "sms" },
                  ].map((channel) => (
                    <label
                      key={channel.key}
                      className="flex items-center justify-between cursor-pointer py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">
                          {channel.icon}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {channel.label}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={
                          notifications[
                            channel.key as keyof typeof notifications
                          ] as boolean
                        }
                        onChange={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [channel.key]:
                              !prev[
                                channel.key as keyof typeof notifications
                              ],
                          }))
                        }
                        className="accent-cta-saffron size-4"
                      />
                    </label>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Data & Privacy Section */}
          {activeSection === "data" && (
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="text-lg font-bold text-primary mb-6">
                  Data & Privacy
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-sm text-primary">
                        Download My Data
                      </p>
                      <p className="text-xs text-slate-400">
                        Export all your data as a JSON file
                      </p>
                    </div>
                    <button className="bg-primary/5 text-primary font-semibold text-xs py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                      Download
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-sm text-primary">
                        Revoke CIBIL Consent
                      </p>
                      <p className="text-xs text-slate-400">
                        Stop data fetching and delete stored reports
                      </p>
                    </div>
                    <button className="bg-warning/10 text-warning font-semibold text-xs py-2 px-4 rounded-lg hover:bg-warning/20 transition-colors cursor-pointer">
                      Revoke
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-sm text-danger">
                        Delete Account
                      </p>
                      <p className="text-xs text-slate-400">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <button className="bg-danger/10 text-danger font-semibold text-xs py-2 px-4 rounded-lg hover:bg-danger/20 transition-colors cursor-pointer">
                      Delete
                    </button>
                  </div>
                </div>
              </Card>

              {/* Encryption Notice */}
              <div className="bg-success/5 border border-success/20 rounded-xl p-5 flex items-start gap-4">
                <span className="material-symbols-outlined text-success text-2xl mt-0.5">
                  lock
                </span>
                <div>
                  <p className="font-semibold text-primary text-sm">
                    Your Data Is Encrypted
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    All sensitive information (PAN, Aadhaar, credit report data)
                    is encrypted with AES-256 encryption and stored securely in
                    compliance with RBI guidelines.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
