export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Settings</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-3 text-sm text-slate-600">
          Settings route is active and protected through existing auth middleware for dashboard users.
        </p>
      </section>
    </main>
  );
}
