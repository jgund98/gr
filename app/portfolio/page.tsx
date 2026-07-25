import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PropertyBlock from "@/components/PropertyBlock";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";
import { getAllProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected work — historic rebuilds and new construction in West Palm Beach's Southland Park and Flamingo Park, and the Bel Air hillsides.",
};

export default function PortfolioPage() {
  const all = getAllProperties();
  const wpb = all.filter((p) => p.region === "West Palm Beach, FL");
  const bel = all.filter((p) => p.slug === "linda-2179");

  return (
    <>
      <PageHero label="Selected work" lines={["The work does", <>the&nbsp;talking.</>]}>
        A sample of current and recent projects led through GDR Development —
        historic rebuilds in West Palm Beach's protected neighborhoods, with
        select work beyond Florida. Every one carried from acquisition to the
        final&nbsp;walkthrough.
      </PageHero>

      <section className="pb-10 md:pb-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="border-b border-line pb-5">
            <h2 className="display text-4xl text-green md:text-6xl">
              West Palm Beach, Florida
            </h2>
          </Reveal>
          <div className="mt-12 flex flex-col gap-20 md:gap-28">
            {wpb.map((p, i) => (
              <PropertyBlock key={p.slug} p={p} eager={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="pt-10 md:pt-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="border-b border-line pb-5">
            <h2 className="display text-4xl text-green md:text-6xl">
              Bel Air, California
            </h2>
          </Reveal>
          <div className="mt-12 flex flex-col gap-20 md:gap-28">
            {bel.map((p) => (
              <PropertyBlock key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      <div className="mt-16 border-t border-line md:mt-24">
        <ContactCTA />
      </div>
    </>
  );
}
