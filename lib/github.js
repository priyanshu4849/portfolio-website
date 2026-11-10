// Reads my public GitHub activity for the "On GitHub" tile in Skills. Runs only on the
// server, when the page is built and then again at most once a day (see `revalidate` in
// app/page.js), so visitors never wait on GitHub and GitHub sees about one visit a day.
//
// Two public sources, neither needs a login or a key:
//   1. github.com/users/<name>/contributions: the same calendar shown on my GitHub
//      profile. It's HTML, not an official API, so if GitHub ever changes it the parse
//      finds nothing and the tile falls back to a plain link (it never breaks the page).
//   2. api.github.com/users/<name>/repos: the official API, for the latest pushed repo.

export const GITHUB_USER = "priyanshu4849";

// How many weeks the tile shows. My activity starts in August 2026, so a full year
// would be mostly empty squares; 16 weeks covers the real work, and the tile says so.
export const WEEKS = 16;

const DAY = 24 * 60 * 60 * 1000;
const HEADERS = { "User-Agent": "priyanshu4849.me portfolio" };
// Cache each request for a day, the same as the page
const CACHE = { next: { revalidate: 86400 } };

export async function getGitHubActivity() {
  const [weeks, lastPush] = await Promise.all([getCalendar(), getLastPush()]);
  // Without the calendar there's nothing worth drawing: the tile shows its fallback link
  if (!weeks) return null;

  const days = weeks.flat().filter(Boolean);
  return {
    weeks,
    total: days.reduce((sum, d) => sum + d.count, 0),
    activeDays: days.filter((d) => d.count > 0).length,
    lastPush,
  };
}

async function getCalendar() {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(8000),
      ...CACHE,
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Each day is a cell like:
    //   <td data-date="2026-10-04" id="contribution-day-component-6-47" data-level="2">
    // and its count is in a matching tooltip:
    //   <tool-tip for="contribution-day-component-6-47">3 contributions on October 4th.
    const counts = new Map();
    for (const [, id, text] of html.matchAll(/for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)/g)) {
      const n = text.match(/^(\d+) contribution/);
      counts.set(id, n ? Number(n[1]) : 0);
    }
    const days = [];
    for (const [, date, id, level] of html.matchAll(
      /data-date="(\d{4}-\d{2}-\d{2})" id="(contribution-day-component-[\d-]+)" data-level="(\d)"/g,
    )) {
      days.push({ date, level: Number(level), count: counts.get(id) ?? 0 });
    }
    if (days.length < WEEKS * 7) return null;

    // Group into weeks that start on Sunday, like GitHub's grid, and keep the last WEEKS.
    // Each week is 7 slots (Sun to Sat); days that haven't happened yet stay null.
    days.sort((a, b) => a.date.localeCompare(b.date));
    const byWeek = new Map();
    for (const day of days) {
      const d = new Date(`${day.date}T00:00:00Z`);
      const weekStart = new Date(d.getTime() - d.getUTCDay() * DAY).toISOString().slice(0, 10);
      if (!byWeek.has(weekStart)) byWeek.set(weekStart, Array(7).fill(null));
      byWeek.get(weekStart)[d.getUTCDay()] = day;
    }
    return [...byWeek.values()].slice(-WEEKS);
  } catch {
    return null; // offline, timed out, or GitHub is down: the tile shows its fallback
  }
}

async function getLastPush() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=10`,
      { headers: { ...HEADERS, Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(8000), ...CACHE },
    );
    if (!res.ok) return null;
    const repo = (await res.json()).find((r) => !r.fork && !r.private);
    return repo ? { name: repo.name, url: repo.html_url, pushedAt: repo.pushed_at } : null;
  } catch {
    return null;
  }
}
