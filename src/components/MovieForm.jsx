import { useState } from "react";
import MovieCard from "./MovieCard";
import { fetchMovieSearch } from "../modules/fetchers";

export default function MovieForm() {
  const OMDB_API_KEY = "cf17c078";

  const [searchParams, setSearchParams] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [movieIDs, setMovieIDs] = useState([]);

  // Search TMDB database for a film
  async function searchMovie(e) {
    e.preventDefault();
    try {
      // search for movies using fetchMovieSearch
      const data = await fetchMovieSearch(searchParams);
      // searchResults is the full search response object containing lots of info
      setSearchResults(data);
      // movieIDs is just an array of IDs for every movie in the search results
      setMovieIDs(data.results.map((movie) => movie.id));
      console.log("here's the movie id's");
      console.log(movieIDs);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <section id="loginSection">
        <h2>Search Movies</h2>
        <form onSubmit={searchMovie}>
          <div className="field">
            <input
              id="searchMovies"
              type="text"
              placeholder="Search"
              value={searchParams}
              onChange={(e) => setSearchParams(e.target.value)}
              required
            />
            <button type="submit">submit</button>
          </div>
        </form>
        {searchResults && (
          <ul>
            <li>
              <MovieCard movieID={movieIDs[0]} />
            </li>
            <li>
              <MovieCard movieID={movieIDs[1]} />
            </li>
            <li>
              <MovieCard movieID={movieIDs[2]} />
            </li>
          </ul>
        )}
      </section>
    </>
  );
}
