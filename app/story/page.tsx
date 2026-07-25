import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";
import { TileMark, Glyph } from "@/components/GRMark";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Story",
  description:
    "New York born. Miami Beach 1996 — the Century Hotel. More than 2,000 properties later, a portfolio of companies under one mark.",
};

function Chapter({
  year,
  title,
  children,
  image,
  imageAlt,
  flip = false,
  imageTop = false,
}: {
  year: string;
  title: React.ReactNode;
  children: React.ReactNode;
  image?: string;
  imageAlt?: string;
  flip?: boolean;
  imageTop?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <Reveal className={flip ? "lg:order-2" : ""}>
        <p className="display text-7xl text-green md:text-8xl">{year}</p>
        <h2 className="mt-4 display text-4xl leading-tight md:text-5xl">{title}</h2>
        <div className="lede mt-6 flex flex-col gap-4 text-mist">{children}</div>
      </Reveal>
      {image ? (
        <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
          <div className="relative">
            {/* offset frame — editorial, no text on the photo */}
            <div
              className="chamfer absolute -bottom-3 -right-3 h-full w-full border-2 border-green/40"
              aria-hidden
            />
            <div className="chamfer relative aspect-[4/3] overflow-hidden bg-ink-3">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={imageTop ? "object-cover object-top" : "object-cover"}
              />
            </div>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={0.1} className={"flex justify-center " + (flip ? "lg:order-1" : "")}>
          <TileMark
            className="h-48 w-auto drop-shadow-[0_0_60px_rgba(136,192,71,0.3)] md:h-72"
            alt="The GR mark"
          />
        </Reveal>
      )}
    </div>
  );
}

export default function StoryPage() {
  return (
    <>
      <PageHero label="The story" lines={[<>Built, not&nbsp;told.</>]}>
        Gus Renny doesn't talk much about legacy. The buildings do it for him —
        an art-deco hotel on Ocean Drive, streets of restored homes in Palm
        Beach County, and a portfolio of companies that all trace back to
        one&nbsp;name.
      </PageHero>


      <section className="pb-24 md:pb-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-24 px-5 md:gap-36 md:px-8">
          <Chapter
            year="NY"
            title={<>Wired in New&nbsp;York.</>}
            image="/site/gus-chapter2.webp"
            imageAlt="Gus Renny standing inside a gutted historic home mid-renovation"
            imageTop
          >
            <p>
              Born in New York, Gus came up through the restaurant and nightclub
              business — marketing, operations, sales. Years of running rooms where
              every night is opening night. It taught him the two things he still
              runs on: read people fast, and outwork everyone.
            </p>
          </Chapter>

          <Chapter
            year="1996"
            title={<>Miami Beach. The Century&nbsp;Hotel.</>}
            image="/site/century.webp"
            imageAlt="The Century Hotel on Ocean Drive, Miami Beach — art-deco facade with palms"
            flip
          >
            <p>
              At the height of South Beach's revival he moved to Miami Beach, and his
              first project set the tone for everything after: the renovation of the
              historically famous Century Hotel on Ocean Drive. Not a flip — a
              restoration of a landmark, done right, on one of the most watched
              streets in America.
            </p>
          </Chapter>

          <Chapter year="1997" title={<>The mark goes&nbsp;up.</>}>
            <p>
              A year later he founded {site.legalName} — the company that still sits
              at the center of everything. Residential and commercial building,
              development, construction, renovation. The green square went on the
              first job site, and it never came&nbsp;down.
            </p>
          </Chapter>

          <Chapter
            year="2,000+"
            title={<>Repetition becomes&nbsp;instinct.</>}
            image="/properties/washington-3609/1.webp"
            imageAlt="A newly built West Palm Beach residence"
            flip
          >
            <p>
              More than two thousand properties bought, sold, renovated, or built in
              his personal career. At that volume, pattern recognition stops being a
              skill and becomes a reflex — what a street is about to do, what a house
              is actually worth, which walls can move and which&nbsp;can't.
            </p>
          </Chapter>

          <Chapter
            year="Now"
            title={<>More than&nbsp;houses.</>}
            image="/properties/kanuga/1.webp"
            imageAlt="A restored historic cottage in Flamingo Park, West Palm Beach"
          >
            <p>
              Today the building runs through Palm Beach County's protected historic
              neighborhoods, while the portfolio around it — brokerage, insurance,
              health, home — protects what the building side creates. Real estate
              first. Everything else in its&nbsp;service.
            </p>
          </Chapter>
        </div>
      </section>

      {/* the best build */}
      <section className="relative overflow-hidden border-y border-line bg-ink-2 py-24 md:py-32">
        <Glyph className="pointer-events-none absolute -left-[12%] top-1/2 h-[120%] w-auto -translate-y-1/2 text-green opacity-[0.05]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-5 lg:gap-20">
          <Reveal className="lg:col-span-2">
            <div className="relative">
              <div className="chamfer absolute -bottom-3 -left-3 h-full w-full border-2 border-green/40" aria-hidden />
              <div className="chamfer relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/site/family.webp"
                  alt="Gus Renny with his daughter inside a home mid-renovation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-3">
            <Reveal>
              <p className="tag-index">Off the clock</p>
              <h2 className="mt-4 display text-5xl leading-tight md:text-7xl">
                "My best&nbsp;build."
              </h2>
              <p className="lede mt-6 max-w-xl text-mist">
                Ask Gus what he's proudest of and it isn't on any deed — it's
                his daughter. His answer, word for word: family life is his
                best&nbsp;build.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
