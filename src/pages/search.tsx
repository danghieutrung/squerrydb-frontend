import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { AlertTriangle, ChevronRight, SearchX } from "lucide-react";

import { Layout } from "@/components/Layout";
import { StatusMessage } from "@/components/StatusMessage";
import { Series } from "@/lib/types";
import { formatVotes } from "@/lib/format";

const SEARCH_SERIES = gql`
  query searchSeries($name: String!) {
    searchSeries(name: $name) {
      tconst
      primarytitle
      startyear
      numvotes
    }
  }
`;

const PAGE_SIZE = 25;

export default function SearchPage() {
  const router = useRouter();
  const query =
    typeof router.query.query === "string" ? router.query.query : "";

  const { data, loading, error } = useQuery(SEARCH_SERIES, {
    variables: { name: query },
    skip: !router.isReady || !query,
  });

  return (
    <Layout title={query ? `“${query}”` : "Search"}>
      {error ? (
        <StatusMessage
          icon={AlertTriangle}
          title="Something went wrong"
          description="We couldn't reach the SquerryDB server. Please try again in a moment."
        />
      ) : !router.isReady || loading ? (
        <ResultsSkeleton />
      ) : !query || !data?.searchSeries?.length ? (
        <StatusMessage
          icon={SearchX}
          title={
            query ? `No series found for “${query}”` : "Search for a series"
          }
          description={
            query
              ? "Check the spelling or try a shorter part of the title."
              : "Type the name of any TV series to see its episode ratings."
          }
        />
      ) : (
        // Keyed by query so paging resets on a new search.
        <Results key={query} query={query} results={data.searchSeries} />
      )}
    </Layout>
  );
}

function Results({ query, results }: { query: string; results: Series[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const total = results.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium text-primary">Search results</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">“{query}”</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {total.toLocaleString("en")} series found
      </p>

      <ol className="mt-8 divide-y overflow-hidden rounded-2xl border bg-card">
        {results.slice(0, visible).map((series, index) => (
          <li key={series.tconst}>
            <Link
              href={`/chart/${series.tconst}`}
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/60"
            >
              <span className="w-8 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium group-hover:text-primary">
                  {series.primarytitle}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {series.startyear ?? "Unknown year"} ·{" "}
                  {formatVotes(series.numvotes)}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ol>

      {visible < total && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-xl border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
          >
            Show more
          </button>
          <p className="text-xs text-muted-foreground">
            Showing {visible.toLocaleString("en")} of{" "}
            {total.toLocaleString("en")}
          </p>
        </div>
      )}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-4 w-28 rounded bg-muted" />
      <div className="mt-3 h-8 w-64 rounded bg-muted" />
      <div className="mt-3 h-4 w-32 rounded bg-muted" />
      <div className="mt-8 divide-y rounded-2xl border bg-card">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="h-4 w-8 rounded bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-3 w-1/4 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
