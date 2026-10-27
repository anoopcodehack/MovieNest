const API_KEY = process.env.REACT_APP_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchTMDB = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB fetch failed");
  return res.json();
};

/* ================= Movies API ================= */
export const getTrending = () =>
  fetchTMDB(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);

export const getPopular = (page = 1) =>
  fetchTMDB(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);

export const getTopRated = () =>
  fetchTMDB(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);

export const getUpcoming = () =>
  fetchTMDB(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);

export const searchMovies = (query) =>
  fetchTMDB(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );

export const getMovieDetails = (id) =>
  fetchTMDB(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar`
  );

export const getMovieVideos = (id) =>
  fetchTMDB(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);

/* ================= TV Series API ================= */
export const getTrendingTv = () =>
  fetchTMDB(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);

export const getPopularTv = (page = 1) =>
  fetchTMDB(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);

export const getTopRatedTv = () =>
  fetchTMDB(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);

export const getOnTheAirTv = () =>
  fetchTMDB(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`);

export const getTvVideos = (id) =>
  fetchTMDB(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}`);

/* ================= People / Cast API ================= */
export const getPersonDetails = (id) =>
  fetchTMDB(
    `${BASE_URL}/person/${id}?api_key=${API_KEY}&append_to_response=movie_credits`
  );

/* ================= Discover & Genres API ================= */
export const getGenres = () =>
  fetchTMDB(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);

export const discoverMovies = ({
  genreId = "",
  sortBy = "popularity.desc",
  year = "",
  page = 1,
} = {}) => {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}`;
  if (genreId) url += `&with_genres=${genreId}`;
  if (year) url += `&primary_release_year=${year}`;
  return fetchTMDB(url);
};
