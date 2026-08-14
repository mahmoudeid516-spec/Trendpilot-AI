"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger this element's reveal behind others on the same screen. */
  delayMs?: number;
};

/**
 * Fades + slides content in the first time it scrolls into view. Pure
 * IntersectionObserver + CSS transition, no animation dependency. Honors
 * prefers-reduced-motion by rendering content already visible (the media
 * query below strips the transform/opacity transition entirely).
 */
export default function ScrollReveal({ children, className = "", delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`tp-reveal ${visible ? "tp-reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
