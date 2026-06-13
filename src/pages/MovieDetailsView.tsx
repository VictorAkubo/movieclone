import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart } from "lucide-react";
import MainLayout from "../components/MainLayout.tsx";
import {
  fetchMovieDetails,
  fetchSimilarMovies,
  TMDB_IMAGE_BASE,
} from "../api/tmdb";
import { Movie, MovieDetails } from "../types/tmdb";

export default function MovieDetailsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {data: movie,isLoading: loadingMovie,error,} = useQuery<MovieDetails>({
    queryKey: ["movieDetails", id],
    queryFn: () => fetchMovieDetails(id!),
    enabled: !!id,
  });

  const { data: similar, isLoading: loadingSimilar } = useQuery<Movie[]>({
    queryKey: ["similarMovies", id],
    queryFn: () => fetchSimilarMovies(id!),
    enabled: !!id,
  });

  if (loadingMovie)
    return (
      <MainLayout>
        <div className="text-slate-400 text-sm">Loading details...</div>
      </MainLayout>
    );
  if (error || !movie)
    return (
      <MainLayout>
        <div className="text-red-500 text-sm">Error loading movie data.</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-slate-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-4">
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-lg bg-slate-900">
            {movie.poster_path && (
              <img
                src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="col-span-8 flex flex-col justify-start pt-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                {movie.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                <span>{movie.release_date?.split("-")[0]}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{movie.runtime}m</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="px-1.5 py-0.5 border border-slate-200 text-slate-500 rounded text-[10px]">
                  {movie.adult ? "R" : "PG-13"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-amber-50 border border-amber-100 rounded-lg px-2 py-1 flex items-center gap-1.5 text-xs font-extrabold text-amber-600">
                ★ {movie.vote_average?.toFixed(1)}
              </div>
              <span className="text-xs font-medium text-slate-400">
                ({movie.vote_count} votes)
              </span>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-current" /> Add to Favorites
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Overview
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">
              {movie.overview || "No description provided."}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Genres
            </h3>
            <div className="flex items-center gap-2">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <div className="max-w-xl border-t border-slate-100 pt-6">
            <div className="grid grid-cols-12 gap-y-3.5 text-xs">
              <div className="col-span-3 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Release Date
              </div>
              <div className="col-span-9 text-slate-700 font-semibold">
                {movie.release_date}
              </div>

              <div className="col-span-3 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Language
              </div>
              <div className="col-span-9 text-slate-700 font-semibold uppercase">
                {movie.original_language}
              </div>

              <div className="col-span-3 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Budget
              </div>
              <div className="col-span-9 text-slate-700 font-semibold">
                {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
              </div>

              <div className="col-span-3 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Revenue
              </div>
              <div className="col-span-9 text-slate-700 font-semibold">
                {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-slate-100 pt-8">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
          Similar Movies
        </h3>
        {loadingSimilar ? (
          <div className="text-slate-400 text-xs">Loading updates...</div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {similar?.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/movie/${m.id}`)}
                className="group flex flex-col gap-2 cursor-pointer"
              >
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-100 shadow-sm transition-all group-hover:scale-[1.01]">
                  {m.poster_path ? (
                    <img
                      src={`${TMDB_IMAGE_BASE}${m.poster_path}`}
                      alt={m.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    ★ {m.vote_average?.toFixed(1)}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                    {m.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
