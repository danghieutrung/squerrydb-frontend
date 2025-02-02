"use client";

import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import client from "../lib/apolloClient";
import { ErrorMessage } from "@/components/ErrorMessage";
import { NavBar } from "@/components/NavBar";
import { Series } from "@/lib/types";

import "../app/globals.css";

const SEARCH_SERIES = gql`
  query searchSeries($name: String!) {
    searchSeries(name: $name) {
      tconst
      primarytitle
      startyear
      numvotes
    }
  }
`;

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;

  const { data, loading, error } = useQuery(SEARCH_SERIES, {
    client,
    variables: { name: query || "" },
    skip: !query,
  });

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (data?.searchSeries == 0)
    return <ErrorMessage message={`No search results for "${query}"`} />;

  if (error) return <ErrorMessage message={`Error fetching data`} />;

  return (
    <div>
      <link rel="icon" href="/squirrel_icon2.png" sizes="any" />
      <NavBar displayNavSearchBar={true} />
      <div className="p-6">
        <h1 className="text-2xl text-black font-bold mb-4 text-left">
          Search &quot;{query}&quot;
        </h1>
        {data?.searchSeries.map((s: Series, index: number) => (
          <div key={s.tconst} className="text-l flex flex-col pb-3 text-black">
            <span>
              {index < 9 ? "\u00A0" : ""}
              {index + 1}.{" "}
              <Link
                href={`/chart/${s.tconst}`}
                passHref
                className="font-semibold underline transition-opacity duration-300 hover:opacity-60"
              >
                {s.primarytitle}
              </Link>{" "}
              ({s.startyear}
              {s?.numvotes ? `, ${s.numvotes} votes` : ""})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
