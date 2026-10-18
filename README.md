# Priyanshu Saini · Portfolio

My personal portfolio site. It has a full screen, AI animated 3D version of me in the hero, plus the projects I've built and the community work I do on campus.

**Live:** [portfolio-website-ats-resume.vercel.app](https://portfolio-website-ats-resume.vercel.app)

![Portfolio preview](https://portfolio-website-ats-resume.vercel.app/opengraph-image)

## Highlights

- **3D animated hero.** I turned a photo of myself into a 3D character with Google Flow, then animated it into a 10 second loop. It plays as a muted `<video>` (no live 3D model), so it loads fast. The poster is the video's own first frame, so you never see the still swap to the video.
- **Cursor tracking glow** that follows the mouse with spring physics. It's hidden on touchscreens, where there's no cursor to follow.
- **Scroll animations** built with Motion: a parallax zoom and fade on the hero, staggered reveals as each section scrolls in, and a progress bar at the top of the page.
- **Accessible motion.** If you've turned on "reduce motion" in your OS, you get the still image instead of the video.
- **Resume download** from the hero and the contact section.
- **Link previews.** The Open Graph image is generated at build time with `ImageResponse`, so links shared on LinkedIn, WhatsApp, or X show a proper card.
- **Projects defined as data.** Each project card is built from a list, with optional fields for awards, my role on team projects, and a "hardest bug" callout.
- **Mobile first.** The hero uses `svh` units so mobile browser toolbars don't cut it off.

## Sections

| # | Section | What's there |
|---|---------|--------------|
| 01 | About | Who I am, my photo, and what I'm working on right now |
| 02 | Skills | Grouped by what they do, with where I've actually used each one |
| 03 | Projects | [ATS Resume Builder](https://github.com/priyanshu4849/ats-resume-builder) and SentraSec AI (2nd runner up, GDG Noida DevFest Buildathon 2025) |
| 04 | Community | My role as Management Lead at GDG on Campus, Galgotias University |
| 05 | Contact | Resume, email, GitHub, LinkedIn |

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- React 19
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion](https://motion.dev) (formerly Framer Motion)
- Space Grotesk and DM Sans via `next/font`
- Deployed on [Vercel](https://vercel.com). Every push to `main` deploys automatically.

## Project structure

```
app/
  layout.js             fonts, SEO and Open Graph metadata, nav, scroll progress bar
  page.js               puts all the sections together
  opengraph-image.js    generates the link preview card
  globals.css           color palette and theme tokens
components/
  Hero.jsx              video, cursor glow, parallax, call to action buttons
  About.jsx
  Skills.jsx
  Projects.jsx          project cards, built from a data list
  Community.jsx
  Contact.jsx
  SectionHeading.jsx    shared numbered heading ("01 / About")
  Nav.jsx
  ScrollProgress.jsx
public/                 hero video and poster, profile photo, project screenshots, resume
```

## Run it locally

```bash
git clone https://github.com/priyanshu4849/portfolio-website.git
cd portfolio-website
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Tests

`tests/site.test.mjs` checks the built site: security headers, private files returning 404, safe external links, alt text, the resume and video loading, no secrets in the shipped JavaScript, and no GPS location in the photos. It uses Node's built in test runner, so there's nothing extra to install.

```bash
npm run build && npm start   # terminal 1
npm test                     # terminal 2

# or test the live site
BASE_URL=https://portfolio-website-ats-resume.vercel.app npm test
```

## Contact

- Email: [priyanshusaini4849@gmail.com](mailto:priyanshusaini4849@gmail.com)
- LinkedIn: [Priyanshu Saini](https://www.linkedin.com/in/priyanshu-saini-90ab17270)
- GitHub: [@priyanshu4849](https://github.com/priyanshu4849)
