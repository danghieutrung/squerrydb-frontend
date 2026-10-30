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

// Text colour for each rating band, best first; anything 1.5 or below is black.
const RATING_COLORS = [
  { min: 9, className: "text-emerald-700" },
  { min: 8, className: "text-green-600" },
  { min: 7, className: "text-amber-500" },
  { min: 6, className: "text-orange-500" },
  { min: 4, className: "text-red-600" },
  { min: 0, className: "text-red-900" },
];

export function ratingColor(rating?: number | null) {
  if (!rating) return "text-muted-foreground";
  if (rating <= 1.5) return "text-neutral-950";
  return RATING_COLORS.find((band) => rating >= band.min)!.className;
}
