"use client";

import { useEffect, useRef, useState } from "react";

export default function StatCounter({
  value,
  suffix = "",
  label,
  onDark = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  onDark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 1200;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <div className={"font-display font-extrabold text-4xl lg:text-5xl tracking-tight" + (onDark ? " text-white" : "")}>
        {display.toLocaleString()}
        {suffix}
      </div>
      <div className={"text-xs lg:text-sm mt-1 uppercase tracking-wider font-bold" + (onDark ? " text-white/60" : " text-wgray")}>
        {label}
      </div>
    </div>
  );
}
