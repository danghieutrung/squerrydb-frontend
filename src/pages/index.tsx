"use client";

import { NavBar } from "@/components/NavBar";
import { SearchBar } from "@/components/SearchBar";

import "../app/globals.css";

export default function Home() {
  return (
    <div>
      <NavBar displayNavSearchBar={false} />
      <div className="p-20">
        <h1 className="text-3xl font-bold mb-4 text-center">
          IMDb Series Search
        </h1>
        <SearchBar />
      </div>
    </div>
  );
}
