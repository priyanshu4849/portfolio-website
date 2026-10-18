// End-to-end checks for the built site: security headers, files that must
// never be served, link and image hygiene, and the assets the page depends on.
//
// Runs against a running server, local by default:
//   npm run build && npm start      (in one terminal)
//   npm test                        (in another)
// Or against the live site:
//   BASE_URL=https://portfolio-website-ats-resume.vercel.app npm test
//
// Uses only Node's built-in test runner and fetch, so there's nothing to install.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

let home; // the homepage response, fetched once
let html; // its HTML

before(async () => {
  try {
    home = await fetch(BASE_URL + "/");
  } catch {
    throw new Error(`Couldn't reach ${BASE_URL}. Start the site first: npm run build && npm start`);
  }
  html = await home.text();
});

// Every <tag ...> in the page, with its attributes as an object
function tags(name) {
  const found = [];
  for (const [, attrs] of html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, "gi"))) {
    const obj = {};
    for (const [, key, value] of attrs.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) obj[key.toLowerCase()] = value ?? "";
    found.push(obj);
  }
  return found;
}

describe("security headers", () => {
  test("homepage loads", () => {
    assert.equal(home.status, 200);
    assert.match(home.headers.get("content-type"), /text\/html/);
  });

  test("Content-Security-Policy is set and blocks framing and plugins", () => {
    const csp = home.headers.get("content-security-policy");
    assert.ok(csp, "missing Content-Security-Policy header");
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /object-src 'none'/);
  });

  test("clickjacking, MIME sniffing, referrer and permissions headers are set", () => {
    assert.equal(home.headers.get("x-frame-options"), "DENY");
    assert.equal(home.headers.get("x-content-type-options"), "nosniff");
    assert.equal(home.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    assert.match(home.headers.get("permissions-policy") ?? "", /camera=\(\)/);
  });

  test("doesn't advertise the framework with X-Powered-By", () => {
    assert.equal(home.headers.get("x-powered-by"), null);
  });

  test("security headers apply to files too, not just the page", async () => {
    const res = await fetch(BASE_URL + "/Priyanshu_Saini_Resume.pdf", { method: "HEAD" });
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  });
});

describe("files that must never be served", () => {
  const privatePaths = [
    "/.env",
    "/.env.local",
    "/.env.production",
    "/.git/config",
    "/.git/HEAD",
    "/package.json",
    "/package-lock.json",
    "/next.config.mjs",
    "/.next/server/app/page.js",
    "/app/layout.js",
    "/components/Hero.jsx",
    "/.vercel/project.json",
  ];
  for (const path of privatePaths) {
    test(`${path} returns 404`, async () => {
      const res = await fetch(BASE_URL + path);
      assert.equal(res.status, 404);
    });
  }

  test("an unknown page returns a real 404, not the homepage", async () => {
    const res = await fetch(BASE_URL + "/this-page-does-not-exist");
    assert.equal(res.status, 404);
  });
});

