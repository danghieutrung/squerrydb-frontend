import Head from "next/head";
import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { CONTACT_EMAIL, IMDB_DATASETS_URL, SOCIAL_LINKS } from "@/lib/links";
import { NavBar } from "./NavBar";

type LayoutProps = {
  title?: string;
  showSearch?: boolean;
  // Keep the footer pinned to the bottom of the screen while scrolling.
  stickyFooter?: boolean;
  children: React.ReactNode;
};

export function Layout({
  title,
  showSearch = true,
  stickyFooter = false,
  children,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>{title ? `${title} · SquerryDB` : "SquerryDB"}</title>
      </Head>
      <NavBar showSearch={showSearch} />
      <main className="flex-1">{children}</main>
      <Footer sticky={stickyFooter} />
    </div>
  );
}

function Footer({ sticky }: { sticky: boolean }) {
  return (
    <footer
      className={cn(
        "border-t",
        sticky
          ? "sticky bottom-0 z-30 bg-background/90 backdrop-blur-md"
          : "bg-card/50"
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-medium text-foreground">SquerryDB</span> · Data
          from the{" "}
          <a
            href={IMDB_DATASETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            IMDb Non-Commercial Datasets
          </a>
          . Not affiliated with IMDb.
        </p>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mr-1 flex items-center gap-1.5 hover:text-primary"
          >
            <Mail className="h-3.5 w-3.5" />
            {CONTACT_EMAIL}
          </a>
          <div className="flex items-center">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="rounded-md p-1.5 transition-colors hover:bg-accent hover:text-primary"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
