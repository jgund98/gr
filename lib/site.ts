/**
 * Global site facts — every component reads from here.
 * Change once, fixed site-wide.
 */
export const site = {
  name: "Gus Renny",
  legalName: "GR Investment Group, LLC",
  /** current live home — flip to https://gusrenny.com at cutover */
  domain: "https://gus.epicdevsolutions.com",
  tagline: "Builder. Investor. Operator.",
  description:
    "Gus Renny — Palm Beach entrepreneur. Three decades across real estate development, brokerage, insurance, and health. Founder of GR Investment Group.",
  email: "gusrenny@me.com",
  founded: 1997,
  license: "FL Broker BK3322472",
  offices: [
    {
      city: "West Palm Beach",
      lines: ["1300 Old Congress Ave", "West Palm Beach, FL 33409"],
      maps: "https://maps.google.com/?q=1300+Old+Congress+Ave,+West+Palm+Beach,+FL+33409",
    },
    {
      city: "Coral Springs",
      lines: ["3111 N University Dr, Ste 608", "Coral Springs, FL 33065"],
      maps: "https://maps.google.com/?q=3111+N+University+Dr+Ste+608,+Coral+Springs,+FL+33065",
    },
  ],
  social: {
    linkedin: "https://www.linkedin.com/in/gus-renny-b1348063",
  },
} as const;

export const nav = [
  { label: "Companies", href: "/companies" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Story", href: "/story" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

/** Short factual lines mixed between logos in the brand ticker. */
export const tickerLines = ["Est. 1997", "Palm Beach, FL", "GUSRENNY.COM"] as const;

export const stats = [
  { value: 2000, suffix: "+", label: "Properties bought, sold, renovated, or built" },
  { value: 30, suffix: "", label: "Years of building since the Century Hotel" },
  { value: 1997, suffix: "", label: "GR Investment Group founded", plain: true },
] as const;
