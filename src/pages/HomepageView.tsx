import { useState, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import MainLayout from "../components/MainLayout.tsx";
import {
  fetchNowPlaying,
  fetchPopular,
  fetchSearchResults,
  TMDB_IMAGE_BASE,
} from "../api/tmdb";
import { Movie } from "../types/tmdb";

export default function HomepageView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInputValue, setSearchInputValue] = useState<string>(
    searchParams.get("q") || "",
  );

  const queryParam = searchParams.get("q") || "";

  const { data: nowPlaying, isLoading: loadingNow } = useQuery<Movie[]>({
    queryKey: ["nowPlaying"],
    queryFn: fetchNowPlaying,
  });

  const { data: popular, isLoading: loadingPopular } = useQuery<Movie[]>({
    queryKey: ["popular"],
    queryFn: fetchPopular,
  });

  const { data: searchResults, isLoading: loadingSearch } = useQuery<Movie[]>({
    queryKey: ["search", queryParam],
    queryFn: () => fetchSearchResults(queryParam),
    enabled: !!queryParam,
  });

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      setSearchParams({ q: searchInputValue });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchInputValue("");
    setSearchParams({});
  };

  return (
    <MainLayout>
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-3 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            placeholder="Search movies..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </form>

      {!queryParam ? (
        <>
          <section className="mb-10">
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Discover Movies
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Find and explore your next favorite movie.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Now Playing
              </h2>
              <button className="text-xs font-semibold text-blue-600 hover:underline">
                View all
              </button>
            </div>

            {loadingNow ? (
              <div className="text-sm text-slate-400">Loading...</div>
            ) : (
              <div className="grid grid-cols-5 gap-4">
                {nowPlaying?.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="group flex flex-col gap-2 cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-100 shadow-sm transition-all group-hover:scale-[1.02]">
                      {movie.poster_path && (
                        <img
                          src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        ★ {movie.vote_average?.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {movie.release_date?.split("-")[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Popular Movies
              </h2>
              <button className="text-xs font-semibold text-blue-600 hover:underline">
                View all
              </button>
            </div>

            {loadingPopular ? (
              <div className="text-sm text-slate-400">Loading...</div>
            ) : (
              <div className="grid grid-cols-6 gap-4">
                {popular?.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="group flex flex-col gap-2 cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                      {movie.poster_path && (
                        <img
                          src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        ★ {movie.vote_average?.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {movie.release_date?.split("-")[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Search Results for "{queryParam}"
            </h2>
            <span className="text-[11px] font-medium text-slate-400">
              {searchResults?.length || 0} results found
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
            {["Genre", "Year", "Rating", "Sort By"].map((filter) => (
              <div
                key={filter}
                className="flex flex-col gap-1 flex-1 max-w-[140px]"
              >
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  {filter}
                </label>
                <select className="bg-white border border-slate-100 text-xs text-slate-600 rounded-lg px-2 py-1.5 focus:outline-none w-full">
                  <option>All {filter}s</option>
                  {filter === "Sort By" && <option>Popularity</option>}
                </select>
              </div>
            ))}
            <button
              type="button"
              onClick={clearSearch}
              className="text-xs font-semibold text-blue-600 ml-auto mr-2 mt-4"
            >
              Clear Filters
            </button>
          </div>

          {loadingSearch ? (
            <div className="text-sm text-slate-400">Searching...</div>
          ) : (
            <div className="grid grid-cols-6 gap-4">
              {searchResults?.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="flex flex-col gap-2 cursor-pointer group"
                >
                  <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                    {movie.poster_path ? (
                      <img
                        src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-400 p-2 text-center">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold text-amber-400">
                      ★ {movie.vote_average?.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {movie.release_date?.split("-")[0] || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </MainLayout>
  );
}
