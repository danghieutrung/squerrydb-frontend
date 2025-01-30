"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import client from "../../lib/apolloClient";
import SquerryChart from "../../components/SquerryChart";
import { ErrorMessage } from "@/components/ErrorMessage";
import { NavBar } from "@/components/NavBar";

import "../../app/globals.css";

const GET_RATINGS = gql`
  query GetRatingByTconst($tconst: String!) {
    getRatings(tconst: $tconst) {
      tconst
      titletype
      primarytitle
      startyear
      endyear
      genres
      averagerating
      numvotes
      episodes {
        tconst
        primarytitle
        seasonnumber
        episodenumber
        averagerating
        numvotes
      }
    }
  }
`;

export default function Chart() {
  const router = useRouter();
  const [tconst, setTconst] = useState<string>("null");

  useEffect(() => {
    // if (typeof router.query.tconst === "string") {
    if (
      typeof router.query.tconst === "string" &&
      router.query.tconst !== tconst
    ) {
      setTconst(router.query.tconst);
    }
  }, [router.query.tconst]);

  const { data, loading, error } = useQuery(GET_RATINGS, {
    client,
    variables: { tconst },
    skip: !tconst,
  });

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <ErrorMessage message="Error fetching data" />;

  const seriesData = data?.getRatings;

  if (!seriesData) {
    return <ErrorMessage message="Invalid URL" />;
  }

  return (
    <div>
      <NavBar displaySearchButton={false} />
      <div className="p-2">
        <h1 className="text-2xl font-bold text-center">
          {seriesData?.primarytitle} - {seriesData?.averagerating}
        </h1>
        <p className="text-xs text-center">
          {seriesData?.startyear}
          {seriesData?.endyear ? ` - ${seriesData.endyear}` : ""}
          {seriesData?.genres ? `. ${seriesData.genres}` : ""}
        </p>

        <SquerryChart seriesData={seriesData} />

        <button
          onClick={() =>
            window.open(`https://www.imdb.com/title/${tconst}/`, "_blank")
          }
          className="px-4 py-2 bg-violet-500 text-white rounded block mx-auto"
        >
          View &quot;{seriesData.primarytitle}&quot; on IMDb
        </button>
      </div>
    </div>
  );
}
