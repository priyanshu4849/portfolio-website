import Hero from "@/components/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Community from "@/components/Community";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      {/* The reading progress bar lives here, not in the layout: on a page too short to
          scroll (like the 404) it has nothing to measure and showed as a full bar. */}
      <ScrollProgress />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Community />
      <Contact />
    </main>
  );
}
