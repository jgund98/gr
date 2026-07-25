import Link from "next/link";
import { GlyphOutline } from "@/components/GRMark";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <GlyphOutline className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-auto -translate-x-1/2 -translate-y-1/2 text-green opacity-[0.06]" strokeWidth={4} />
      <p className="label relative text-green">404</p>
      <h1 className="relative mt-4 display text-5xl tracking-tight md:text-7xl">
        Off the&nbsp;lot.
      </h1>
      <p className="relative mt-4 max-w-md text-mist">
        This address doesn't exist — and Gus would know.
      </p>
      <Link
        href="/"
        className="chamfer-sm relative mt-9 bg-green px-8 py-4 font-semibold text-ink transition-colors hover:bg-green-bright"
      >
        Back home
      </Link>
    </section>
  );
}
