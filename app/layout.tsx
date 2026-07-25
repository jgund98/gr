import type { Metadata } from "next";
import { Archivo, Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/site";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "GUSRENNY.COM — Builder. Investor. Operator.",
    template: "%s — GUSRENNY.COM",
  },
  description: site.description,
  openGraph: {
    title: "GUSRENNY.COM — Builder. Investor. Operator.",
    description: site.description,
    url: site.domain,
    siteName: "GUSRENNY.COM",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gus Renny",
  url: site.domain,
  jobTitle: "Founder, GR Investment Group",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1300 Old Congress Ave",
    addressLocality: "West Palm Beach",
    addressRegion: "FL",
    postalCode: "33409",
    addressCountry: "US",
  },
  sameAs: [site.social.linkedin, "https://gdrdevelopment.com", "https://rennyrealty.com"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body className="bg-ink text-paper">
        {/* Runs before hydration AND before the browser's async scroll
            restore: home must always open at the top or the hero timeline
            hydrates mid-flight (full video, no aperture). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(location.pathname==='/'){history.scrollRestoration='manual';scrollTo(0,0);addEventListener('pageshow',function(e){if(e.persisted)scrollTo(0,0)});}}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SmoothScroll />
        <Preloader />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
