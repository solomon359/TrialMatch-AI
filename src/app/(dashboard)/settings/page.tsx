"use client";

import React, { useState } from "react";

type SettingsTab = "profile" | "organization" | "api" | "notifications" | "security";

const tabs: { key: SettingsTab; label: string; icon: string }[] = [
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "organization", label: "Organization", icon: "🏥" },
  { key: "api", label: "API & Integrations", icon: "🔌" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "security", label: "Security & Compliance", icon: "🔒" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Chen",
    email: "coordinator@demo.com",
    role: "Clinical Reviewer",
    phone: "+1 (617) 555-0142",
  });

  // Organization state
  const [org, setOrg] = useState({
    name: "Massachusetts General Hospital",
    department: "Oncology Clinical Research",
    ehrSystem: "Epic Systems",
    timezone: "America/New_York",
  });

  // API keys
  const [apiKeys, setApiKeys] = useState({
    openai: "sk-•••••••••••••••••••••••••••••••••••abc",
    clinicalTrialsGov: "auto",
    ehrIntegration: "Disconnected",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    newMatch: true,
    matchReviewed: true,
    extractionComplete: true,
    extractionFailed: true,
    documentUploaded: false,
    weeklyDigest: true,
    emailNotifications: true,
    inAppNotifications: true,
  });

  // Security
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "60",
    auditRetention: "365",
    dataRetention: "730",
    autoLogout: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-sm text-text-muted mt-1">
            Configure your account, organization, and platform preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 ${
            saved
              ? "bg-accent-green text-white"
              : "bg-accent-blue hover:bg-accent-blue/80 text-white"
          }`}
        >
          {saved ? "✓ Saved" : "💾 Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tab Navigation */}
        <div className="col-span-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                activeTab === tab.key
                  ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card border border-transparent"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="col-span-9">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="glass-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Profile Settings</h2>
                <p className="text-xs text-text-muted mt-1">Manage your personal account information</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-bg-secondary border border-border-theme">
                <div className="w-16 h-16 rounded-full bg-accent-blue/20 flex items-center justify-center text-xl font-bold text-accent-blue">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-text-muted">{profile.role}</p>
                  <button className="mt-2 text-xs text-accent-blue hover:underline">Change avatar</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondary">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondary">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondary">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondary">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Role</label>
                <select
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
                >
                  <option>Clinical Reviewer</option>
                  <option>Research Coordinator</option>
                  <option>Principal Investigator</option>
                  <option>Administrator</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border-theme">
                <button className="text-sm text-accent-red hover:underline">Delete Account</button>
              </div>
            </div>
          )}

          {/* Organization Tab */}
          {activeTab === "organization" && (
            <div className="glass-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Organization Settings</h2>
                <p className="text-xs text-text-muted mt-1">Configure your institution and team preferences</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondary">Organization Name</label>
                  <input
                    type="text"
                    value={org.name}
                    onChange={(e) => setOrg({ ...org, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondary">Department</label>
                  <input
                    type="text"
                    value={org.department}
                    onChange={(e) => setOrg({ ...org, department: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondary">EHR System</label>
                  <select
                    value={org.ehrSystem}
                    onChange={(e) => setOrg({ ...org, ehrSystem: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
                  >
                    <option>Epic Systems</option>
                    <option>Cerner</option>
                    <option>Allscripts</option>
                    <option>Meditech</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-secondary">Timezone</label>
                  <select
                    value={org.timezone}
                    onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
              </div>

              {/* Team Members Preview */}
              <div className="pt-4 border-t border-border-theme">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Team Members</h3>
                <div className="space-y-2">
                  {[
                    { name: "Dr. Sarah Chen", role: "Clinical Reviewer", status: "Active" },
                    { name: "Nurse Mike Johnson", role: "Research Coordinator", status: "Active" },
                    { name: "Dr. Emily Rodriguez", role: "Principal Investigator", status: "Invited" },
                  ].map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-border-theme/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-blue/15 text-accent-blue flex items-center justify-center text-xs font-bold">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm text-text-primary">{member.name}</p>
                          <p className="text-[10px] text-text-muted">{member.role}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                        member.status === "Active"
                          ? "bg-accent-green/15 text-accent-green border-accent-green/30"
                          : "bg-accent-amber/15 text-accent-amber border-accent-amber/30"
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-sm text-accent-blue hover:underline flex items-center gap-1">
                  + Invite Team Member
                </button>
              </div>
            </div>
          )}

          {/* API & Integrations Tab */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="glass-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">API & Integrations</h2>
                  <p className="text-xs text-text-muted mt-1">Manage external service connections and API keys</p>
                </div>

                {/* OpenAI */}
                <div className="p-4 rounded-lg bg-bg-secondary border border-border-theme space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent-green/15 flex items-center justify-center text-lg">🤖</div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">OpenAI API</p>
                        <p className="text-[10px] text-text-muted">Used for clinical entity extraction (GPT-4)</p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border bg-accent-green/15 text-accent-green border-accent-green/30">
                      Connected
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-text-secondary">API Key</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKeys.openai}
                        onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                        className="flex-1 px-3 py-2 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue"
                      />
                      <button className="px-3 py-2 bg-bg-card border border-border-theme rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors">
                        Reveal
                      </button>
                    </div>
                  </div>
                </div>

                {/* ClinicalTrials.gov */}
                <div className="p-4 rounded-lg bg-bg-secondary border border-border-theme space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent-blue/15 flex items-center justify-center text-lg">🌐</div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">ClinicalTrials.gov API</p>
                        <p className="text-[10px] text-text-muted">Public API — no key required</p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border bg-accent-green/15 text-accent-green border-accent-green/30">
                      Available
                    </span>
                  </div>
                </div>

                {/* EHR */}
                <div className="p-4 rounded-lg bg-bg-secondary border border-border-theme space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent-amber/15 flex items-center justify-center text-lg">🏥</div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">EHR Integration (FHIR)</p>
                        <p className="text-[10px] text-text-muted">Direct patient data import via HL7 FHIR R4</p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border bg-accent-amber/15 text-accent-amber border-accent-amber/30">
                      Not Connected
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-medium rounded-lg transition-colors">
                    Configure FHIR Connection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="glass-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Notification Preferences</h2>
                <p className="text-xs text-text-muted mt-1">Choose which events trigger alerts</p>
              </div>

              {/* Delivery Channels */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-secondary">Delivery Channels</h3>
                {[
                  { key: "emailNotifications", label: "Email Notifications", desc: "Receive alerts via email" },
                  { key: "inAppNotifications", label: "In-App Notifications", desc: "See alerts in the notification bell" },
                ].map((channel) => (
                  <div
                    key={channel.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-border-theme/50"
                  >
                    <div>
                      <p className="text-sm text-text-primary">{channel.label}</p>
                      <p className="text-[10px] text-text-muted">{channel.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [channel.key]: !notifications[channel.key as keyof typeof notifications],
                        })
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                        notifications[channel.key as keyof typeof notifications]
                          ? "bg-accent-blue"
                          : "bg-border-theme"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                          notifications[channel.key as keyof typeof notifications]
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Event Types */}
              <div className="space-y-3 pt-4 border-t border-border-theme">
                <h3 className="text-sm font-semibold text-text-secondary">Events</h3>
                {[
                  { key: "newMatch", label: "New Match Generated", desc: "When a patient-trial match is computed", icon: "🔗" },
                  { key: "matchReviewed", label: "Match Reviewed", desc: "When a coordinator reviews a match", icon: "✅" },
                  { key: "extractionComplete", label: "Extraction Complete", desc: "When document entity extraction finishes", icon: "🔬" },
                  { key: "extractionFailed", label: "Extraction Failed", desc: "When document processing encounters errors", icon: "⚠️" },
                  { key: "documentUploaded", label: "Document Uploaded", desc: "When new documents are uploaded", icon: "📄" },
                  { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of activity sent every Monday", icon: "📊" },
                ].map((event) => (
                  <div
                    key={event.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-border-theme/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{event.icon}</span>
                      <div>
                        <p className="text-sm text-text-primary">{event.label}</p>
                        <p className="text-[10px] text-text-muted">{event.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [event.key]: !notifications[event.key as keyof typeof notifications],
                        })
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                        notifications[event.key as keyof typeof notifications]
                          ? "bg-accent-blue"
                          : "bg-border-theme"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                          notifications[event.key as keyof typeof notifications]
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & Compliance Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="glass-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Security & Compliance</h2>
                  <p className="text-xs text-text-muted mt-1">Manage authentication, data retention, and compliance settings</p>
                </div>

                {/* Password */}
                <div className="space-y-3 pb-4 border-b border-border-theme">
                  <h3 className="text-sm font-semibold text-text-secondary">Authentication</h3>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-border-theme/50">
                    <div>
                      <p className="text-sm text-text-primary">Password</p>
                      <p className="text-[10px] text-text-muted">Last changed 14 days ago</p>
                    </div>
                    <button className="px-3 py-1.5 bg-bg-card border border-border-theme rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors">
                      Change Password
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-border-theme/50">
                    <div>
                      <p className="text-sm text-text-primary">Two-Factor Authentication</p>
                      <p className="text-[10px] text-text-muted">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                        security.twoFactorEnabled ? "bg-accent-blue" : "bg-border-theme"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                          security.twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Session */}
                <div className="space-y-3 pb-4 border-b border-border-theme">
                  <h3 className="text-sm font-semibold text-text-secondary">Session Management</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-secondary">Session Timeout (minutes)</label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                        className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.autoLogout}
                          onChange={(e) => setSecurity({ ...security, autoLogout: e.target.checked })}
                          className="w-4 h-4 rounded border-border-theme bg-bg-primary accent-accent-blue"
                        />
                        Auto-logout on inactivity
                      </label>
                    </div>
                  </div>
                </div>

                {/* Data Retention */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-secondary">Data Retention</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-secondary">Audit Log Retention</label>
                      <select
                        value={security.auditRetention}
                        onChange={(e) => setSecurity({ ...security, auditRetention: e.target.value })}
                        className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
                      >
                        <option value="90">90 days</option>
                        <option value="180">180 days</option>
                        <option value="365">1 year</option>
                        <option value="730">2 years</option>
                        <option value="0">Indefinite</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-secondary">Patient Data Retention</label>
                      <select
                        value={security.dataRetention}
                        onChange={(e) => setSecurity({ ...security, dataRetention: e.target.value })}
                        className="w-full px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
                      >
                        <option value="365">1 year</option>
                        <option value="730">2 years</option>
                        <option value="1825">5 years</option>
                        <option value="0">Indefinite</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Info */}
              <div className="glass-card p-6 border-l-4 border-l-accent-purple">
                <h3 className="text-sm font-semibold text-text-primary mb-2">Compliance Notes</h3>
                <ul className="space-y-1.5 text-xs text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple mt-0.5">•</span>
                    All patient data is encrypted at rest (AES-256) and in transit (TLS 1.3).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple mt-0.5">•</span>
                    Audit logs are immutable and cannot be deleted by any user.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple mt-0.5">•</span>
                    PHI is never sent to external AI services without explicit consent tracking.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple mt-0.5">•</span>
                    HIPAA BAA is required for all production deployments.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
