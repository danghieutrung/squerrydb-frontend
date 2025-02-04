"use client";

import React, { useState, useEffect } from "react";

import { Line, XAxis, YAxis, Legend, ReferenceLine, LineChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Episode,
  BestFitLine,
  LegendPayload,
  ScatterEpisode,
  Series,
} from "@/lib/types";
import { computeBestFitLine } from "@/lib/utils";

const COLORS = [
  "#7D5A50",
  "#8E1616",
  "#EC994B",
  "#B771E5",
  "#8F71FF",
  "#368B85",
  "#2940D3",
  "#CA3E6B",
  "#bcbd22",
  "#17becf",
];

const axisConfig = {
  fontSize: 12,
  stroke: "#c9a0ff",
  strokeWidth: 0.5,
};

const chartConfig = {} satisfies ChartConfig;

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

  const bestFitLines: Record<number, BestFitLine> =
    computeBestFitLine(groupedRatingsData);

  if (!finalEpisodes.length)
    return <p className="text-center">Loading chart...</p>;

  return (
    <div>
      <ChartContainer config={chartConfig} className="w-full h-96">
        <LineChart margin={{ top: 15, right: 20, left: 10, bottom: 25 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="xaxis"
            label={{
              value: "Episode",
              position: "insideBottom",
              offset: 0,
              ...axisConfig,
            }}
            ticks={finalEpisodes.slice(1)}
            tickLine={false}
            tick={axisConfig}
            domain={[0, finalEpisodes[finalEpisodes.length - 1] + 0.5]}
            allowDuplicatedCategory={false}
          />

          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 10]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            label={{
              value: "Rating",
              angle: -90,
              position: "Left",
              ...axisConfig,
            }}
            tick={axisConfig}
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(label, payload) => (
                  <strong style={{ color: payload[0].payload.color }}>
                    {payload[0].payload.season}.{payload[0].payload.episode} -{" "}
                    {payload[0].payload.primarytitle}
                  </strong>
                )}
                formatter={(value, name, item) => {
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
                      <div style={{ color: item.payload.color }}>{value}</div>
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        <span
                          className="font-normal text-muted-foreground"
                          style={{ color: item.payload.color }}
                        >
                          ({item.payload.numvotes} votes)
                        </span>
                      </div>
                    </>
                  );
                }}
              />
            }
          />

          <Legend
            wrapperStyle={{
              position: "relative",
            }}
            iconType="circle"
            onClick={selectSeasonLegend}
            onMouseOver={handleLegendMouseEnter}
            onMouseOut={handleLegendMouseLeave}
          />

          {uniqueSeasons.map((season) => {
            const color = COLORS[(season - 1) % COLORS.length];
            return (
              <Line
                data={groupedRatingsData[season]}
                key={`season-${season}${season < 10 ? " " : ""}`}
                name={`Season ${season}`}
                dataKey="y"
                type="natural"
                stroke={color}
                strokeWidth={0}
                dot={{
                  r: 3,
                  fill: color,
                }}
                activeDot={{
                  r: 6,
                  fill: color,
                  onClick: (
                    event: React.MouseEvent<SVGCircleElement, MouseEvent>,
                    payload?: { payload: { tconst: string } }
                  ) => {
                    if (payload && payload.payload) {
                      const tconst = payload.payload.tconst;
                      console.log(typeof payload);
                      window.open(
                        `https://www.imdb.com/title/${tconst}/`,
                        "_blank"
                      );
                    }
                  },
                }}
                hide={barProps[`Season ${season}`] === true}
              ></Line>
            );
          })}

          {Object.keys(bestFitLines).map((seasonKey) => {
            const season: number = Number(seasonKey);
            const segment: BestFitLine = bestFitLines[season];
            return (
              <ReferenceLine
                key={`BestFit-${season}`}
                segment={segment}
                stroke={COLORS[(season - 1) % COLORS.length]}
                strokeWidth={barProps[`Season ${season}`] ? 0 : 1}
              />
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
        </LineChart>
      </ChartContainer>
    </div>
  );
}
