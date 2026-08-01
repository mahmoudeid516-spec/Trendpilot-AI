"use client";

import Link from "next/link";
import { FileSearch } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-8 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10">
        <FileSearch className="h-10 w-10 text-indigo-400" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-white">
        No Reports Yet
      </h2>

      <p className="mt-3 max-w-md text-slate-400">
        Generate your first AI report and it will appear here automatically.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Generate First Report
      </Link>
    </div>
  );
}