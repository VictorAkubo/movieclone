import { useState, FormEvent, useMemo } from "react";
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

const GENRE_MAP: { [key: string]: number } = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Drama: 18,
  SciFi: 878,
};

export default function HomepageView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInputValue, setSearchInputValue] = useState<string>(
    searchParams.get("q") || "",
  );

  const queryParam = searchParams.get("q") || "";

  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Popularity");

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

  const filteredSearchResults = useMemo(() => {
    if (!queryParam) return [];

    let list = [...(searchResults || [])];

    if (selectedGenre !== "All") {
      const targetId = GENRE_MAP[selectedGenre];
      list = list.filter((movie) => movie.genre_ids?.includes(targetId));
    }

    if (selectedYear !== "All") {
      list = list.filter((movie) => movie.release_date?.startsWith(selectedYear));
    }

    if (selectedRating !== "All") {
      const minRating = parseFloat(selectedRating);
      list = list.filter((movie) => movie.vote_average >= minRating);
    }

    if (sortBy === "Rating") {
      list.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === "Title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return list;
  }, [searchResults, queryParam, selectedGenre, selectedYear, selectedRating, sortBy]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      setSearchParams({ q: searchInputValue });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSelectedGenre("All");
    setSelectedYear("All");
    setSelectedRating("All");
    setSortBy("Popularity");
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
         {queryParam ? (<SlidersHorizontal className="w-4 h-4" />) : ""} {queryParam ? "Filters" : "Search"}
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
              {filteredSearchResults.length} results found
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
            <div className="flex flex-col gap-1 flex-1 max-w-[140px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-white border border-slate-100 text-xs text-slate-600 rounded-lg px-2 py-1.5 focus:outline-none w-full font-medium"
              >
                <option value="All">All Genres</option>
                {Object.keys(GENRE_MAP).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1 max-w-[140px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-slate-100 text-xs text-slate-600 rounded-lg px-2 py-1.5 focus:outline-none w-full font-medium"
              >
                <option value="All">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1 max-w-[140px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Rating
              </label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="bg-white border border-slate-100 text-xs text-slate-600 rounded-lg px-2 py-1.5 focus:outline-none w-full font-medium"
              >
                <option value="All">All Ratings</option>
                <option value="8">★ 8.0+ High</option>
                <option value="7">★ 7.0+</option>
                <option value="6">★ 6.0+</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1 max-w-[140px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-100 text-xs text-slate-600 rounded-lg px-2 py-1.5 focus:outline-none w-full font-medium"
              >
                <option value="Popularity">Popularity</option>
                <option value="Rating">Highest Rating</option>
                <option value="Title">Title (A-Z)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 ml-auto mr-2 mt-4 hover:text-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {loadingSearch ? (
            <div className="text-sm text-slate-400">Searching...</div>
          ) : (
            <>
              <div className="grid grid-cols-6 gap-4">
                {filteredSearchResults.map((movie) => (
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

              {filteredSearchResults.length === 0 && (
                <div className="text-xs text-slate-400 text-center py-12 bg-slate-50 border border-dashed rounded-xl mt-4">
                  No movies found matching your selected search criteria filters.
                </div>
              )}
            </>
          )}
        </section>
      )}
    </MainLayout>
  );
}