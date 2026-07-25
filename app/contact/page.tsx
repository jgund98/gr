import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import Phone from "@/components/Phone";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Gus Renny — West Palm Beach and Coral Springs offices. One call does it.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero label="Contact" lines={[<>One call does&nbsp;it.</>]}>
        Property, coverage, a venture worth discussing — it all starts the same
        way. Call or write; Gus answers&nbsp;fast.
      </PageHero>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="flex flex-col gap-3">
              <Phone className="w-fit display text-4xl text-green transition-colors hover:text-green-bright md:text-6xl" />
              <a
                href={`mailto:${site.email}`}
                className="w-fit display text-2xl text-paper/85 transition-colors hover:text-green md:text-4xl"
              >
                {site.email}
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="navline label mt-2 w-fit pb-1 text-paper/70 hover:text-paper"
              >
                LinkedIn&ensp;↗
              </a>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {site.offices.map((o, i) => (
              <Reveal key={o.city} delay={0.08 * i}>
                <a
                  href={o.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chamfer group block border border-line bg-ink-2 p-8 transition-colors duration-300 hover:border-green/50 md:p-10"
                >
                  <p className="label text-green">
                    {i === 0 ? "Headquarters" : "Broward office"}
                  </p>
                  <h2 className="mt-3 display text-3xl tracking-tight transition-colors group-hover:text-green">
                    {o.city}
                  </h2>
                  <p className="mt-4 leading-relaxed text-mist">
                    {o.lines[0]}
                    <br />
                    {o.lines[1]}
                  </p>
                  <span className="label mt-6 inline-block text-faint transition-colors group-hover:text-green">
                    Open in Maps&ensp;→
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
