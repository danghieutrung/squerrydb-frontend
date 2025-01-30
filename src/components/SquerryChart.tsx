"use client";

import React, { useState, useEffect } from "react";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Episode,
  LegendPayload,
  ScatterEpisode,
  Series,
} from "@/lib/types";

const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const axisConfig = {
  fontSize: 12,
  stroke: "#c9a0ff",
  strokeWidth: 0.5,
};

const chartConfig = {
  x: {
    label: "Episode",
  },
  y: {
    label: "Rating",
  },
} satisfies ChartConfig;

export default function SquerryChart({ seriesData }: { seriesData: Series }) {
  const [barProps, setBarProps] = useState<Record<string, string | boolean>>({
    hover: "",
  });

  const [finalEpisodes, setFinalEpisodes] = useState<number[]>([]);
  const [groupedRatingsData, setGroupedRatingsData] = useState<
    Record<number, ScatterEpisode[]>
  >({});
  const [uniqueSeasons, setUniqueSeasons] = useState<number[]>([]);

  useEffect(() => {
    if (!seriesData || !seriesData.episodes) return;

    const updatedFinalEpisodes: number[] = [];
    let currentEpisode: number = seriesData.episodes[0].episodenumber - 1;

    const updatedGroupedRatingsData = seriesData.episodes.reduce<
      Record<number, ScatterEpisode[]>
    >((acc, ep: Episode) => {
      if (!acc[ep.seasonnumber]) {
        acc[ep.seasonnumber] = [];
        updatedFinalEpisodes.push(currentEpisode);
      }

      acc[ep.seasonnumber].push({
        x: currentEpisode + 1,
        y: ep.averagerating,
        rating: ep.averagerating,
        numvotes: ep.numvotes,
        season: ep.seasonnumber,
        episode: ep.episodenumber,
        primarytitle: ep.primarytitle,
        tconst: ep.tconst,
        color: COLORS[(ep.seasonnumber - 1) % COLORS.length],
      });

      currentEpisode = currentEpisode + 1;
      return acc;
    }, {});

    updatedFinalEpisodes.push(currentEpisode);

    const updatedUniqueSeasons = Object.keys(updatedGroupedRatingsData).map(
      Number
    );
    const labelSeasons: Record<string, string | boolean> =
      updatedUniqueSeasons.reduce((acc, season) => {
        acc[`Season ${season}`] = false;
        return acc;
      }, {} as Record<string, string | boolean>);

    labelSeasons["hover"] = "";

    setGroupedRatingsData(updatedGroupedRatingsData);
    setFinalEpisodes(updatedFinalEpisodes);
    setUniqueSeasons(updatedUniqueSeasons);
    setBarProps(labelSeasons);
  }, [seriesData]);

  const handleLegendMouseEnter = (e: LegendPayload) => {
    if (!barProps[e.value]) {
      setBarProps({ ...barProps, hover: e.value });
    }
  };

  const handleLegendMouseLeave = () => {
    setBarProps({ ...barProps, hover: "" });
  };

  const selectSeasonLegend = (e: LegendPayload) => {
    setBarProps({
      ...barProps,
      [e.value]: !barProps[e.value],
      hover: "",
    });
  };

  if (!finalEpisodes.length)
    return <p className="text-center">Loading chart...</p>;

  return (
    <div>
      <ChartContainer config={chartConfig} className="w-full h-96">
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="xaxis"
            label={{
              value: "Episode",
              position: "insideBottom",
              ...axisConfig,
            }}
            ticks={finalEpisodes.slice(1)}
            tickLine={false}
            tick={axisConfig}
            domain={[0, finalEpisodes[finalEpisodes.length - 1] + 0.5]}
          />

          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 10]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            label={{
              value: "Episode Rating",
              angle: -90,
              position: "Left",
              ...axisConfig,
            }}
            tick={axisConfig}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="dot"
                className="w-[180px]"
                labelFormatter={(label, payload) => (
                  <strong>
                    {payload[0].payload.season}.{payload[0].payload.episode} -{" "}
                    {payload[0].payload.primarytitle}
                  </strong>
                )}
                formatter={(value, name, item) => {
                  if (name === "xaxis") {
                    return null;
                  }

                  return (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": item.payload.color,
                          } as React.CSSProperties
                        }
                      />
                      <div>{value}</div>
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        <span className="font-normal text-muted-foreground">
                          ({item.payload.numvotes} votes)
                        </span>
                      </div>
                    </>
                  );
                }}
              />
            }
            cursor={false}
            defaultIndex={1}
          />

          <Legend
            wrapperStyle={{
              position: "relative",
            }}
            onClick={selectSeasonLegend}
            onMouseOver={handleLegendMouseEnter}
            onMouseOut={handleLegendMouseLeave}
          />

          {uniqueSeasons.map((season) => {
            return (
              <Scatter
                key={`season-${season}`}
                name={`Season ${season}`}
                data={groupedRatingsData[season]}
                fill={COLORS[(season - 1) % COLORS.length]}
                hide={barProps[`Season ${season}`] === true}
                fillOpacity={Number(
                  barProps["hover"] === `Season ${season}` || !barProps["hover"]
                    ? 1
                    : 0.25
                )}
              ></Scatter>
            );
          })}
          {finalEpisodes.slice(1).map((value, index) => (
            <ReferenceLine
              key={`XRefLine-${index}`}
              x={value + 0.5}
              stroke="black"
              strokeDasharray="5 2"
              strokeWidth={0.3}
            />
          ))}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value, index) => (
            <ReferenceLine
              key={`YRefLine-${index}`}
              y={value}
              stroke="#4b0082"
              strokeDasharray="5 1"
              strokeWidth={0.2}
            />
          ))}
        </ScatterChart>
      </ChartContainer>
    </div>
  );
}
