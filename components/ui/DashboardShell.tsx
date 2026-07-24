"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type DashboardShellProps = {
  children: ReactNode;
  className?: string;
};

export default function DashboardShell({
  children,
  className,
}: DashboardShellProps) {
  return (
    <main
      className={clsx(
        "mx-auto",
        "w-full",
        "max-w-[1600px]",
        "px-4",
        "sm:px-6",
        "lg:px-8",
        "xl:px-12",
        "2xl:px-16",
        "py-10",
        "space-y-20",
        className
      )}
    >
      {children}
    </main>
  );
}