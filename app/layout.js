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

export const metadata = {
  title: "Priyanshu Saini — Portfolio",
  description: "Full-stack developer portfolio.",
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
