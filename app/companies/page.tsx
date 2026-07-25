import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";
import { TileMark } from "@/components/GRMark";
import { companies, categories } from "@/lib/companies";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Companies",
  description:
    "The GR portfolio — GDR Development, Renny Realty, Renny Insurance Group, Millennium Health Advisors, Sycamore Behavioral Health, Helping Hand Home Warranty, and Decorate One.",
};

export default function CompaniesPage() {
  return (
    <>
      <PageHero label="The portfolio" lines={["One name.", <>One&nbsp;standard.</>]}>
        Real estate leads. Everything else — insurance, health, home — was built
        around it, the way a good operator builds: one venture funding the next,
        all of them accountable to the same&nbsp;name.
      </PageHero>

      {/* parent band */}
      <section className="border-y border-line bg-ink-2">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-14 md:flex-row md:items-center md:gap-12 md:px-8 md:py-16">
          <TileMark className="h-20 w-auto shrink-0 md:h-24" alt="GR mark" />
          <div>
            <p className="label text-green">The parent</p>
            <h2 className="mt-2 display text-3xl tracking-tight md:text-4xl">
              {site.legalName}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-mist">
              Founded in {site.founded}. Nearly three decades of residential and
              commercial building, development, construction, and renovation —
              the holding company every venture below answers&nbsp;to.
            </p>
          </div>
        </div>
      </section>

      {/* companies by category */}
      {categories.map((cat) => (
        <section key={cat} className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal>
              <h2 className="label text-green">{cat}</h2>
            </Reveal>
            <div className="mt-8 flex flex-col gap-6">
              {companies
                .filter((c) => c.category === cat)
                .map((c, i) => (
                  <Reveal key={c.slug} delay={0.06 * i}>
                    <article
                      id={c.slug}
                      className="chamfer group grid scroll-mt-32 gap-7 border border-line bg-ink-2 p-7 transition-colors duration-300 hover:border-green/50 md:grid-cols-12 md:items-center md:gap-10 md:p-9"
                    >
                      {/* uniform, centered logo cell — icons and wordmarks share one optical box */}
                      <div className="flex h-24 items-center justify-center border-b border-line pb-6 md:col-span-3 md:h-28 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                        <Image
                          src={c.logo}
                          alt={`${c.name} logo`}
                          width={220}
                          height={96}
                          className="max-h-full max-w-[78%] w-auto object-contain"
                          style={
                            c.logoScale
                              ? { transform: `scale(${c.logoScale})` }
                              : undefined
                          }
                        />
                      </div>
                      <div className="md:col-span-7">
                        <h3 className="display text-2xl md:text-3xl">{c.name}</h3>
                        <p className="mt-3 leading-relaxed text-mist md:text-lg">{c.body}</p>
                      </div>
                      <div className="md:col-span-2 md:text-right">
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="navline label inline-block pb-1 text-green"
                        >
                          Visit site&ensp;↗
                        </a>
                      </div>
                    </article>
                  </Reveal>
                ))}
            </div>
          </div>
        </section>
      ))}

      <ContactCTA />
    </>
  );
}
