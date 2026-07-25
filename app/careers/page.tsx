import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CareersForm from "@/components/CareersForm";
import PalmShadow from "@/components/PalmShadow";
import Btn from "@/components/Btn";
import { TileMark } from "@/components/GRMark";
import { categories } from "@/lib/companies";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work across the GR portfolio — real estate, insurance, health, and home ventures in South Florida. Send your resume.",
};

const blurbs: Record<string, string> = {
  "Real Estate": "Construction, development, brokerage, deals.",
  "Insurance & Health": "Licensed advisors, client care, operations.",
  "Home & Lifestyle": "Service, production, the details people notice.",
};

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  if (sent === "1") {
    // full-screen thank-you — always in view, no scrolling required
    return (
      <section className="glow-tl relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
        <PalmShadow className="left-[-9rem] top-[6%] h-[22rem] w-[36rem] opacity-[0.18]" tone="green" />
        <TileMark className="h-20 w-auto md:h-24" alt="GR mark" />
        <h1 className="mt-8 display text-[2.6rem] leading-[1.02] sm:text-6xl md:text-7xl">
          In the pile —<br />
          <span className="text-green">the good one.</span>
        </h1>
        <p className="lede mx-auto mt-6 max-w-md text-mist">
          Your resume is on its way to the team. If there's a fit anywhere
          in the portfolio, you'll hear from a&nbsp;human.
        </p>
        <div className="mt-10">
          <Btn href="/">Back to the site</Btn>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero label="Careers" lines={["Good people", <>get&nbsp;found.</>]}>
        There are no positions posted here — that's deliberate. Across the
        portfolio, roles open when the right person shows up, not the other way
        around. If you're exceptional at what you do, introduce&nbsp;yourself.
      </PageHero>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="display text-4xl md:text-5xl">Where you might&nbsp;land</h2>
            <div className="mt-9 flex flex-col">
              {categories.map((cat, i) => (
                <div
                  key={cat}
                  className="flex items-baseline gap-5 border-t border-line py-6 last:border-b"
                >
                  <span className="display text-2xl text-green">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="display text-2xl md:text-3xl">{cat}</p>
                    <p className="mt-1 text-mist">{blurbs[cat]}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="lede mt-9 max-w-md text-mist">
              If you bring something real, there's a desk somewhere in the
              portfolio for&nbsp;it.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <CareersForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
