import MaskHero from "@/components/MaskHero";
import Marquee from "@/components/Marquee";
import Playbook from "@/components/Playbook";
import HoldingsIndex from "@/components/HoldingsIndex";
import PropertyShowcase from "@/components/PropertyShowcase";
import BuildersEye from "@/components/BuildersEye";
import ReelTheater from "@/components/ReelTheater";
import StoryTeaser from "@/components/StoryTeaser";
import Stats from "@/components/Stats";
import HomeBase from "@/components/HomeBase";
import ContactCTA from "@/components/ContactCTA";
import { getFeatured } from "@/lib/properties";

export default function Home() {
  const featured = getFeatured()
    .filter((p) => p.region === "West Palm Beach, FL")
    .slice(0, 3);

  return (
    <>
      <MaskHero />
      <Marquee />
      <Playbook />
      <HoldingsIndex />
      <PropertyShowcase
        items={featured.map((p) => ({
          slug: p.slug,
          title: p.type,
          place: `${p.neighborhood} · West Palm Beach`,
          line: p.line,
          hero: p.hero,
        }))}
      />
      <BuildersEye />
      <ReelTheater />
      <StoryTeaser />
      <Stats />
      <HomeBase />
      <ContactCTA />
    </>
  );
}
