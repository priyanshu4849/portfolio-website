// Everything the "Ask me anything" chat is allowed to know. It answers ONLY from this
// text, so when something about me changes (a new project, a new role), update it here.
// The same facts appear on the site and in the resume PDF; this is the plain text copy
// that Claude reads. Keep it free of anything private: the chat repeats it to strangers.

export const ABOUT_ME = `
# Priyanshu Saini

## In one line
CS student at Galgotias University (Greater Noida, India), graduating in 2027, who builds
full stack web apps with the MERN stack and Next.js. Management Lead at GDG on Campus.
Looking for a remote internship.

## Contact
- Email: priyanshusaini4849@gmail.com
- LinkedIn: https://www.linkedin.com/in/priyanshu-saini-90ab17270
- GitHub: https://github.com/priyanshu4849
- Website: https://priyanshu4849.me
- Resume (PDF): https://priyanshu4849.me/Priyanshu_Saini_Resume.pdf

## Education
- B.Tech in Computer Science Engineering, Galgotias University, Greater Noida, Uttar Pradesh.
  Expected graduation: 2027.

## What he's looking for
- A remote software engineering internship, ideally full stack or frontend. He graduates
  in 2027. The fastest way to reach him is email or a LinkedIn message.

## Skills (and where each was used)
- Frontend: React, Next.js, Tailwind CSS, Motion (used in the ATS Resume Builder and this portfolio).
- Backend: Node.js, Express, REST APIs, JWT authentication (used in the ATS Resume Builder's API).
- Data and AI: MongoDB, Claude API (used for resume scoring and bullet point rewrites).
- Languages: JavaScript, Python (Pandas), SQL (basics).
- Tools: Git and GitHub, Postman, Vercel, Render.
- Concepts: REST APIs, JWT auth, API and LLM integration, DOM manipulation, middleware and
  routing, testing with Jest.
- Learning now: Harkirat Singh's 100xDevs cohort (MERN stack). TypeScript and WebSockets
  are next. He does NOT yet claim TypeScript or WebSockets as skills.
- Not on his list (so don't claim them): Java, C++, Go, Rust, Docker, Kubernetes, AWS, React
  Native, GraphQL. If asked about these, say he hasn't listed them.

## Projects
### ATS Resume Builder (his main project; built solo, from first commit to live site)
- Live: https://ats-resume-builder-ten-xi.vercel.app
- Code: https://github.com/priyanshu4849/ats-resume-builder
- What it does: upload a resume (PDF or DOCX) and paste a job description. It scores the
  resume against the job (ATS score), highlights weak bullet points, and uses the Claude API
  to rewrite them. The result exports as a PDF that applicant tracking systems can read.
- Stack: React, Node.js, Express, MongoDB, Claude API, JWT auth, Tailwind CSS, Motion.
- Details: file upload and parsing with Multer, pdf-parse and Mammoth; JWT authenticated REST
  APIs hardened with rate limiting, Helmet security headers, NoSQL injection guards and Jest
  tests; PDF export with Puppeteer; backend on Render, frontend on Vercel.
- Hardest bug: PDF export worked locally but broke on Render. Puppeteer couldn't find
  Chrome because Render's build cache skipped the browser download. Fix: give Puppeteer its
  own cache folder inside the project and force the download in a postinstall script.

### This portfolio website (priyanshu4849.me), built solo
- Code: https://github.com/priyanshu4849/portfolio-website
- Next.js 16, Tailwind CSS v4, Motion, deployed on Vercel. Features: an anime style hero
  video of me (it types priyanshu.init(), then I appear) that plays once and zooms into
  a card as you scroll, a pinned
  scroll walkthrough of the ATS project, a bento Skills grid, a live GitHub activity tile,
  smooth scrolling (Lenis), magnetic buttons, a reduced motion fallback, a Content
  Security Policy and security headers, an automated test suite that checks the live site,
  Vercel analytics, auto generated link preview images, and this chat (Claude API).

### SentraSec AI (team project, 2nd Runner Up at GDG Noida DevFest Buildathon 2025)
- Live: https://sec-sentra-ai-frontend.vercel.app
- Code: https://github.com/Snehadas2005/devfest-security-suite
- A cybersecurity dashboard with four tools built on Gemini: a phishing detector, a code
  vulnerability scanner, a cloud config risk analyzer and a risk classifier.
- Stack: Next.js, TypeScript, FastAPI, Python, Gemini API, Firebase, Tailwind CSS.
- His role: product and the pitch. He decided which features went in, tested the flows and
  presented to the judges. Teammates wrote most of the code.

## Leadership and community
- Management Lead, GDG on Campus (Google Developer Groups), Galgotias University, since
  September 2025. Plans hackathons and workshops and makes sure they happen.
- Ran 12 events so far, including TechSprint, a 36 hour offline hackathon with about 300
  participants.
- Coordinates a 26 member volunteer team and owns event operations: venues, logistics,
  scheduling and speakers.
- About 100 students earned Google swag through the Solution Challenge he helped run.
- Member of TechnoJam (a university tech club), December 2023 to April 2025.

## Courses
- 100xDevs by Harkirat Singh: MERN stack development cohort (in progress).
`.trim();
