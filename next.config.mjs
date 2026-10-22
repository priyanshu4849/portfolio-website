const isDev = process.env.NODE_ENV === "development";

// Content Security Policy: tells the browser which sources this site is allowed
// to load from. Everything here is self-hosted (fonts via next/font, images,
// the hero video, Vercel Analytics at /_vercel/insights), so 'self' covers it.
// 'unsafe-inline' is needed because Next.js inlines small scripts into static
// pages; the stricter nonce-based setup would force every page to render on
// each request. In dev, Analytics loads its debug script from Vercel's CDN.
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  media-src 'self';
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp.replace(/\s{2,}/g, " ").trim() },
  // Stops other sites from embedding this one in an <iframe> (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Stops browsers from guessing a file's type, e.g. running a .jpg as a script
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites see only "came from <this domain>", never the full URL
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site never needs these, so no script on it can ask for them
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// The site's old Vercel addresses. Links shared before the custom domain still
// point here, so send them (and search engines) to the same page on the new one.
// Preview deployments use other *.vercel.app names, so they keep working.
const oldHosts = ["portfolio-website-ats-resume.vercel.app", "portfolio-website-six-iota-29.vercel.app"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Drops the "X-Powered-By: Next.js" header, which only helps attackers fingerprint the stack
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return oldHosts.map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://priyanshu4849.me/:path*",
      permanent: true, // 308: browsers and Google treat the new URL as the real one
    }));
  },
};

export default nextConfig;
