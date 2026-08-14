"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";
import {
  getShopifyConnectionStatus,
  beginShopifyConnect,
  disconnectShopify,
} from "../../lib/services/shopifyStoreClient";
import type { StoreConnectionStatus } from "../../types/StoreConnection";
import Sidebar from "../../components/dashboard/Sidebar";
import Card from "../../components/ui/Card";
import Eyebrow from "../../components/ui/Eyebrow";
import Pill from "../../components/ui/Pill";
import { buttonClass } from "../../components/ui/button";

type Profile = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  plan?: string | null;
  subscription_status?: string | null;
};

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [billingLoading, setBillingLoading] = useState(false);

  const [shopifyStatus, setShopifyStatus] = useState<StoreConnectionStatus | null>(null);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyShopInput, setShopifyShopInput] = useState("");
  const [shopifyError, setShopifyError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!hasSupabaseConfig()) {
        router.replace("/login");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setEmail(session.user.email ?? "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
        setFullName((profileData as Profile).full_name ?? "");
      }

      try {
        const status = await getShopifyConnectionStatus();
        setShopifyStatus(status);
      } catch (error) {
        console.error("Failed to load Shopify status:", error);
      }

      setLoading(false);
    }

    void load();
  }, [router]);

  async function handleSaveName() {
    setSavingName(true);
    setNameError(null);
    setNameSaved(false);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", session.user.id);

      if (error) throw error;

      setNameSaved(true);
    } catch (error) {
      setNameError(error instanceof Error ? error.message : "Unable to save your name.");
    } finally {
      setSavingName(false);
    }
  }

  async function handleManageSubscription() {
    setBillingLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const response = await fetch("/api/stripe/manage-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      } else {
        setBillingLoading(false);
        alert(data.error ?? "Unable to open billing settings.");
      }
    } catch (error) {
      setBillingLoading(false);
      alert(error instanceof Error ? error.message : "Unable to open billing settings.");
    }
  }

  async function handleConnectShopify() {
    const shop = shopifyShopInput.trim().toLowerCase();

    if (!shop) {
      setShopifyError("Enter your Shopify store domain.");
      return;
    }

    setShopifyError(null);
    setShopifyLoading(true);

    try {
      const url = await beginShopifyConnect(shop);
      window.location.href = url;
    } catch (error) {
      setShopifyError(error instanceof Error ? error.message : "Unable to start the Shopify connection.");
      setShopifyLoading(false);
    }
  }

  async function handleDisconnectShopify() {
    setShopifyLoading(true);
    setShopifyError(null);

    try {
      await disconnectShopify();
      const status = await getShopifyConnectionStatus();
      setShopifyStatus(status);
    } catch (error) {
      setShopifyError(error instanceof Error ? error.message : "Unable to disconnect the Shopify store.");
    } finally {
      setShopifyLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-app)] lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex flex-col gap-1">
            <Eyebrow icon="⚙️" label="Settings" tone="neutral" />
            <h1 className="text-2xl font-bold text-[var(--ink-900)]">Account &amp; Settings</h1>
            <p className="text-sm text-[var(--ink-500)]">
              Manage your account, subscription, and connected integrations.
            </p>
          </div>

          {loading ? (
            <Card>
              <p className="text-sm text-[var(--ink-500)]">Loading your settings...</p>
            </Card>
          ) : (
            <>
              <Card>
                <h2 className="text-base font-bold text-[var(--ink-900)]">Account</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">Email</p>
                    <p className="mt-1 text-sm text-[var(--ink-900)]">{email || "Not available"}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">Display name</p>
                    {profile ? (
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            setNameSaved(false);
                          }}
                          placeholder="Your name"
                          className="tp-focus-ring min-h-11 flex-1 rounded-lg border border-[var(--border-subtle)] px-4 text-sm outline-none"
                        />
                        <button
                          onClick={handleSaveName}
                          disabled={savingName}
                          className={buttonClass({ tone: "data", className: "min-h-11 px-5" })}
                        >
                          {savingName ? "Saving..." : "Save"}
                        </button>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-[var(--ink-500)]">
                        No profile record found for this account yet.
                      </p>
                    )}
                    {nameSaved && <p className="mt-2 text-xs text-[var(--accent-positive)]">Saved.</p>}
                    {nameError && <p className="mt-2 text-xs text-[var(--accent-risk)]">{nameError}</p>}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-[var(--ink-900)]">Subscription</h2>
                  <Pill tone={profile?.plan === "Pro" ? "positive" : "neutral"}>
                    {profile?.plan || "Free"}
                  </Pill>
                </div>
                <p className="mt-2 text-sm text-[var(--ink-500)]">
                  Status: {profile?.subscription_status || "No active subscription"}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {profile?.plan === "Pro" ? (
                    <button
                      onClick={handleManageSubscription}
                      disabled={billingLoading}
                      className={buttonClass({ tone: "data", className: "px-5 py-2.5" })}
                    >
                      {billingLoading ? "Opening..." : "Manage Subscription"}
                    </button>
                  ) : (
                    <a href="/pricing" className={buttonClass({ tone: "warning", className: "px-5 py-2.5" })}>
                      Upgrade to Pro
                    </a>
                  )}
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-[var(--ink-900)]">Shopify Integration</h2>
                  <Pill tone={shopifyStatus?.connected ? "positive" : "neutral"}>
                    {shopifyStatus?.connected ? "Connected" : "Not connected"}
                  </Pill>
                </div>

                {shopifyStatus?.connected ? (
                  <div className="mt-3">
                    <p className="text-sm text-[var(--ink-700)]">
                      Connected to <strong>{shopifyStatus.shopDomain}</strong>
                    </p>
                    <button
                      onClick={handleDisconnectShopify}
                      disabled={shopifyLoading}
                      className={buttonClass({ tone: "risk", variant: "outline", className: "mt-3 px-5 py-2.5" })}
                    >
                      {shopifyLoading ? "Disconnecting..." : "Disconnect Shopify"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      placeholder="your-store.myshopify.com"
                      value={shopifyShopInput}
                      onChange={(e) => setShopifyShopInput(e.target.value)}
                      className="tp-focus-ring min-h-11 flex-1 rounded-lg border border-[var(--border-subtle)] px-4 text-sm outline-none"
                    />
                    <button
                      onClick={handleConnectShopify}
                      disabled={shopifyLoading}
                      className={buttonClass({ tone: "positive", className: "min-h-11 px-5" })}
                    >
                      {shopifyLoading ? "Connecting..." : "Connect Shopify"}
                    </button>
                  </div>
                )}

                {shopifyError && <p className="mt-3 text-xs text-[var(--accent-risk)]">{shopifyError}</p>}
              </Card>

              <Card>
                <h2 className="text-base font-bold text-[var(--ink-900)]">AI Features</h2>
                <p className="mt-2 text-sm text-[var(--ink-500)]">
                  AI Product Analysis and marketing generation are powered by TrendPilot&apos;s own OpenAI
                  integration, configured at the platform level. There is no per-account API key to manage.
                </p>
              </Card>

              <Card>
                <h2 className="text-base font-bold text-[var(--ink-900)]">Notifications</h2>
                <p className="mt-2 text-sm text-[var(--ink-500)]">
                  Not available yet &mdash; TrendPilot does not currently send email or push notifications.
                </p>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
