import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";

// Space Grotesk for headings, DM Sans for everything else — both are variable
// fonts, so no `weight` list is needed.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const description =
  "CS student and full-stack developer building AI-powered web apps with MERN and Next.js. Management Lead at GDG on Campus, Galgotias University.";

// metadataBase turns relative URLs (like the generated opengraph-image) into
// absolute ones — link-preview crawlers can't follow a bare "/opengraph-image".
// The image itself comes from app/opengraph-image.js, so it isn't listed here.
export const metadata = {
  metadataBase: new URL("https://portfolio-website-ats-resume.vercel.app"),
  title: "Priyanshu Saini — Portfolio",
  description,
  openGraph: {
    title: "Priyanshu Saini — Full-stack developer",
    description,
    url: "/",
    siteName: "Priyanshu Saini",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyanshu Saini — Full-stack developer",
    description,
  },
};

// Tints the mobile browser's address bar to match the page background.
export const viewport = {
  themeColor: "#1f2023",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollProgress />
        <Nav />
        {children}
      </body>
    </html>
  );
}