describe("links and markup", () => {
  test("every link that opens a new tab has rel=noopener", () => {
    const newTab = tags("a").filter((a) => a.target === "_blank");
    assert.ok(newTab.length > 0, "expected some external links");
    for (const a of newTab) assert.match(a.rel ?? "", /noopener/, `${a.href} is missing rel=noopener`);
  });

  test("no javascript: URLs or inline event handlers in the HTML", () => {
    assert.doesNotMatch(html, /href="\s*javascript:/i);
    assert.doesNotMatch(html, /<[^>]+\son(click|load|error|mouseover)="/i);
  });

  test("every external link uses https", () => {
    for (const a of tags("a")) {
      if (a.href?.startsWith("http")) assert.ok(a.href.startsWith("https://"), `${a.href} isn't https`);
    }
  });

  test("every image has alt text (empty is fine for decorative ones)", () => {
    for (const img of tags("img")) assert.ok("alt" in img, `${img.src} has no alt attribute`);
  });

  test("all five sections exist and every nav link points at one", () => {
    for (const id of ["about", "skills", "projects", "community", "contact"]) {
      assert.match(html, new RegExp(`<section[^>]*id="${id}"`), `missing section #${id}`);
    }
    for (const a of tags("a").filter((a) => a.href?.startsWith("#"))) {
      assert.match(html, new RegExp(`id="${a.href.slice(1)}"`), `${a.href} points at nothing`);
    }
  });

  test("title, description and link-preview tags are present", () => {
    assert.match(html, /<title>[^<]+<\/title>/);
    const meta = tags("meta");
    assert.ok(meta.some((m) => m.name === "description" && m.content));
    assert.ok(meta.some((m) => m.property === "og:image" && m.content?.startsWith("https://")));
  });
});

describe("assets", () => {
  test("resume downloads as a real PDF", async () => {
    const res = await fetch(BASE_URL + "/Priyanshu_Saini_Resume.pdf");
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /application\/pdf/);
    const start = Buffer.from(await res.arrayBuffer()).subarray(0, 5).toString();
    assert.equal(start, "%PDF-");
  });

  test("hero video and its poster load", async () => {
    const video = await fetch(BASE_URL + "/hero.mp4", { method: "HEAD" });
    assert.equal(video.status, 200);
    assert.match(video.headers.get("content-type"), /video\/mp4/);
    const poster = await fetch(BASE_URL + "/hero-poster.jpg", { method: "HEAD" });
    assert.equal(poster.status, 200);
  });

  test("link-preview image is generated", async () => {
    const res = await fetch(BASE_URL + "/opengraph-image");
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /image\/png/);
  });

  test("every same-site file the page references loads", async () => {
    const urls = new Set();
    for (const [, url] of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)) urls.add(url.replace(/&amp;/g, "&"));
    assert.ok(urls.size > 0);
    for (const url of urls) {
      const res = await fetch(BASE_URL + url, { method: "HEAD" });
      assert.ok(res.status < 400, `${url} returned ${res.status}`);
    }
  });

  test("shipped JavaScript contains no API keys or secrets", async () => {
    const scripts = tags("script").map((s) => s.src).filter((src) => src?.startsWith("/"));
    assert.ok(scripts.length > 0);
    const secretPatterns = [
      /sk-ant-[\w-]{20,}/, // Anthropic
      /sk-[A-Za-z0-9]{32,}/, // OpenAI-style
      /AIza[\w-]{35}/, // Google
      /gh[pousr]_[A-Za-z0-9]{36}/, // GitHub token
      /mongodb(\+srv)?:\/\/[^\s"']+:[^\s"']+@/, // database URL with a password
      /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    ];
    for (const src of scripts) {
      const code = await (await fetch(BASE_URL + src)).text();
      for (const pattern of secretPatterns) assert.doesNotMatch(code, pattern, `${src} matches ${pattern}`);
    }
  });
});

describe("privacy of public files", () => {
  // JPEG photos can carry the GPS location they were taken at. This walks the
  // EXIF block and fails if it contains a GPS section (tag 0x8825).
  function hasGps(buf) {
    for (let i = 2; i < buf.length - 4; ) {
      if (buf[i] !== 0xff) return false;
      const marker = buf[i + 1];
      const length = buf.readUInt16BE(i + 2);
      if (marker === 0xe1 && buf.toString("latin1", i + 4, i + 10) === "Exif\0\0") {
        const tiff = i + 10;
        const little = buf.toString("latin1", tiff, tiff + 2) === "II";
        const u16 = (o) => (little ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
        const u32 = (o) => (little ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
        const ifd0 = tiff + u32(tiff + 4);
        const entries = u16(ifd0);
        for (let e = 0; e < entries; e++) if (u16(ifd0 + 2 + e * 12) === 0x8825) return true;
        return false;
      }
      if (marker === 0xda) return false; // image data starts; no more metadata
      i += 2 + length;
    }
    return false;
  }

  const photos = readdirSync(new URL("../public", import.meta.url)).filter((f) => /\.jpe?g$/i.test(f));
  for (const photo of photos) {
    test(`public/${photo} has no GPS location`, () => {
      const buf = readFileSync(new URL(`../public/${photo}`, import.meta.url));
      assert.equal(hasGps(buf), false);
    });
  }
});
