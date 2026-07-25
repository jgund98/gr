/* Headless screenshot rig for the polish loop. */
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "raw-assets", "shots");
const BASE = "http://localhost:3970";

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:/Users/Lucky/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe",
    args: ["--autoplay-policy=no-user-gesture-required", "--no-sandbox"],
  });

  async function shoot(viewport, tag) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    // home with scroll choreography
    await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(() => sessionStorage.setItem("gr-intro", "1"));
    await page.reload({ waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1500));

    const marks = await page.evaluate(() => {
      const q = (sel) => {
        const el = document.querySelector(sel);
        return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
      };
      const heroH = document.querySelector("section[aria-label='Gus Renny']")?.offsetHeight ?? 0;
      return {
        heroMid: Math.round(heroH * 0.45),
        heroEnd: Math.round(heroH - window.innerHeight * 0.9),
        sections: [...document.querySelectorAll("main > section, main > div")].map((s) =>
          Math.round(s.getBoundingClientRect().top + window.scrollY)
        ),
        total: document.body.scrollHeight,
        vh: window.innerHeight,
      };
    });

    const stops = [0, marks.heroMid, marks.heroEnd, ...marks.sections.slice(1)];
    // dedupe & clamp
    const seen = new Set();
    let idx = 0;
    for (const y of stops) {
      if (y == null) continue;
      const yy = Math.max(0, Math.min(y, marks.total - marks.vh));
      const key = Math.round(yy / 120);
      if (seen.has(key)) continue;
      seen.add(key);
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), yy);
      await new Promise((r) => setTimeout(r, 1300));
      await page.screenshot({ path: path.join(OUT, `${tag}-home-${String(idx).padStart(2, "0")}-y${yy}.png`) });
      idx++;
    }

    for (const p of ["companies", "portfolio", "story", "careers", "contact"]) {
      await page.goto(`${BASE}/${p}`, { waitUntil: "networkidle2", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 1400));
      await page.screenshot({ path: path.join(OUT, `${tag}-${p}-top.png`) });
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.45, behavior: "instant" }));
      await new Promise((r) => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(OUT, `${tag}-${p}-mid.png`) });
    }
    await page.close();
  }

  await shoot({ width: 1440, height: 900 }, "d");
  await shoot({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, "m");

  await browser.close();
  console.log("shots:", fs.readdirSync(OUT).length);
}

main().catch((e) => { console.error(e); process.exit(1); });
