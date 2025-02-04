export type Episode = {
  tconst: string;
  parenttconst: string;
  seasonnumber: number;
  episodenumber: number;
  titletype: string;
  primarytitle: string;
  originaltitle: string;
  isadult: boolean;
  startyear?: number | null;
  endyear?: number | null;
  runtimeminutes?: number | null;
  genres?: string | null;
  averagerating: number;
  numvotes: number;
};

export type Series = {
  tconst: string;
  titletype: string;
  primarytitle: string;
  originaltitle: string;
  isadult: boolean;
  startyear?: number | null;
  endyear?: number | null;
  runtimeminutes?: number | null;
  genres?: string | null;
  averagerating: number;
  numvotes: number;
  episodes: Episode[];
};

export type ScatterEpisode = {
  x: number;
  y: number;
  rating: number;
  numvotes?: number | null;
  season: number;
  episode: number;
  primarytitle: string;
  tconst: string;
  color: string;
};

export type LegendPayload = {
  value: string;
};

export type BarProps = Record<string, string|boolean>;

export type BestFitLine = {
  x: number;
  y: number;
}[];
