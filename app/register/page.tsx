"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!fullName || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          plan: "Free",
          subscription_status: "inactive",
        });

      if (profileError) {
        console.log(profileError);
      }
    }

    setLoading(false);

    alert("Account created successfully! Please check your email.");

    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-xl p-4 mb-4"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

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
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
    </main>
  );
}