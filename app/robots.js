// Served as /robots.txt. Tells search engines they may crawl the whole site
// and where the sitemap is. Nothing on the site is private, so nothing is disallowed.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://priyanshu4849.me/sitemap.xml",
  };
}
