import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { useRouter } from "next/router";

export function NavBar({
  displaySearchBar = true,
  displaySearchButton = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-purple-300 border-gray-200 dark:bg-gray-900 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <div className="flex items-center">
          <img
            src="/squirry.png"
            alt="Avatar"
            className="w-10 h-10 object-cover rounded-full mr-2"
          />
          <div className="absolute right-4 top-2 flex items-center space-x-2">
            <div className="text-right">
              <p className="text-xl text-violet-500 font-semibold whitespace-nowrap dark:text-white">
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

          <div
            className="flex flex-col self-center text-left cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span className="text-xl text-violet-500 font-semibold whitespace-nowrap dark:text-white">
              GrephSquerry
            </span>
            <span className="text-xs text-black dark:text-white">
              Visualizing App for IMDb made with GraphQL Query
            </span>
          </div>
        </div>

        {displaySearchBar && (
          <SearchBar
            placeholder="Search"
            displaySearchButton={displaySearchButton}
          />
        )}

        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-12 right-4 w-40 bg-white shadow-md rounded-lg z-50`}
        >
          <ul className="font-medium flex flex-col p-2 space-y-1">
            <li className="flex items-center py-1 px-2 space-x-2 text-black text-sm">
              Dang Trung Hieu
            </li>
            <li>
              <a
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-2 px-3 space-x-2 text-black hover:text-gray-600 transition-colors"
              >
                <span>GitHub</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.385 0.6 0.111 0.793-0.261 0.793-0.577 0-0.285-0.011-1.04-0.016-2.04-3.338 0.724-4.042-1.609-4.042-1.609-0.547-1.386-1.335-1.756-1.335-1.756-1.091-0.745 0.083-0.729 0.083-0.729 1.205 0.085 1.839 1.238 1.839 1.238 1.07 1.835 2.805 1.304 3.49 0.998 0.108-0.776 0.419-1.304 0.762-1.604-2.665-0.304-5.466-1.332-5.466-5.93 0-1.31 0.469-2.381 1.235-3.22-0.124-0.303-0.536-1.526 0.117-3.176 0 0 1.008-0.323 3.301 1.23a11.544 11.544 0 013.002-0.404c1.018 0.005 2.042 0.138 3.002 0.404 2.292-1.553 3.297-1.23 3.297-1.23 0.656 1.65 0.244 2.873 0.12 3.176 0.768 0.839 1.233 1.91 1.233 3.22 0 4.609-2.805 5.625-5.475 5.921 0.432 0.373 0.816 1.104 0.816 2.226 0 1.606-0.014 2.899-0.014 3.293 0 0.32 0.189 0.694 0.801 0.576 4.763-1.587 8.195-6.084 8.195-11.385 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-2 px-3 space-x-2 text-black hover:text-blue-600 transition-colors"
              >
                <span>LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.23 0H1.77C0.79 0 0 0.77 0 1.72v20.56C0 23.23 0.79 24 1.77 24h20.46c0.98 0 1.77-0.77 1.77-1.72V1.72C24 0.77 23.21 0 22.23 0zM7.06 20.45H3.56V9h3.5v11.45zM5.31 7.65C4.02 7.65 3 6.64 3 5.35S4.02 3.05 5.31 3.05s2.31 1.01 2.31 2.3c0 1.29-1.02 2.3-2.31 2.3zM20.45 20.45h-3.5v-5.62c0-1.34-0.03-3.08-1.88-3.08s-2.17 1.47-2.17 2.98v5.72h-3.5V9h3.36v1.56h0.05c0.47-0.89 1.6-1.83 3.29-1.83 3.52 0 4.17 2.32 4.17 5.33v6.39z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="lol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 py-2 px-3 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>Website</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14 3v2h3.586l-9.293 9.293 1.414 1.414L19 6.414V10h2V3h-7zm5 14H5v-9H3v9c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-3h-2v3z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
