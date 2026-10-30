import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Menu,
  Music,
  X,
} from "lucide-react";
import { NavSearchBar } from "./NavSearchBar";

import "../app/globals.css";

const EMAIL = "contact.hieudang@gmail.com";

const LINKS = [
  { label: "GitHub", href: "https://github.com/danghieutrung", icon: Github },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/trunghieudang",
    icon: Linkedin,
  },
  { label: "Website", href: "https://dangtrunghieu.vercel.app/", icon: Globe },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/vejhzanembwlmo1vslzsmrux9",
    icon: Music,
  },
];

export function NavBar({ displayNavSearchBar = true }) {
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
    <nav className="sticky top-0 z-40 border-b border-violet-200/70 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-4 px-4">
        <Link href="/" className="hidden shrink-0 flex-col leading-tight sm:flex">
          <span className="text-lg font-bold tracking-tight text-violet-600 dark:text-violet-400">
            SquerryDB
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Visualizing IMDb series
          </span>
        </Link>

        {displayNavSearchBar && (
          <div className="flex flex-1 justify-center">
            <NavSearchBar placeholder="Search series" />
          </div>
        )}

        <div ref={menuRef} className="relative ml-auto shrink-0">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-violet-50 hover:text-violet-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:text-gray-300 dark:hover:bg-gray-800"
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
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95 dark:border-gray-700 dark:bg-gray-900"
            >
              <ul className="p-1.5">
                {LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-violet-300"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{label}</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 p-1.5 dark:border-gray-800">
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-violet-300"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{EMAIL}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
