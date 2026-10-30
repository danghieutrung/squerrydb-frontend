import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/router";
import { gql, useLazyQuery } from "@apollo/client";
import { ArrowRight, Loader2, Search } from "lucide-react";

import { Series } from "@/lib/types";
import { formatVotes } from "@/lib/format";
import { cn } from "@/lib/utils";

const SUGGEST_SERIES = gql`
  query suggestSeries($name: String!, $isLimit: Boolean) {
    searchSeries(name: $name, isLimit: $isLimit) {
      tconst
      primarytitle
      startyear
      numvotes
    }
  }
`;

const MAX_SUGGESTIONS = 6;

type SearchBoxProps = {
  variant?: "hero" | "compact";
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
};

export function SearchBox({
  variant = "compact",
  placeholder = "Search a TV series",
  autoFocus = false,
  className,
}: SearchBoxProps) {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const [fetchSuggestions, { data, loading }] = useLazyQuery(SUGGEST_SERIES);
  const suggestions: Series[] = term.trim()
    ? (data?.searchSeries ?? []).slice(0, MAX_SUGGESTIONS)
    : [];

  // Debounce suggestion requests while typing.
  useEffect(() => {
    const name = term.trim();
    if (!name) return;
    const timer = setTimeout(
      () => fetchSuggestions({ variables: { name, isLimit: true } }),
      200
    );
    return () => clearTimeout(timer);
  }, [term, fetchSuggestions]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onRouteChange = () => {
      setOpen(false);
      setTerm("");
    };
    document.addEventListener("mousedown", onClick);
    router.events.on("routeChangeStart", onRouteChange);
    return () => {
      document.removeEventListener("mousedown", onClick);
      router.events.off("routeChangeStart", onRouteChange);
    };
  }, [router.events]);

  const goToSearch = () => {
    const name = term.trim();
    if (name) router.push(`/search?query=${encodeURIComponent(name)}`);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (open && suggestions[active]) {
      router.push(`/chart/${suggestions[active].tconst}`);
    } else {
      goToSearch();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const isHero = variant === "hero";
  const showDropdown = open && term.trim().length > 0;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={onSubmit} role="search">
        <div
          className={cn(
            "flex items-center gap-2 border bg-card transition-shadow focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/15",
            isHero
              ? "h-14 rounded-2xl pl-5 pr-2 shadow-lg shadow-primary/5"
              : "h-10 rounded-xl px-3"
          )}
        >
          <Search
            className={cn(
              "shrink-0 text-muted-foreground",
              isHero ? "h-5 w-5" : "h-4 w-4"
            )}
            aria-hidden
          />
          <input
            type="search"
            value={term}
            autoFocus={autoFocus}
            onChange={(event) => {
              setTerm(event.target.value);
              setActive(-1);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label="Search TV series"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={showDropdown}
            role="combobox"
            className={cn(
              "h-full w-full min-w-0 bg-transparent placeholder:text-muted-foreground/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden",
              isHero ? "text-base" : "text-sm"
            )}
          />
          {loading && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          )}
          {isHero && (
            <button
              type="submit"
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border bg-popover text-left shadow-xl shadow-primary/10"
        >
          {suggestions.length > 0 ? (
            <ul className="p-1.5">
              {suggestions.map((series, index) => (
                <li key={series.tconst} role="option" aria-selected={index === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onClick={() => router.push(`/chart/${series.tconst}`)}
                    className={cn(
                      "flex w-full items-baseline gap-3 rounded-lg px-3 py-2 text-left text-sm",
                      index === active && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {series.primarytitle}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {series.startyear ?? "—"} · {formatVotes(series.numvotes)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {loading || !data ? "Searching…" : "No series match that name."}
            </p>
          )}
          <button
            type="button"
            onClick={goToSearch}
            className="flex w-full items-center justify-between border-t px-4 py-2.5 text-sm font-medium text-primary hover:bg-accent"
          >
            <span className="truncate">See all results for “{term.trim()}”</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
