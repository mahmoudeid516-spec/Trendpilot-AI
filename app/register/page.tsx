"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { ensureProfileForUser } from "../../services/profile";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName || !email || !password) {
      setError("Please fill in your full name, email, and password.");
      return;
    }

    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    if (data.user) {
      await ensureProfileForUser({
        id: data.user.id,
        email: data.user.email,
        user_metadata: {
          full_name: fullName.trim(),
        },
      });
    }

    setLoading(false);
    router.push("/login?signup=success");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-10 text-slate-900 shadow-[0_32px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <h1 className="mb-2 text-center text-3xl font-black tracking-tight text-slate-900">
          Create Account
        </h1>
        <p className="mb-8 text-center text-sm text-slate-600">
          Create your TrendPilot workspace in less than a minute.
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
          <input
            id="fullName"
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] p-4 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}