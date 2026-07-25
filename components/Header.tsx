"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FullLogo, Glyph } from "@/components/GRMark";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const links = [
  { label: "Companies", href: "/companies" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Story", href: "/story" },
  { label: "Careers", href: "/careers" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500",
        scrolled && !open
          ? "border-line bg-ink/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      {/* legibility scrim while the header floats over the hero */}
      {!scrolled && !open && (
        <div className="pointer-events-none absolute inset-x-0 -top-0 h-28 bg-gradient-to-b from-ink/80 to-transparent" aria-hidden />
      )}

      <div className="relative mx-auto flex h-[88px] max-w-7xl items-center justify-between px-5 md:h-24 md:px-8">
        <Link href="/" aria-label="Gus Renny — home" className="relative z-[70]">
          <FullLogo className="h-16 w-auto md:h-[72px]" alt="GUSRENNY.COM" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname === item.href}
              className="navline label text-paper/85 transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="chamfer-sm bg-green px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-green-bright"
          >
            Contact
          </Link>
        </nav>

        {/* mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-[70] flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="relative block h-3.5 w-7">
            <span
              className={cn(
                "absolute left-0 top-0 h-0.5 w-full bg-paper transition-transform duration-300",
                open && "top-1/2 -translate-y-1/2 rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-paper transition-transform duration-300",
                open && "bottom-auto top-1/2 -translate-y-1/2 -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Glyph className="pointer-events-none absolute -right-[18%] top-1/2 h-[74vh] w-auto -translate-y-1/2 text-green opacity-[0.07]" />
            <nav
              className="relative flex flex-1 flex-col justify-center gap-1 px-8"
              aria-label="Mobile"
            >
              {[...links, { label: "Contact", href: "/contact" }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.35 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-3 display text-5xl tracking-tight transition-colors",
                      pathname === item.href ? "text-green" : "text-paper hover:text-green"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="relative border-t border-line px-8 py-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a href={site.phoneHref} className="block display text-2xl text-green">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="mt-1 block text-mist">
                {site.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
