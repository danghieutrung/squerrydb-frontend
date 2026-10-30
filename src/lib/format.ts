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
