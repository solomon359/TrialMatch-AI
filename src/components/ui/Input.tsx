"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 text-sm rounded-lg
            bg-bg-secondary border border-border-theme
            text-text-primary placeholder-text-muted
            focus:outline-none focus:border-border-active focus:ring-1 focus:ring-accent-blue/30
            transition-colors duration-200
            ${error ? "border-accent-red" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-accent-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
