import { useMemo } from "react";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import {
  AlertTriangle,
  ExternalLink,
  Film,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Layout } from "@/components/Layout";
import { StatusMessage } from "@/components/StatusMessage";
import SquerryChart from "@/components/SquerryChart";
import { ScatterEpisode, Series } from "@/lib/types";
import { formatRating, formatVotes, formatYears } from "@/lib/format";
import { episodeCode, SeasonSummary, summarizeSeasons } from "@/lib/series";
import { imdbTitleUrl } from "@/lib/links";

const GET_RATINGS = gql`
  query GetRatingByTconst($tconst: String!) {
    getRatings(tconst: $tconst) {
      tconst
      titletype
      primarytitle
      startyear
      endyear
      genres
      averagerating
      numvotes
      episodes {
        tconst
        primarytitle
        seasonnumber
        episodenumber
        averagerating
        numvotes
      }
    }
  }
`;

export default function ChartPage() {
  const router = useRouter();
  const tconst =
    typeof router.query.tconst === "string" ? router.query.tconst : "";

  const { data, loading, error } = useQuery(GET_RATINGS, {
    variables: { tconst },
    skip: !tconst,
  });

  const series: Series | undefined = data?.getRatings;
  const seasons = useMemo(
    () => summarizeSeasons(series?.episodes ?? []),
    [series],
  );

  if (!router.isReady || loading) {
    return (
      <Layout title="Loading">
        <ChartSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <StatusMessage
          icon={AlertTriangle}
          title="Something went wrong"
          description="We couldn't load this series. Please try again in a moment."
        />
      </Layout>
    );
  }

  if (!series) {
    return (
      <Layout title="Series not found">
        <StatusMessage
          icon={Film}
          title="Series not found"
          description="This link doesn't match any series we know about. Try searching for it instead."
        />
      </Layout>
    );
  }

  return (
    <Layout title={series.primarytitle}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SeriesHeader series={series} seasons={seasons} />

        {seasons.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-card p-10 text-center text-muted-foreground">
            No episodes of this series have IMDb ratings yet.
          </div>
        ) : (
          <>
            <section className="mt-8 rounded-2xl border bg-card p-4 sm:p-6">
              <h2 className="mb-4 font-semibold">Episode ratings</h2>
              <SquerryChart seasons={seasons} />
            </section>

            <Highlights seasons={seasons} />
            <SeasonTable seasons={seasons} />
          </>
        )}
      </div>
    </Layout>
  );
}

function SeriesHeader({
  series,
  seasons,
}: {
  series: Series;
  seasons: SeasonSummary[];
}) {
  const genres = series.genres?.split(",").filter(Boolean) ?? [];
  const episodeCount = series.episodes.length;

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">
          {formatYears(series.startyear, series.endyear)}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {series.primarytitle}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {genre}
            </span>
          ))}
          <span className="text-sm text-muted-foreground">
            {seasons.length} {seasons.length === 1 ? "season" : "seasons"} ·{" "}
            {episodeCount} {episodeCount === 1 ? "episode" : "episodes"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-4xl font-bold tabular-nums text-primary">
            {formatRating(series.averagerating)}
            <span className="text-base font-medium text-muted-foreground">
              /10
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {formatVotes(series.numvotes)}
          </p>
        </div>
        <a
          href={imdbTitleUrl(series.tconst)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          IMDb
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

function Highlights({ seasons }: { seasons: SeasonSummary[] }) {
  const best = seasons
    .map((s) => s.best)
    .reduce((a, b) => (b.rating > a.rating ? b : a));
  const worst = seasons
    .map((s) => s.worst)
    .reduce((a, b) => (b.rating < a.rating ? b : a));
  const bestSeason = seasons.reduce((a, b) => (b.average > a.average ? b : a));

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-3">
      <EpisodeCard
        label="Highest rated episode"
        icon={TrendingUp}
        episode={best}
      />
      <EpisodeCard
        label="Lowest rated episode"
        icon={TrendingDown}
        episode={worst}
      />
      <div className="rounded-2xl border bg-card p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Best season
        </p>
        <p className="mt-3 text-2xl font-semibold tabular-nums">
          {bestSeason.average.toFixed(2)}
        </p>
        <p className="mt-1 text-sm">
          Season {bestSeason.season}{" "}
          <span className="text-muted-foreground">
            · {bestSeason.episodes.length} episodes
          </span>
        </p>
      </div>
    </section>
  );
}

function EpisodeCard({
  label,
  icon: Icon,
  episode,
}: {
  label: string;
  icon: typeof TrendingUp;
  episode: ScatterEpisode;
}) {
  return (
    <a
      href={imdbTitleUrl(episode.tconst)}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold tabular-nums">
        {episode.rating.toFixed(1)}
      </p>
      <p className="mt-1 truncate text-sm group-hover:text-primary">
        <span className="text-muted-foreground">{episodeCode(episode)} ·</span>{" "}
        {episode.primarytitle}
      </p>
    </a>
  );
}

function SeasonTable({ seasons }: { seasons: SeasonSummary[] }) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border bg-card">
      <h2 className="px-5 pt-5 font-semibold sm:px-6">Season by season</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium sm:px-6">Season</th>
              <th className="hidden px-3 py-3 text-right font-medium sm:table-cell">
                Episodes
              </th>
              <th className="px-3 py-3 text-right font-medium">Average</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell sm:px-6">
                Best episode
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {seasons.map(({ season, episodes, average, best }) => (
              <tr key={season} className="hover:bg-accent/40">
                <td className="whitespace-nowrap px-5 py-3 font-medium sm:px-6">
                  <span
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: episodes[0].color }}
                  />
                  Season {season}
                </td>
                <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">
                  {episodes.length}
                </td>
                <td className="px-3 py-3 text-right font-medium tabular-nums">
                  {average.toFixed(2)}
                </td>
                <td className="hidden max-w-[16rem] truncate px-5 py-3 sm:table-cell sm:px-6">
                  <a
                    href={imdbTitleUrl(best.tconst)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <span className="tabular-nums text-muted-foreground">
                      {best.rating.toFixed(1)}
                    </span>{" "}
                    {best.primarytitle}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChartSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-3 h-9 w-72 rounded bg-muted" />
      <div className="mt-4 h-5 w-48 rounded bg-muted" />
      <div className="mt-8 h-[28rem] rounded-2xl border bg-card" />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-2xl border bg-card" />
        ))}
      </div>
    </div>
  );
}
