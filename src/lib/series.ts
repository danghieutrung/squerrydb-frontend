import { Episode, ScatterEpisode } from "./types";

export const SEASON_COLORS = [
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#ea580c",
  "#16a34a",
  "#4f46e5",
  "#ca8a04",
  "#c026d3",
  "#0d9488",
  "#e11d48",
];

export function seasonColor(season: number) {
  return SEASON_COLORS[(Math.max(season, 1) - 1) % SEASON_COLORS.length];
}

export type SeasonSummary = {
  season: number;
  episodes: ScatterEpisode[];
  average: number;
  best: ScatterEpisode;
  worst: ScatterEpisode;
};

// Lays episodes out on one continuous x axis and groups them by season.
export function summarizeSeasons(episodes: Episode[]): SeasonSummary[] {
  const bySeason = new Map<number, ScatterEpisode[]>();

  episodes.forEach((ep, index) => {
    const points = bySeason.get(ep.seasonnumber) ?? [];
    points.push({
      x: index + 1,
      y: ep.averagerating,
      rating: ep.averagerating,
      numvotes: ep.numvotes,
      season: ep.seasonnumber,
      episode: ep.episodenumber,
      primarytitle: ep.primarytitle,
      tconst: ep.tconst,
      color: seasonColor(ep.seasonnumber),
    });
    bySeason.set(ep.seasonnumber, points);
  });

  return Array.from(bySeason, ([season, points]) => ({
    season,
    episodes: points,
    average: points.reduce((sum, p) => sum + p.rating, 0) / points.length,
    best: points.reduce((a, b) => (b.rating > a.rating ? b : a)),
    worst: points.reduce((a, b) => (b.rating < a.rating ? b : a)),
  }));
}

export function episodeCode(ep: Pick<ScatterEpisode, "season" | "episode">) {
  return `S${ep.season} · E${ep.episode}`;
}
