"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initialStyles: Record<string, string> = {
      opacity: "0",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.34,1.1,0.64,1) ${delay}s`,
    };

    if (direction === "up") initialStyles.transform = "translateY(40px)";
    else if (direction === "left") initialStyles.transform = "translateX(-40px)";
    else if (direction === "right") initialStyles.transform = "translateX(40px)";
    else if (direction === "scale") initialStyles.transform = "scale(0.85)";

    Object.assign(el.style, initialStyles);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = direction === "scale" ? "scale(1)" : "translate(0,0)";
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
