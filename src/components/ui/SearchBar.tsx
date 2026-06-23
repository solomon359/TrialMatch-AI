"use client";

import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-4 py-2 text-sm rounded-lg
          bg-bg-secondary border border-border-theme
          text-text-primary placeholder-text-muted
          focus:outline-none focus:border-border-active focus:ring-1 focus:ring-accent-blue/30
          transition-colors duration-200
        "
      />
    </div>
  );
}
