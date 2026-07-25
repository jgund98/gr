export type CompanyCategory = "Real Estate" | "Insurance & Health" | "Home & Lifestyle";

export interface Company {
  slug: string;
  name: string;
  category: CompanyCategory;
  logo: string;
  /** short line for cards */
  line: string;
  /** longer paragraph for the Companies page */
  body: string;
  url?: string;
  /** relative logo display size on cards (1 = default) */
  logoScale?: number;
}

export const companies: Company[] = [
  {
    slug: "gdr-development",
    name: "GDR Development",
    category: "Real Estate",
    logo: "/companies/gdr-development.webp",
    line: "Luxury historic rebuilds — West Palm Beach & Bel Air.",
    body: "The development arm. A limited collection of rebuilt historic homes in West Palm Beach's protected neighborhoods and the Bel Air hillsides — homes that read as historic from the sidewalk and live like new construction inside. Gus leads every project personally, from acquisition through the final walkthrough.",
    url: "https://gdrdevelopment.com",
  },
  {
    slug: "renny-realty",
    name: "Renny Realty",
    category: "Real Estate",
    logo: "/companies/renny-realty.webp",
    line: "Luxury brokerage for South Florida.",
    body: "The brokerage. Sales, acquisition, and representation for luxury buyers, sellers, renters, investors, and commercial clients across South Florida — with a specialty in off-market properties and renovation opportunities most agents never see.",
    url: "https://rennyrealty.com",
    logoScale: 1.15,
  },
  {
    slug: "renny-insurance",
    name: "Renny Insurance Group",
    category: "Insurance & Health",
    logo: "/companies/renny-insurance.webp",
    line: "Protecting what the portfolio builds.",
    body: "Insurance built alongside real estate — coverage for the homes, the businesses, and the people behind them. The natural second half of a career spent building things worth protecting.",
  },
  {
    slug: "millennium",
    name: "Millennium Health Advisors",
    category: "Insurance & Health",
    logo: "/companies/millennium.webp",
    line: "Health coverage guidance, Coral Springs.",
    body: "Health insurance advisory out of Coral Springs — helping individuals and families navigate enrollment and find coverage that actually fits, with licensed advisors on the phone instead of a call-center script.",
    url: "https://www.millenniumhealthadvisors.com",
  },
  {
    slug: "sycamore",
    name: "Sycamore Behavioral Health",
    category: "Insurance & Health",
    logo: "/companies/sycamore.webp",
    line: "Behavioral health services.",
    body: "Behavioral health services — an investment in the side of health care that too often gets overlooked, run with the same operational discipline as everything else under the mark.",
    logoScale: 1.2,
  },
  {
    slug: "helping-hand",
    name: "Helping Hand Home Warranty",
    category: "Home & Lifestyle",
    logo: "/companies/helping-hand.webp",
    line: "Home warranty coverage.",
    body: "Home warranty protection — born from thirty years of knowing exactly what breaks in a house, when it breaks, and what it should honestly cost to fix.",
  },
  {
    slug: "decorate-one",
    name: "Decorate One",
    category: "Home & Lifestyle",
    logo: "/companies/decorate-one.webp",
    line: "Embroidery & printing.",
    body: "Custom embroidery and printing — the branding shop behind the portfolio's own gear, and for any business that wants its mark done right.",
    logoScale: 0.9,
  },
];

export const categories: CompanyCategory[] = ["Real Estate", "Insurance & Health", "Home & Lifestyle"];
