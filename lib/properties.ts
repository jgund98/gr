import fs from "node:fs";
import path from "node:path";

export interface PropertyMeta {
  slug: string;
  dir: string;
  name: string;
  neighborhood: string;
  region: "West Palm Beach, FL" | "Bel Air, CA";
  type: string;
  status: "Completed" | "Coming Soon";
  line: string;
  video?: string;
  featured?: boolean;
}

/**
 * Drop .webp files into public/properties/<dir>/ — auto-discovered,
 * naturally sorted. Add an entry here for a new property.
 */
export const propertyMeta: PropertyMeta[] = [
  {
    slug: "greymon-317",
    dir: "greymon-317",
    name: "317 Greymon Dr",
    neighborhood: "Southland Park",
    region: "West Palm Beach, FL",
    type: "Historic Restoration",
    status: "Completed",
    line: "Historic from the sidewalk. New construction inside.",
    featured: true,
  },
  {
    slug: "greymon-227",
    dir: "greymon-227",
    name: "227 Greymon Dr",
    neighborhood: "Southland Park",
    region: "West Palm Beach, FL",
    type: "Full Rebuild",
    status: "Completed",
    line: "New roof, new systems, new plan — one design vision.",
    featured: true,
  },
  {
    slug: "greymon-309",
    dir: "greymon-309",
    name: "309 Greymon Dr",
    neighborhood: "Southland Park",
    region: "West Palm Beach, FL",
    type: "Historic Rebuild",
    status: "Coming Soon",
    line: "Classic Palm Beach — white facades, green shutters.",
    video: "/videos/greymon-309-tour.webm",
    featured: true,
  },
  {
    slug: "greymon-335",
    dir: "greymon-335",
    name: "335 Greymon Dr",
    neighborhood: "Southland Park",
    region: "West Palm Beach, FL",
    type: "Legacy Rebuild",
    status: "Coming Soon",
    line: "A legacy property rebuilt from the inside out.",
  },
  {
    slug: "washington-3609",
    dir: "washington-3609",
    name: "3609 Washington Rd",
    neighborhood: "Southland Park",
    region: "West Palm Beach, FL",
    type: "New Construction",
    status: "Coming Soon",
    line: "Light-filled living with intracoastal glimpses.",
    featured: true,
  },
  {
    slug: "kanuga-707",
    dir: "kanuga",
    name: "707 Kanuga Dr",
    neighborhood: "Flamingo Park",
    region: "West Palm Beach, FL",
    type: "Coastal Restoration",
    status: "Coming Soon",
    line: "A historic cottage reimagined as a coastal residence.",
  },
  {
    slug: "linda-2179",
    dir: "linda-flora",
    name: "2179 Linda Flora Dr",
    neighborhood: "Bel Air Hillsides",
    region: "Bel Air, CA",
    type: "Hillside Rebuild",
    status: "Coming Soon",
    line: "Privacy, grade, and view — a canyon residence rebuilt.",
    featured: true,
  },
  {
    slug: "marlay-1501",
    dir: "marlay",
    name: "1501 Marlay Dr",
    neighborhood: "Bel Air Hillsides",
    region: "Bel Air, CA",
    type: "New Construction",
    status: "Coming Soon",
    line: "Large openings, simplified lines, lasting materials.",
  },
];

const IMG_RE = /\.(webp|avif|jpe?g|png)$/i;

export function getGallery(dir: string): string[] {
  const abs = path.join(process.cwd(), "public", "properties", dir);
  let files: string[] = [];
  try {
    files = fs.readdirSync(abs).filter((f) => IMG_RE.test(f));
  } catch {
    return [];
  }
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  return files.map((f) => `/properties/${dir}/${f}`);
}

export interface Property extends PropertyMeta {
  gallery: string[];
  hero: string;
}

export function getAllProperties(): Property[] {
  return propertyMeta.map((m) => {
    const gallery = getGallery(m.dir);
    return { ...m, gallery, hero: gallery[0] ?? "/site/hero-poster.webp" };
  });
}

export function getFeatured(): Property[] {
  return getAllProperties().filter((p) => p.featured);
}
