"use client";

import React, { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";

export default function TopBar() {
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-md border-b border-border-theme">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search patients, trials, matches..."
          className="w-full max-w-md"
        />

        {/* Right side */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
            >
              🔔
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 glass-card p-4 animate-fade-in">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2 text-xs">
                    <span>🟢</span>
                    <div>
                      <p className="text-text-primary">New match generated for Jane Smith</p>
                      <p className="text-text-muted mt-0.5">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span>🟡</span>
                    <div>
                      <p className="text-text-primary">EGFR results pending for John Doe</p>
                      <p className="text-text-muted mt-0.5">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span>🔴</span>
                    <div>
                      <p className="text-text-primary">Document processing failed for Maria Garcia</p>
                      <p className="text-text-muted mt-0.5">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue">
              SC
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
