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

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-12 right-4 w-40 bg-white shadow-md rounded-lg z-50">
            <ul className="font-medium flex flex-col p-2 space-y-1">
              <li className="flex items-center py-1 px-2 space-x-2 text-black text-sm">
                Dang Trung Hieu
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
