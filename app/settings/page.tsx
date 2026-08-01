"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/services/profile";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();

        if (profile) {
          setFullName(profile.full_name ?? "");
          setEmail(profile.email ?? "");
        }
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave() {
    if (!fullName.trim()) {
      setMessage("❌ Full name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await updateProfile(fullName.trim());

      setMessage("✅ Profile updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-4 text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      <p className="mt-2 text-slate-400">
        Manage your TrendPilot AI account.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white">
          Profile
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-400 cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {message && (
            <div
              className={`rounded-xl p-3 text-sm ${
                message.startsWith("✅")
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}