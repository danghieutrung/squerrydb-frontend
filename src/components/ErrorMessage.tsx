import { NavBar } from "./NavBar";
import { SearchBar } from "../components/SearchBar";

export function ErrorMessage({ message = "An error occurred" }) {
  return (
    <div>
      <NavBar displaySearchButton={false} displaySearchBar={false}/>
      <div className="p-40">
        <h1 className="text-xl font-bold mb-4 text-center text-3xl">
          {message}
        </h1>
        <SearchBar />
      </div>
    </div>
  );
}
