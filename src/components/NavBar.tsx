import React, { useState } from "react";
import { NavSearchBar } from "./NavSearchBar";
import { useRouter } from "next/router";

import "../app/globals.css";

export function NavBar({ displayNavSearchBar = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-purple-300 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-2">
        <div className="hidden sm:flex items-center space-x-2">
          <img
            src="/squirry.png"
            alt="Avatar"
            className="w-10 h-10 object-cover rounded-full"
          />
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => router.push("/")}
          >
            <p className="text-xl text-violet-500 font-semibold dark:text-white">
              SquerryDB
            </p>
            <p className="text-xs text-black dark:text-white">
              Visualizing App for IMDb Series
            </p>
          </div>
        </div>

        {displayNavSearchBar && (
          <div className="flex-1 flex justify-center">
            <NavSearchBar placeholder="Search" />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="text-right lg:block hidden">
            <p className="text-xl text-violet-500 font-semibold dark:text-white">
              Stephen Squirry
            </p>
            <p className="text-xs text-black dark:text-white">
              hieudangtrung@protonmail.com
            </p>
          </div>
          <button
            onClick={toggleMenu}
            type="button"
            className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <img
              src="/squirry.jpg"
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-14 right-4 w-40 bg-white shadow-md rounded-lg z-50">
            <ul className="font-medium flex flex-col p-2 space-y-1">
              <li className="flex items-center py-1 px-2 space-x-2 text-black text-sm">
                Dang Trung Hieu
              </li>
              <li>
                <a
                  href="https://github.com/danghieutrung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center py-2 px-3 space-x-2 text-black hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.206 11.387.6.113.82-.263.82-.583v-2.28c-3.338.725-4.038-1.612-4.038-1.612-.547-1.387-1.337-1.756-1.337-1.756-1.09-.744.082-.729.082-.729 1.203.082 1.837 1.238 1.837 1.238 1.07 1.837 2.805 1.306 3.49.998.106-.776.418-1.305.762-1.606-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.47-2.382 1.237-3.22-.124-.303-.536-1.522.118-3.176 0 0 1.007-.323 3.3 1.23.957-.267 1.98-.4 3-.405 1.02.005 2.043.138 3 .405 2.293-1.553 3.3-1.23 3.3-1.23.655 1.654.242 2.873.118 3.176.77.838 1.237 1.91 1.237 3.22 0 4.612-2.805 5.626-5.478 5.922.43.372.814 1.1.814 2.217v3.293c0 .324.218.7.825.58C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </li>

              <li>
                <a
                  href="https://www.linkedin.com/in/trunghieudang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center py-2 px-3 space-x-2 text-black hover:text-blue-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M20.447 20.452h-3.553v-6.173c0-1.473-.025-3.367-2.052-3.367-2.053 0-2.368 1.603-2.368 3.26v6.28H8.92V9.32h3.406v1.528h.05c.474-.9 1.637-1.846 3.368-1.846 3.602 0 4.274 2.37 4.274 5.457v6.993zM5.337 7.797a2.07 2.07 0 1 1-.001-4.14 2.07 2.07 0 0 1 .001 4.14zM7.114 20.452H3.557V9.32h3.557v11.132zM22.225 0H1.771C.792 0 0 .774 0 1.726v20.548C0 23.226.792 24 1.771 24h20.452C23.207 24 24 23.226 24 22.274V1.726C24 .774 23.207 0 22.225 0z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </li>

              <li>
                <a
                  href="https://dangtrunghieu.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 py-2 px-3 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 2L1.5 9v12h21V9L12 2zm6.5 17h-13v-8l6.5-4.5L18.5 11v8z" />
                  </svg>
                  <span>Website</span>
                </a>
              </li>

              <li>
                <a
                  href="https://open.spotify.com/user/vejhzanembwlmo1vslzsmrux9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 py-2 px-3 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21.6c-5.293 0-9.6-4.307-9.6-9.6S6.707 2.4 12 2.4s9.6 4.307 9.6 9.6-4.307 9.6-9.6 9.6zM12 5.6a6.4 6.4 0 1 0 0 12.8A6.4 6.4 0 0 0 12 5.6zm0 10.8A4.4 4.4 0 1 1 12 7.6a4.4 4.4 0 0 1 0 8.8zM12 8.4a3.6 3.6 0 1 0 0 7.2A3.6 3.6 0 0 0 12 8.4zm0 6A2.4 2.4 0 1 1 12 10a2.4 2.4 0 0 1 0 4.8z" />
                  </svg>
                  <span>Spotify</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
