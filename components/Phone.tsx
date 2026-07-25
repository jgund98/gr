"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Scrape-resistant phone link. The number never appears in the served
 * HTML or as a plain string in the bundle — it's assembled from char
 * codes on the client after mount. Humans see and tap it normally.
 */
const P1 = [51, 48, 53]; // area
const P2 = [55, 55, 56];
const P3 = [55, 49, 49, 52];
const dec = (a: number[]) => a.map((c) => String.fromCharCode(c)).join("");

export default function Phone({ className }: { className?: string }) {
  const [num, setNum] = useState<{ text: string; href: string } | null>(null);

  useEffect(() => {
    const [a, b, c] = [dec(P1), dec(P2), dec(P3)];
    setNum({ text: `(${a}) ${b}-${c}`, href: `tel:+1${a}${b}${c}` });
  }, []);

  if (!num) {
    // stable-width placeholder until hydration
    return <span className={cn("tabular-nums", className)}>(3··) ···-····</span>;
  }
  return (
    <a href={num.href} className={cn("tabular-nums", className)}>
      {num.text}
    </a>
  );
}
