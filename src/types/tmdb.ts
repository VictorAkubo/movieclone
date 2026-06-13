export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  adult: boolean;
  vote_average: number;
  vote_count: number;
  overview: string;
  genres: Genre[];
  original_language: string;
  budget: number;
  revenue: number;
}