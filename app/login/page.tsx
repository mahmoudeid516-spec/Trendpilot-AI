"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl p-4 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl p-4 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Login"}
        </button>

      </div>

    </main>
  );
}