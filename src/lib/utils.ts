import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ScatterEpisode, BestFitLine } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeBestFitLine(
  data: Record<number, ScatterEpisode[]>
): Record<number, BestFitLine> {
  const result: Record<number, BestFitLine> = {};

  for (const [seasonStr, episodes] of Object.entries(data)) {
    const season: number = Number(seasonStr);

    if (episodes.length < 2) {
      result[season] = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ];
      continue;
    }

    const xValues = episodes.map((e) => e.x);
    const yValues = episodes.map((e) => e.y);

    const n = xValues.length;
    const sumX = xValues.reduce((sum, val) => sum + val, 0);
    const sumY = yValues.reduce((sum, val) => sum + val, 0);
    const sumXY = xValues.reduce((sum, val, i) => sum + val * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, val) => sum + val * val, 0);

    // Compute slope (m) and y-intercept (b) using least squares method
    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) {
      result[season] = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ];
      continue;
    }

    const m = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    // Define the best fit line as an array of two points
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);

    result[season] = [
      { x: xMin, y: m * xMin + b },
      { x: xMax, y: m * xMax + b },
    ];
  }

  return result;
}
