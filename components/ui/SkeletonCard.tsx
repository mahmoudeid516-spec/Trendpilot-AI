"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <Skeleton height={24} width="60%" />

      <div className="mt-4">
        <Skeleton count={3} />
      </div>

      <div className="mt-6">
        <Skeleton height={40} />
      </div>
    </div>
  );
}