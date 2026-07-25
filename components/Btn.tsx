import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Chamfered button with the text-swap hover: the label rolls up
 * and its double rolls in. Pure CSS, GPU transforms only.
 */
export default function Btn({
  href,
  children,
  variant = "solid",
  className,
  external,
}: {
  href: string;
  children: string;
  variant?: "solid" | "outline" | "ink";
  className?: string;
  external?: boolean;
}) {
  const base = cn(
    "chamfer-sm group/btn inline-block overflow-hidden px-8 py-4 text-sm font-semibold transition-colors duration-300",
    variant === "solid" && "bg-green text-ink hover:bg-green-bright",
    variant === "outline" && "border border-green bg-ink text-green hover:bg-green hover:text-ink",
    variant === "ink" && "bg-ink text-green hover:text-green-bright",
    className
  );
  const inner = (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-full">
        {children}
      </span>
      <span
        className="absolute inset-0 block translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0"
        aria-hidden
      >
        {children}
      </span>
    </span>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {inner}
    </Link>
  );
}
