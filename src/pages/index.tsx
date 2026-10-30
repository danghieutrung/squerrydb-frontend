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
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-5 pt-5 text-center">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card/70 px-2.5 py-0.5 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Episode ratings, visualized
          </span>
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            See how every episode{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              really stacks up
            </span>
          </h1>
          <p className="mt-2 max-w-lg text-balance text-sm text-muted-foreground">
            SquerryDB charts the IMDb rating of every episode of a TV series, so
            you can spot the peaks, the slumps and the season that lost the
            plot.
          </p>

          <SearchBox
            variant="hero"
            placeholder="Try “Breaking Bad”"
            autoFocus
            className="mt-4 max-w-xl"
          />

          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-muted-foreground">Popular:</span>
            {EXAMPLES.map(({ title, tconst }) => (
              <Link
                key={tconst}
                href={`/chart/${tconst}`}
                className="rounded-full border bg-card px-2.5 py-0.5 transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-5 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="rounded-xl border bg-card p-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-md shadow-primary/25">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-[11px] font-medium leading-none text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <h2 className="mt-1 text-sm font-semibold leading-tight">
                    {title}
                  </h2>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
