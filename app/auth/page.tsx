"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState(true);

  async function handleSubmit() {
    setLoading(true);

    try {
      if (loginMode) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert(error.message);
          return;
        }

        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          alert(error.message);
          return;
        }

        alert("Account created successfully!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center mb-3">
          TrendPilot AI
        </h1>

        <p className="text-center text-gray-500 mb-8">
          {loginMode ? "Welcome Back" : "Create your account"}
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl px-5 py-4 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl px-5 py-4 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4"
        >
          {loading
            ? "Loading..."
            : loginMode
            ? "Login"
            : "Create Account"}
        </button>

        <button
          onClick={() => setLoginMode(!loginMode)}
          className="mt-6 w-full text-purple-600"
        >
          {loginMode
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </button>

      </div>

    </div>
  );
}