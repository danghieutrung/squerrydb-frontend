import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, EyeOff } from "lucide-react";

import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ScatterEpisode } from "@/lib/types";
import { cn, computeBestFitLine } from "@/lib/utils";
import { episodeCode, SeasonSummary } from "@/lib/series";
import { formatVotes } from "@/lib/format";
import { imdbTitleUrl } from "@/lib/links";

const chartConfig = {} satisfies ChartConfig;

const axisTick = { fontSize: 12, fill: "hsl(var(--muted-foreground))" };

// Room left under the chart for the caption and card padding; the
// caption wraps to more lines on narrow screens.
const spaceBelow = () => (window.innerWidth < 640 ? 72 : 40);
const MIN_HEIGHT = 256;
const MAX_HEIGHT = 480;

// Smallest horizontal gap, in pixels, between two season labels on the x axis.
const MIN_TICK_GAP = 34;
// Width taken by the y axis and chart margins, i.e. not part of the plot area.
const PLOT_INSET = 36;

// Labels every season if there's room, otherwise every 2nd, 5th, 10th…
// season so the labels stay evenly spaced instead of randomly dropped.
function pickSeasonTicks(seasons: SeasonSummary[], lastX: number, width: number) {
  const pxPerEpisode = Math.max(width - PLOT_INSET, 1) / lastX;
  const starts = seasons.map((s) => ({ season: s.season, x: s.episodes[0].x }));

  for (const step of [1, 2, 5, 10, 20, 50]) {
    const picked = starts.filter(({ season }) =>
      step <= 2 ? (season - 1) % step === 0 : season === 1 || season % step === 0
    );
    const fits = picked.every(
      (tick, i) => i === 0 || (tick.x - picked[i - 1].x) * pxPerEpisode >= MIN_TICK_GAP
    );
    if (fits) return picked;
  }
  return starts.slice(0, 1);
}

// Sizes the chart so its bottom edge sits inside the first screen,
// however tall the header and season toggles above it end up.
function useFitToViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(MAX_HEIGHT);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const available = window.innerHeight - top - spaceBelow();
      setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, available)));
      setWidth(el.clientWidth);
    };
    update();
    const observer = new ResizeObserver(update);
    if (el.parentElement) observer.observe(el.parentElement);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return { ref, height, width };
}

