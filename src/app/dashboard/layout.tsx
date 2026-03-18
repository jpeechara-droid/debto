"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AiAssistantWidget } from "@/components/dashboard/ai-assistant-widget";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  {
    icon: "description",
    label: "My Credit Report",
    href: "/dashboard/credit-report",
  },
  { icon: "psychology", label: "AI Analysis", href: "/dashboard/ai-analysis" },
  { icon: "calculate", label: "Calculators", href: "/dashboard/calculators" },
  {
    icon: "groups",
    label: "Consultations",
    href: "/dashboard/consultations",
  },
  { icon: "settings", label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; phone?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const handleLogout = async () => {
    if (isDemo) {
      router.push("/");
      return;
    }
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const displayName = user?.name || "User";
  const displayPhone = user?.phone
    ? `+91 ${user.phone.slice(0, 5)} ${user.phone.slice(5)}`
    : "";

  return (
    <div className="h-screen bg-background-light flex flex-col overflow-hidden">
      {/* Top Edge Demo Banner */}
      {isDemo && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs lg:text-sm text-amber-800 font-medium w-full shrink-0">
          <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
          You are viewing a demo with sample data.{" "}
          <Link href="/auth/signup" className="underline font-bold hover:text-amber-900">
            Sign up
          </Link>{" "}
          to analyze your own debt.
        </div>
      )}

      {/* Top bar */}
      <header className="shrink-0 bg-white border-b border-slate-200 z-40">
        <div className="px-4 lg:px-8 h-14 flex items-center justify-between w-full">
          {/* Logo area & Nav */}
          <div className="flex items-center gap-8 lg:gap-16">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-primary"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="size-8 bg-[#5454F6] rounded-lg flex items-center justify-center">
                  <div className="size-3.5 bg-white rounded-sm"></div>
                </div>
                <div>
                  <h2 className="text-slate-900 text-[17px] font-bold tracking-tight leading-none">
                    Debto
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">Fintech</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all",
                      isActive
                        ? "bg-indigo-50 text-[#5454F6]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side icons & user info */}
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors cursor-pointer hidden sm:block">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer hidden sm:block">
               <span className="material-symbols-outlined">settings</span>
            </button>
            
            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-2"></div>

            <div className="relative group cursor-pointer flex items-center gap-3">
              <div className="hidden lg:block text-right">
                 <p className="text-[13px] font-bold text-slate-800">{displayName}</p>
                 <p className="text-[10px] font-medium text-slate-500">PREMIUM MEMBER</p>
              </div>
              <div className="size-8 rounded-full overflow-hidden border border-slate-200">
                <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
              </div>
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col pt-2 pb-2 z-50 transform origin-top-right">
                <div className="px-4 py-2 border-b border-slate-100 mb-1 lg:hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{displayPhone}</p>
                </div>
                <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#5454F6]">
                  <span className="material-symbols-outlined text-lg">person</span> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-500 w-full text-left mt-1 border-t border-slate-100 pt-2">
                  <span className="material-symbols-outlined text-lg">{isDemo ? "arrow_back" : "logout"}</span> {isDemo ? "Exit Demo" : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Area: 2 Columns */}
      <div className="flex flex-1 overflow-hidden relative w-full bg-white shadow-sm">
        
        {/* Left Pane: Content */}
        <main className="flex-1 overflow-y-auto bg-[#fafbfc] relative">
           <div className="px-6 lg:px-10 py-6 lg:py-8 w-full">
              {children}
           </div>
        </main>
        
        {/* Right Pane: AI Assistant Sidebar */}
        <AiAssistantWidget />
        
        {/* Mobile Navigation Drawer */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:hidden shadow-2xl",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* User info mobile */}
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full overflow-hidden border border-slate-200">
                <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500">Premium Member</p>
              </div>
            </div>
          </div>

          {/* Navigation mobile */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-indigo-50 text-[#5454F6] border-l-4 border-[#5454F6] -ml-px"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    )}
                  >
                    <span
                      className={cn(
                        "material-symbols-outlined text-xl",
                        isActive && "fill-1"
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout mobile */}
          <div className="p-4 border-t border-slate-100 shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors w-full px-4 py-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">{isDemo ? "arrow_back" : "logout"}</span>
              {isDemo ? "Exit Demo" : "Logout"}
            </button>
          </div>
        </aside>

        {/* Overlay for mobile drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
