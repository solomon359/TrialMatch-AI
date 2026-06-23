"use client";

import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  className = "",
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id || "");
  const activeTab = controlledActiveTab ?? internalActive;

  const handleClick = (tabId: string) => {
    setInternalActive(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className={`border-b border-border-theme ${className}`}>
      <nav className="flex gap-1 -mb-px overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            className={`
              px-4 py-2.5 text-sm font-medium whitespace-nowrap
              border-b-2 transition-all duration-200
              ${
                activeTab === tab.id
                  ? "border-accent-blue text-accent-blue"
                  : "border-transparent text-text-muted hover:text-text-secondary hover:border-border-theme"
              }
            `}
          >
            <span className="inline-flex items-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`
                    px-1.5 py-0.5 text-[10px] rounded-full font-semibold
                    ${
                      activeTab === tab.id
                        ? "bg-accent-blue/20 text-accent-blue"
                        : "bg-bg-card text-text-muted"
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
