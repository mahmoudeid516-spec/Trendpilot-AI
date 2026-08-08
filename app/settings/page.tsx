"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/Sidebar";
import { supabase } from "../../lib/supabase";
import { getProfile } from "../../services/profile";

type Profile = {
  email?: string;
  full_name?: string;
  plan?: string;
  subscription_status?: string;
};

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const data = await getProfile();
      setProfile(data);
      setLoading(false);
    }

    void load();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            ⚙️ Settings
          </h1>

          <p className="text-gray-500 mb-8">
            Manage your account and subscription.
          </p>

          {loading ? (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <p className="text-gray-500">Loading your account...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Account</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">
                      {profile?.full_name || "Not set"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">
                      {profile?.email || "Unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-semibold">{profile?.plan || "Free"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Subscription Status
                    </p>
                    <p className="font-semibold capitalize">
                      {profile?.subscription_status || "inactive"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => router.push("/pricing")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Manage Plan
                  </button>

                  <button
                    onClick={() => router.push("/dashboard/integrations")}
                    className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Integrations
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-4">Account Actions</h2>

                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
