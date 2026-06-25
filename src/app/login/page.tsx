"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For MVP, accept demo credentials and store a mock token
      if (email === "coordinator@demo.com" && password === "password123") {
        localStorage.setItem("trialmatch_token", "mock_jwt_token_demo");
        localStorage.setItem(
          "trialmatch_user",
          JSON.stringify({
            id: "u-001",
            name: "Dr. Sarah Chen",
            email: "coordinator@demo.com",
            role: "Clinical Reviewer",
          })
        );
        await new Promise((r) => setTimeout(r, 800)); // Simulate API latency
        router.push("/");
      } else {
        // Try real API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username: email, password }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("trialmatch_token", data.access_token);
          router.push("/");
        } else {
          setError("Invalid email or password. Try the demo credentials below.");
        }
      }
    } catch {
      setError("Unable to connect to server. Using demo mode.");
      // Fallback: let them in with demo creds
      if (email === "coordinator@demo.com" && password === "password123") {
        localStorage.setItem("trialmatch_token", "mock_jwt_token_demo");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("coordinator@demo.com");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)",
            top: "-200px",
            right: "-100px",
            animation: "pulse-subtle 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)",
            bottom: "-150px",
            left: "-100px",
            animation: "pulse-subtle 8s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "pulse-subtle 7s ease-in-out infinite 1s",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 mb-4">
            <span className="text-3xl">🧬</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            TrialMatch <span className="text-accent-blue">AI</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Clinical Trial Matching Dashboard
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Sign In</h2>
            <p className="text-xs text-text-muted mt-1">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinator@demo.com"
                required
                autoFocus
                className="w-full px-4 py-3 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors text-sm"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 rounded border-border-theme bg-bg-primary accent-accent-blue"
                />
                Remember me
              </label>
              <button type="button" className="text-xs text-accent-blue hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20">
                <p className="text-xs text-accent-red">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-blue hover:bg-accent-blue/80 disabled:bg-accent-blue/40 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="pt-4 border-t border-border-theme">
            <button
              onClick={fillDemo}
              className="w-full p-3 rounded-lg bg-accent-purple/5 border border-accent-purple/20 hover:bg-accent-purple/10 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs">🎯</span>
                <span className="text-xs font-semibold text-accent-purple">
                  Demo Credentials
                </span>
              </div>
              <p className="text-[10px] text-text-muted font-mono">
                coordinator@demo.com / password123
              </p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-text-muted">
            TrialMatch AI v0.1.0 • Prescreening support tool only
          </p>
          <p className="text-[10px] text-text-muted mt-0.5">
            © 2026 TrialMatch AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
