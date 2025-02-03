"use client";

import { NavBar } from "@/components/NavBar";
import { SearchBar } from "@/components/SearchBar";

import "../app/globals.css";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar displayNavSearchBar={true} />
      <div className="flex flex-col items-center w-full pt-[15vh] p-10">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-center">
          IMDb Series Search
        </h1>

        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>

          <img
            src="/demo.gif"
            alt="IMDb Search Demo"
            className="pt-[5vh] w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div className="fixed bottom-4 w-full text-center text-sm text-gray-600">
        Contact me at{" "}
        <a href="mailto:lol@lol.com" className="underline">
          hieudangtrung@protonmail.com
        </a>
      </div>
    </div>
  );
}
