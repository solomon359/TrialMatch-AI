"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/patients", label: "Patients", icon: "👥" },
  { href: "/trials", label: "Trials", icon: "🧪" },
  { href: "/matching", label: "Matching", icon: "🔗" },
  { href: "/reports", label: "Reports", icon: "📄" },
  { href: "/audit", label: "Audit Log", icon: "🛡️" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-bg-secondary border-r border-border-theme flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border-theme">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl">🧬</span>
          <div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight">
              TrialMatch <span className="text-accent-blue">AI</span>
            </h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">
              Clinical Trial Matching
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                isActive(item.href)
                  ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card border border-transparent"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-border-theme">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-blue/20 flex items-center justify-center text-sm font-bold text-accent-blue">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              Dr. Sarah Chen
            </p>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-accent-purple/15 text-accent-purple border border-accent-purple/30">
              Clinical Reviewer
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
