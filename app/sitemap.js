// Served as /sitemap.xml: the list of pages Google Search Console is given to
// crawl. The site is one page, so it's one entry. Built once per deploy, so
// lastModified is the date of the latest deploy.
export default function sitemap() {
  return [
    {
      url: "https://priyanshu4849.me",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
