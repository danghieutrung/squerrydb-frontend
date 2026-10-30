import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ExternalLink, Mail, Menu, X } from "lucide-react";

import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/links";
import { SearchBox } from "./SearchBox";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white shadow-sm shadow-primary/30">
        S
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Squerry<span className="text-primary">DB</span>
      </span>
    </Link>
  );
}

export function NavBar({ showSearch = true }: { showSearch?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close the menu on outside click, Escape, or navigation.
  useEffect(() => {
    if (!menuOpen) return;

    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onRouteChange = () => setMenuOpen(false);

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    router.events.on("routeChangeStart", onRouteChange);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
      router.events.off("routeChangeStart", onRouteChange);
    };
  }, [menuOpen, router.events]);

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <div className={showSearch ? "hidden sm:block" : undefined}>
          <Logo />
        </div>

        {showSearch && (
          <div className="flex flex-1 justify-center">
            <SearchBox className="max-w-md" />
          </div>
        )}

        <div ref={menuRef} className="relative ml-auto shrink-0">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-controls="nav-menu"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {menuOpen && (
            <div
              id="nav-menu"
              className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-popover shadow-xl shadow-primary/10 animate-in fade-in-0 zoom-in-95"
            >
              <p className="px-4 pb-1 pt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Find me on
              </p>
              <ul className="p-1.5 pt-0">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{label}</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="border-t p-1.5">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{CONTACT_EMAIL}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
