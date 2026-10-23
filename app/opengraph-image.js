import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The picture shown when the site's link is shared on LinkedIn, WhatsApp, X,
// Slack, etc. Next.js turns this file into a 1200×630 PNG at build time and
// adds the og:image / twitter:image tags to <head> automatically.
export const alt = "Priyanshu Saini, CS student who builds full stack web apps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // ImageResponse can't use next/font, so the same two fonts are bundled as
  // .ttf files. The hero still is read from disk and inlined as a data URL.
  const [spaceGrotesk, dmSans, poster] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/SpaceGrotesk-Bold.ttf")),
    readFile(join(process.cwd(), "app/fonts/DMSans-Regular.ttf")),
    readFile(join(process.cwd(), "public/hero-poster.jpg"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#1f2023" }}>
        {/* The 3D portrait on the right half, faded into the background on its
            left edge so there's no hard seam next to the text */}
        <img
          src={`data:image/jpeg;base64,${poster}`}
          width={640}
          height={630}
          style={{ position: "absolute", right: 0, top: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 0,
            width: 200,
            height: 630,
            backgroundImage: "linear-gradient(to right, #1f2023, rgba(31,32,35,0))",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 640,
            height: "100%",
            paddingLeft: 72,
            color: "#f2f2f0",
          }}
        >
          <div style={{ fontFamily: "DM Sans", fontSize: 22, letterSpacing: 4, color: "#e8b28f" }}>
            PORTFOLIO
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 20,
              fontFamily: "Space Grotesk",
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <span>Priyanshu</span>
            <span style={{ color: "#e8b28f" }}>Saini.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              maxWidth: 420,
              fontFamily: "DM Sans",
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(242,242,240,0.75)",
            }}
          >
            CS student who builds full stack web apps.
          </div>
          <div style={{ marginTop: 36, fontFamily: "DM Sans", fontSize: 20, color: "rgba(242,242,240,0.5)" }}>
            MERN · Next.js · Claude API · GDG on Campus
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" },
        { name: "DM Sans", data: dmSans, weight: 400, style: "normal" },
      ],
    }
  );
}
