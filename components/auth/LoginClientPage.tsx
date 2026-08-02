"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { ensureProfileForUser } from "../../services/profile";

type Props = {
  toastMessage?: string;
  redirectTo?: string;
};

export default function LoginClientPage({ toastMessage = "", redirectTo = "/dashboard" }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await ensureProfileForUser({
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      });
    }

    router.push(redirectTo);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-10 text-slate-900 shadow-[0_32px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <h1 className="mb-2 text-center text-3xl font-black tracking-tight text-slate-900">
          Welcome Back
        </h1>
        <p className="mb-8 text-center text-sm text-slate-600">
          Sign in to access your AI workspace.
        </p>
        {toastMessage ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {toastMessage}
          </div>
        ) : null}
        <form onSubmit={handleLogin} className="space-y-4">
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
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? (
            <p className="text-sm text-rose-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] p-4 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}