export default function SquerryChart({ seasons }: { seasons: SeasonSummary[] }) {
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [hovered, setHovered] = useState<number | null>(null);
  const {
    ref: chartRef,
    height: chartHeight,
    width: chartWidth,
  } = useFitToViewport();

  const { boundaries, lastX, minY, fitLines } = useMemo(() => {
    const allPoints = seasons.flatMap((s) => s.episodes);
    const lowest = Math.min(...allPoints.map((p) => p.rating));
    return {
      // x positions between seasons, where a divider is drawn
      boundaries: seasons.slice(0, -1).map((s) => s.episodes.at(-1)!.x + 0.5),
      lastX: allPoints.at(-1)!.x,
      minY: Math.max(0, Math.floor(lowest) - 1),
      fitLines: computeBestFitLine(
        Object.fromEntries(seasons.map((s) => [s.season, s.episodes]))
      ),
    };
  }, [seasons]);

  const xTicks = useMemo(
    () => pickSeasonTicks(seasons, lastX, chartWidth),
    [seasons, lastX, chartWidth]
  );
  const yTicks = Array.from({ length: 11 - minY }, (_, i) => minY + i);

  const toggle = (season: number) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(season)) next.delete(season);
      else next.add(season);
      return next;
    });
  };

  const opacityFor = (season: number) =>
    hovered === null || hovered === season ? 1 : 0.15;

  return (
    <div>
      <div className="-mx-3 mb-2 flex items-center gap-1.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
        {seasons.map(({ season, episodes }) => {
          const isHidden = hidden.has(season);
          const color = episodes[0].color;
          return (
            <button
              key={season}
              onClick={() => toggle(season)}
              onMouseEnter={() => !isHidden && setHovered(season)}
              onMouseLeave={() => setHovered(null)}
              aria-pressed={!isHidden}
              className={cn(
                "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                isHidden
                  ? "border-dashed text-muted-foreground hover:bg-muted"
                  : "bg-card hover:bg-accent"
              )}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: isHidden ? "transparent" : color, border: `2px solid ${color}` }}
              />
              Season {season}
            </button>
          );
        })}
        {hidden.size > 0 && (
          <button
            onClick={() => setHidden(new Set())}
            className="flex shrink-0 items-center gap-1 whitespace-nowrap px-2 py-1 text-xs font-medium text-primary hover:underline"
          >
            <Eye className="h-3.5 w-3.5" /> Show all
          </button>
        )}
        {hidden.size === 0 && seasons.length > 1 && (
          <button
            onClick={() => setHidden(new Set(seasons.map((s) => s.season)))}
            className="flex shrink-0 items-center gap-1 whitespace-nowrap px-2 py-1 text-xs font-medium text-muted-foreground hover:text-primary"
          >
            <EyeOff className="h-3.5 w-3.5" /> Hide all
          </button>
        )}
      </div>

      <ChartContainer config={chartConfig} ref={chartRef}
        className="aspect-auto w-full"
        style={{ height: chartHeight }}>
        <LineChart margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0.5, lastX + 0.5]}
            ticks={xTicks.map((t) => t.x)}
            tickFormatter={(x) =>
              `S${xTicks.find((t) => t.x === x)?.season ?? ""}`
            }
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            allowDuplicatedCategory={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[minY, 10]}
            ticks={yTicks}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            width={40}
          />

          <ChartTooltip cursor={false} content={<EpisodeTooltip />} />

          {boundaries.map((x) => (
            <ReferenceLine
              key={`divider-${x}`}
              x={x}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
          ))}

          {seasons.map(({ season, episodes }) => {
            const color = episodes[0].color;
            const segment = fitLines[season];
            if (hidden.has(season) || episodes.length < 2) return null;
            return (
              <ReferenceLine
                key={`trend-${season}`}
                segment={segment}
                stroke={color}
                strokeWidth={2}
                strokeOpacity={0.5 * opacityFor(season)}
                ifOverflow="hidden"
              />
            );
          })}

          {seasons.map(({ season, episodes }) => {
            const color = episodes[0].color;
            return (
              <Line
                key={`season-${season}`}
                data={episodes}
                name={`Season ${season}`}
                dataKey="y"
                stroke={color}
                strokeWidth={0}
                isAnimationActive={false}
                hide={hidden.has(season)}
                dot={{
                  r: 3.5,
                  fill: color,
                  strokeWidth: 0,
                  fillOpacity: opacityFor(season),
                }}
                activeDot={{
                  r: 6,
                  fill: color,
                  stroke: "white",
                  strokeWidth: 2,
                  cursor: "pointer",
                  onClick: (
                    _event: unknown,
                    point?: { payload?: ScatterEpisode }
                  ) => {
                    if (point?.payload) {
                      window.open(imdbTitleUrl(point.payload.tconst), "_blank");
                    }
                  },
                }}
              />
            );
          })}
        </LineChart>
      </ChartContainer>

      <p className="mt-1 text-center text-xs text-muted-foreground">
        Each dot is an episode. Lines show each season&apos;s trend. Click a
        season to hide it, or a dot to open the episode on IMDb.
      </p>
    </div>
  );
}

function EpisodeTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ScatterEpisode }[];
}) {
  const ep = payload?.[0]?.payload;
  if (!active || !ep) return null;

  return (
    <div className="max-w-64 rounded-xl border bg-popover px-3 py-2.5 text-sm shadow-xl">
      <div className="flex items-center gap-2 text-xs font-medium" style={{ color: ep.color }}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ep.color }} />
        {episodeCode(ep)}
      </div>
      <p className="mt-1 font-medium leading-snug">{ep.primarytitle}</p>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-lg font-semibold tabular-nums">
          {ep.rating.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatVotes(ep.numvotes)}
        </span>
      </div>
    </div>
  );
}
