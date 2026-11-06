"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

// A "bento" grid: tiles of different sizes that fit together into one rectangle, the
// way Apple lays out feature summaries. The big tile says what I do most (frontend);
// the small ones fill in the rest. Each group still says where I've actually used it.
//
// Desktop (lg) is a 6 column grid:
//   ┌──────────────────────┬──────────┐
//   │ Frontend (4 x 2)     │ Data & AI│
//   │                      ├──────────┤
//   │                      │ Tools    │
//   ├──────────┬───────────┴──────────┤
//   │ Backend  │ Learning next (4)    │
//   └──────────┴──────────────────────┘
// Tablets (sm) use 2 columns with Frontend across the top; phones stack everything.

const pillClass =
  "rounded-full border border-foreground/15 bg-foreground/5 px-3.5 py-1.5 text-sm font-medium";

// The "Learning next" tile's track, in order. Matches the "Learning" line in About.
const learningTrack = [
  { title: "100xDevs", note: "Now" },
  { title: "TypeScript", note: "Next" },
  { title: "WebSockets", note: "Next" },
];

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Skills() {
  return (
    <section id="skills" className="border-b border-foreground/10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="02"
          label="Skills"
          title="What I work with."
          subtitle="Each group says where I've used it."
        />

        <motion.ul
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          {/* The big tile */}
          <Tile className="sm:col-span-2 lg:col-span-4 lg:row-span-2">
            <TileHeader title="Frontend" usedIn="ATS Resume Builder, this portfolio" />
            {/* Phones: a wrapping row, so a name like "Tailwind CSS" never breaks in half.
                Wider screens: a tidy 2 x 2 grid. */}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 sm:grid sm:grid-cols-2">
              {["React", "Next.js", "Tailwind CSS", "Motion"].map((skill) => (
                <li key={skill} className="flex items-center gap-3 whitespace-nowrap font-display text-2xl font-bold sm:text-3xl">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
                  {skill}
                </li>
              ))}
            </ul>
            {/* A real snippet from this site's hero (components/Hero.jsx), so the tile shows
                the work instead of just naming the tools. mt-auto pushes it to the bottom of
                the tile however tall the grid row ends up. */}
            <figure className="mt-auto pt-8">
              {/* Short enough (longest line 37 characters) to fit a phone at 11px without
                  scrolling sideways. */}
              <pre className="overflow-x-auto rounded-2xl border border-foreground/10 bg-black/60 p-4 font-mono text-[11px] leading-relaxed text-foreground/60 sm:text-[13px]">
                <code>
                  <span className="text-foreground/90">useScroll</span>({"{"}
                  {"\n"}  target: sectionRef,
                  {"\n"}  offset: [<span className="text-emerald-300/80">&quot;start start&quot;</span>,{" "}
                  <span className="text-emerald-300/80">&quot;end end&quot;</span>],
                  {"\n"}
                  {"}"})
                </code>
              </pre>
              <figcaption className="mt-2 text-xs text-foreground/40">
                From this site: the scroll that zooms the hero out.
              </figcaption>
            </figure>
          </Tile>

          <Tile className="lg:col-span-2">
            <TileHeader title="Data & AI" usedIn="Resume scoring and bullet rewrites" />
            <Pills skills={["MongoDB", "Claude API"]} />
          </Tile>

          <Tile className="lg:col-span-2">
            <TileHeader title="Tools" usedIn="Every project" />
            <Pills skills={["Git & GitHub", "Postman", "Vercel"]} />
          </Tile>

          <Tile className="lg:col-span-2">
            <TileHeader title="Backend" usedIn="The ATS Resume Builder's API" />
            <Pills skills={["Node.js", "Express", "REST APIs", "JWT Auth"]} />
            {/* A real route from the ATS Resume Builder's server (server/routes/resumes.js) */}
            <p className="mt-auto flex flex-wrap items-center gap-2 pt-5 font-mono text-xs text-foreground/50">
              <span className="rounded-md bg-accent/15 px-1.5 py-0.5 font-semibold text-accent">POST</span>
              /api/resumes/:id/analyze
              <span className="text-emerald-300/80">200</span>
            </p>
          </Tile>

          {/* Same facts as the "Learning" line in About, drawn as a short track: the filled
              dot is where I am now, the hollow ones are what's coming. Hollow means not yet,
              so these aren't skills I'm claiming. */}
          <Tile className="lg:col-span-4">
            <TileHeader title="Learning next" usedIn="Through Harkirat Singh's 100xDevs cohort" usedInLabel="How" />
            <ol className="relative mt-auto grid grid-cols-3 pt-8">
              {/* The line behind the dots: solid peach up to "now", faint after it */}
              <div aria-hidden="true" className="absolute top-[calc(2rem+5px)] right-[16.67%] left-[16.67%] h-px bg-foreground/15" />
              {learningTrack.map((step, i) => (
                <li key={step.title} className="relative flex flex-col items-center text-center">
                  <span
                    aria-hidden="true"
                    className={`size-[11px] rounded-full ${
                      i === 0 ? "bg-accent shadow-[0_0_0_4px_rgba(232,178,143,0.15)]" : "border border-foreground/30 bg-background"
                    }`}
                  />
                  <span className={`mt-3 text-sm font-medium ${i === 0 ? "text-foreground" : "text-foreground/70"}`}>
                    {step.title}
                  </span>
                  <span className="mt-0.5 text-xs text-foreground/40">{step.note}</span>
                </li>
              ))}
            </ol>
          </Tile>
        </motion.ul>
      </div>
    </section>
  );
}

// One tile of the grid, with a soft peach light that follows the cursor and a matching
// glow on its edge. The cursor position is written into two CSS variables (--x, --y)
// directly on the element, so moving the mouse never re-renders React.
function Tile({ className = "", children }) {
  function handlePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.li
      variants={tileVariants}
      onPointerMove={handlePointerMove}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-b from-foreground/[0.06] to-foreground/[0.02] p-6 sm:p-7 ${className}`}
    >
      {/* The light inside the tile. Only on devices with a real hover pointer: on a phone a
          tap would leave it stuck where the finger was. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
        style={{
          background: "radial-gradient(420px circle at var(--x) var(--y), rgba(232,178,143,0.10), transparent 45%)",
        }}
      />
      {/* The lit edge: the same gradient, but masked so only a 1px border shows. The mask
          keeps the padding box (the 1px ring) and cuts away the content box inside it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl p-px opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
        style={{
          background: "radial-gradient(260px circle at var(--x) var(--y), rgba(232,178,143,0.55), transparent 60%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </motion.li>
  );
}

function TileHeader({ title, usedIn, usedInLabel = "Used in" }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-widest text-accent">{title}</h3>
      <p className="mt-2 text-sm text-foreground/50">
        {usedInLabel}: {usedIn}
      </p>
    </div>
  );
}

function Pills({ skills }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <li key={skill} className={pillClass}>
          {skill}
        </li>
      ))}
    </ul>
  );
}
