"use client";

import { useState } from "react";
import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";
import { GITHUB_USER, WEEKS } from "@/lib/github";

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
//   │ Backend  │ On GitHub (4)        │
//   └──────────┴──────────────────────┘
// Tablets (sm) use 2 columns with Frontend across the top; phones stack everything.

const pillClass =
  "rounded-full border border-foreground/15 bg-foreground/5 px-3.5 py-1.5 text-sm font-medium";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// `github` comes from app/page.js (lib/github.js): my real activity, refreshed daily.
export default function Skills({ github }) {
  return (
    <section id="skills" className="border-b border-foreground/10 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
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

          <Tile className="lg:col-span-4">
            <GitHubActivity data={github} />
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

// The peach shade for each of GitHub's five activity levels (0 = nothing that day)
const levelClass = [
  "bg-foreground/[0.06]",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
];

// "Oct 4". Fixed to English and UTC so the server and the browser always agree.
function shortDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// The "On GitHub" tile: a grid of the last 16 weeks (a column per week, Sunday at the
// top), the totals, and the repo I pushed to most recently.
function GitHubActivity({ data }) {
  // The day under the cursor, shown in the line below the grid
  const [hovered, setHovered] = useState(null);
  const profile = `https://github.com/${GITHUB_USER}`;

  const header = (
    <div className="flex items-start justify-between gap-4">
      <TileHeader title="On GitHub" usedIn={`Every contribution from the last ${WEEKS} weeks`} usedInLabel={null} />
      <a
        href={profile}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-sm text-foreground/50 transition-colors hover:text-accent"
      >
        @{GITHUB_USER} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );

  // GitHub couldn't be reached when the page was built: just the header and a link
  if (!data) {
    return (
      <>
        {header}
        <a
          href={profile}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-8 text-sm font-medium text-accent hover:underline"
        >
          See my code on GitHub ↗
        </a>
      </>
    );
  }

  const { weeks, total, activeDays, lastPush } = data;
  const summary = `${plural(total, "contribution")} on ${plural(activeDays, "day")}`;
  // Under the grid: the dates it covers, or the day under the cursor
  const allDays = weeks.flat().filter(Boolean);
  const range = `${shortDate(allDays[0].date)} to ${shortDate(allDays.at(-1).date)}`;
  const caption = hovered
    ? `${hovered.count === 0 ? "No" : hovered.count} contribution${hovered.count === 1 ? "" : "s"} on ${shortDate(hovered.date)}`
    : range;

  return (
    <>
      {header}
      {/* Side by side only on wide screens. On a tablet the tile is half the width, and
          squeezing the stats in beside the grid shrank each square to under 7px. */}
      <div className="mt-auto flex flex-col gap-6 pt-8 lg:flex-row lg:items-end lg:justify-between">
        <figure className="w-full lg:max-w-[22rem]">
          {/* The grid is for sighted visitors; screen readers get the same facts as one
              sentence (the sr-only line). Columns are weeks, rows are Sunday to Saturday.
              The squares appear one week after another, left to right, the first time the
              tile scrolls into view. */}
          <motion.div
            aria-hidden="true"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            onPointerLeave={() => setHovered(null)}
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
          >
            {weeks.map((week, w) =>
              week.map((day, d) =>
                day ? (
                  <motion.span
                    key={day.date}
                    custom={w}
                    variants={{
                      hidden: { opacity: 0, scale: 0.4 },
                      show: (col) => ({ opacity: 1, scale: 1, transition: { duration: 0.4, delay: col * 0.035, ease: [0.16, 1, 0.3, 1] } }),
                    }}
                    onPointerEnter={() => setHovered(day)}
                    className={`aspect-square rounded-[3px] ${levelClass[day.level]} ${
                      hovered?.date === day.date ? "ring-1 ring-foreground/60" : ""
                    }`}
                  />
                ) : (
                  // A day that hasn't happened yet this week: keeps the slot, draws nothing
                  <span key={`${w}-${d}`} />
                ),
              ),
            )}
          </motion.div>
          <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs text-foreground/50" aria-hidden="true">
            <span>{caption}</span>
            {/* The colour key, like GitHub's: darkest is a day with nothing, brightest the busiest */}
            <span className="flex items-center gap-1">
              Less
              {levelClass.map((c) => (
                <span key={c} className={`size-2.5 rounded-[2px] ${c}`} />
              ))}
              More
            </span>
          </figcaption>
          <p className="sr-only">{`${summary} in the last ${WEEKS} weeks on GitHub.`}</p>
        </figure>

        {/* The numbers, and where the latest work went */}
        <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-4 lg:grid-cols-1 lg:text-right">
          <div>
            <dt className="text-xs text-foreground/40">Contributions</dt>
            <dd className="font-display text-3xl font-bold">{total}</dd>
          </div>
          <div>
            <dt className="text-xs text-foreground/40">Days active</dt>
            <dd className="font-display text-3xl font-bold">{activeDays}</dd>
          </div>
          {lastPush && (
            <div className="col-span-2 lg:col-span-1">
              <dt className="text-xs text-foreground/40">Last push · {shortDate(lastPush.pushedAt)}</dt>
              <dd className="mt-0.5 font-mono text-sm">
                <a
                  href={lastPush.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 transition-colors hover:text-accent"
                >
                  {lastPush.name}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </>
  );
}

function TileHeader({ title, usedIn, usedInLabel = "Used in" }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-widest text-accent">{title}</h3>
      <p className="mt-2 text-sm text-foreground/50">
        {/* usedInLabel={null} shows the line on its own, without a "Used in:" label */}
        {usedInLabel ? `${usedInLabel}: ` : ""}
        {usedIn}
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
