import Head from "next/head";
import { Mail } from "lucide-react";

import { CONTACT_EMAIL, IMDB_DATASETS_URL, SOCIAL_LINKS } from "@/lib/links";
import { NavBar } from "./NavBar";

type LayoutProps = {
  title?: string;
  showSearch?: boolean;
  children: React.ReactNode;
};

export function Layout({ title, showSearch = true, children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>{title ? `${title} · SquerryDB` : "SquerryDB"}</title>
      </Head>
      <NavBar showSearch={showSearch} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p>
            <span className="font-medium text-foreground">SquerryDB</span> ·
            Episode ratings for every TV series on IMDb.
          </p>
          <p className="text-xs">
            Data from the{" "}
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
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 hover:text-primary sm:mr-2"
          >
            <Mail className="h-4 w-4" />
            {CONTACT_EMAIL}
          </a>
          <div className="-ml-2 flex items-center gap-1 sm:ml-0">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="rounded-lg p-2 transition-colors hover:bg-accent hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
