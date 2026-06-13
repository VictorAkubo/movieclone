import axios from "axios";
import { Movie, MovieDetails } from "../types/tmdb.ts";

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    accept: "application/json",
  },
});

export const fetchNowPlaying = async (): Promise<Movie[]> => {
  const { data } = await tmdbApi.get(
    "/movie/now_playing?language=en-US&page=1",
  );
  return data.results.slice(0, 5);
};

export const fetchPopular = async (): Promise<Movie[]> => {
  const { data } = await tmdbApi.get("/movie/popular?language=en-US&page=1");
  return data.results.slice(0, 6);
};

export const fetchSearchResults = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const { data } = await tmdbApi.get(
    `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
  );
  return data.results;
};

export const fetchMovieDetails = async (id: string): Promise<MovieDetails> => {
  const { data } = await tmdbApi.get(`/movie/${id}?language=en-US`);
  console.log(data);
  return data;
};

export const fetchSimilarMovies = async (id: string): Promise<Movie[]> => {
  const { data } = await tmdbApi.get(
    `/movie/${id}/similar?language=en-US&page=1`,
  );
  return data.results.slice(0, 5);
};
