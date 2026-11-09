import NotFound from "@/components/NotFound";

// Shown for any address that doesn't exist on the site. It sits inside the normal
// layout, so the nav, fonts and black theme are all already there. Next.js sends it with
// a real 404 status and adds <meta name="robots" content="noindex">, so Google never
// lists a broken link as a page of the site.
export const metadata = {
  title: "Page not found · Priyanshu Saini",
};

export default function NotFoundPage() {
  return <NotFound />;
}
