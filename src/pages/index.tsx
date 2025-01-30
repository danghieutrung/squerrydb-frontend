"use client";

import "../app/globals.css";
import {SearchBar} from "../components/SearchBar";
import { NavBar } from "@/components/NavBar";

export default function Home() {
  return (
    <div>
      <link rel="icon" href="/squirrel_icon2.png" sizes="any" />
      <NavBar displaySearchBar={false}/>
      <div className="p-20">
        <h1 className="text-3xl font-bold mb-4 text-center">
          IMDb Series Search
        </h1>
        <SearchBar/>
      </div>
    </div>
  );
}
