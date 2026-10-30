const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatVotes(votes?: number | null) {
  return votes ? `${compact.format(votes)} votes` : "No votes yet";
}

export function formatYears(start?: number | null, end?: number | null) {
  if (!start) return "Unknown year";
  if (!end) return `${start}–present`;
  return start === end ? `${start}` : `${start}–${end}`;
}

export function formatRating(rating?: number | null) {
  return rating ? rating.toFixed(1) : "–";
}

// Colour bands for ratings, best first.
export const RATING_BANDS = [
  { min: 8, label: "8+", text: "text-green-600", dot: "bg-green-600" },
  { min: 7, label: "7–7.9", text: "text-amber-500", dot: "bg-amber-500" },
  { min: 5, label: "5–6.9", text: "text-red-600", dot: "bg-red-600" },
  { min: 0, label: "Below 5", text: "text-neutral-950", dot: "bg-neutral-950" },
];

export function ratingColor(rating?: number | null) {
  if (!rating) return "text-muted-foreground";
  return RATING_BANDS.find((band) => rating >= band.min)!.text;
}
