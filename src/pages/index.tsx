import Link from "next/link";
import { BarChart3, MousePointerClick, Search, Sparkles } from "lucide-react";

import { Layout } from "@/components/Layout";
import { SearchBox } from "@/components/SearchBox";

const EXAMPLES = [
  { title: "Breaking Bad", tconst: "tt0903747" },
  { title: "Game of Thrones", tconst: "tt0944947" },
  { title: "The Office", tconst: "tt0386676" },
  { title: "Friends", tconst: "tt0108778" },
  { title: "Succession", tconst: "tt7660850" },
];

const STEPS = [
  {
    icon: Search,
    title: "Find a show",
    text: "Search any TV series in the IMDb catalogue by name.",
  },
  {
    icon: BarChart3,
    title: "See every episode",
    text: "Each dot is one episode, coloured by season, with a trend line per season.",
  },
  {
    icon: MousePointerClick,
    title: "Dig in",
    text: "Hover for votes and titles, toggle seasons, and click a dot to open it on IMDb.",
  },
];

export default function Home() {
  return (
    <Layout showSearch={false}>
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-x-0 -top-40 mx-auto h-[32rem] max-w-4xl rounded-full bg-gradient-to-br from-violet-300/50 via-purple-200/40 to-fuchsia-200/30 blur-3xl" />
        </div>
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-14 pt-8 text-center sm:pt-12">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Episode ratings, visualized
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            See how every episode{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              really stacks up
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-balance text-lg text-muted-foreground">
            SquerryDB charts the IMDb rating of every episode of a TV series, so
            you can spot the peaks, the slumps and the season that lost the
            plot.
          </p>

          <SearchBox
            variant="hero"
            placeholder="Try “Breaking Bad”"
            autoFocus
            className="mt-8 max-w-xl"
          />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {EXAMPLES.map(({ title, tconst }) => (
              <Link
                key={tconst}
                href={`/chart/${tconst}`}
                className="rounded-full border bg-card px-3 py-1 transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="rounded-2xl border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Step {index + 1}
                </span>
              </div>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
