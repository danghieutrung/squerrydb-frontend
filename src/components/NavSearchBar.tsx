import { useState } from "react";
import { useRouter } from "next/router";
import { useLazyQuery, gql } from "@apollo/client";
import client from "../lib/apolloClient";
import Link from "next/link";
import { Series } from "@/lib/types";

const SEARCH_SERIES = gql`
  query searchSeries($name: String!, $isLimit: Boolean) {
    searchSeries(name: $name, isLimit: $isLimit) {
      tconst
      startyear
      primarytitle
    }
  }
`;

export function NavSearchBar({ placeholder = "Search..." }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const [fetchSearchResults, { data }] = useLazyQuery(SEARCH_SERIES, {
    client,
  });

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value
    setSearchTerm(searchValue);
    fetchSearchResults({
      variables: { name: event.target.value || "", isLimit: true },
    });
    if (searchValue.trim().length > 0) {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  return (
    <div className="relative w-80">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center w-full h-10 rounded-lg border border-gray-300 bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus-within:ring-blue-500">
          <input
            type="text"
            id="nav-search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={onChange}
            className="w-full h-full p-2 pl-10 text-sm text-gray-900 bg-transparent focus:outline-none dark:text-white"
            required
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
      </form>

      {isDropdownVisible && data?.searchSeries?.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-700 dark:border-gray-600">
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {data.searchSeries.slice(0, 5).map((series: Series) => (
              <li key={series.tconst}>
                <Link
                  href={`/chart/${series.tconst}`}
                  className="block px-3 py-1 text-xs text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-600"
                  onClick={() => setDropdownVisible(false)}
                >
                  {series.primarytitle} ({series.startyear})
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() =>
                  router.push(`/search?query=${encodeURIComponent(searchTerm)}`)
                }
                className="w-full text-xs text-left px-3 py-1 text-blue-600 hover:bg-gray-200 dark:text-blue-400 dark:hover:bg-gray-600"
              >
                More results...
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
