import Hero from "@/components/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import { getGitHubActivity } from "@/lib/github";

// The page is still built ahead of time (fast for visitors), but Next.js rebuilds it in
// the background at most once a day, so the GitHub tile in Skills stays current.
// 86400 seconds = 24 hours. It has to be a plain number here, not a calculation.
export const revalidate = 86400;

export default async function Home() {
  // null when GitHub can't be reached: the tile then shows a plain link instead
  const github = await getGitHubActivity();

  return (
    <main>
      {/* The reading progress bar lives here, not in the layout: on a page too short to
          scroll (like the 404) it has nothing to measure and showed as a full bar. */}
      <ScrollProgress />
      <Hero />
      <About />
      <Skills github={github} />
      <Projects />
      <Community />
      <Contact />
    </main>
  );
}
