import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// type Point = { x: number; y: number };

// export function getBestFitLine(data: Point[]): { start: Point; end: Point } {
//     if (data.length < 2) {
//         throw new Error("At least two data points are required.");
//     }

//     // Calculate mean of x and y
//     const n = data.length;
//     let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

//     for (const point of data) {
//         sumX += point.x;
//         sumY += point.y;
//         sumXY += point.x * point.y;
//         sumX2 += point.x * point.x;
//     }

//     const meanX = sumX / n;
//     const meanY = sumY / n;

//     // Calculate slope (m) and intercept (b) using least squares regression formula
//     const m = (sumXY - n * meanX * meanY) / (sumX2 - n * meanX * meanX);
//     const b = meanY - m * meanX;

//     // Find the min and max x values in the dataset
//     const minX = Math.min(...data.map(p => p.x));
//     const maxX = Math.max(...data.map(p => p.x));

//     // return { start, end };
//     return [{ x: minX, end: m * minX + b }, { x: maxX, end: m * maxX + b }]
// }
