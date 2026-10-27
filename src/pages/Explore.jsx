import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getGenres, discoverMovies, getMovieVideos } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import TrailerModal from "../components/TrailerModal";
import { SkeletonSpinner } from "../components/Loader";

function Explore({ favorites = [], onAddFavorite, onRemoveFavorite }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters read from URL params or default
  const selectedGenre = searchParams.get("genre") || "";
  const selectedSort = searchParams.get("sort") || "popularity.desc";
  const selectedYear = searchParams.get("year") || "";

  // Trailer Modal state
  const [trailerData, setTrailerData] = useState({
    isOpen: false,
    videoKey: null,
    title: "",
  });

  // Fetch genres once on mount
  useEffect(() => {
    getGenres()
      .then((data) => setGenres(data.genres || []))
      .catch((err) => console.error("Error loading genres:", err));
  }, []);

  // Fetch movies whenever filters change (resets to page 1)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    discoverMovies({
      genreId: selectedGenre,
      sortBy: selectedSort,
      year: selectedYear,
      page: 1,
    })
      .then((data) => {
        if (!isMounted) return;
        setMovies(data.results || []);
        setPage(2);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error discovering movies:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedGenre, selectedSort, selectedYear]);

  // Load more movies
  const loadMore = useCallback(async () => {
    if (loadingMore || page > totalPages) return;

    setLoadingMore(true);
    try {
      const data = await discoverMovies({
        genreId: selectedGenre,
        sortBy: selectedSort,
        year: selectedYear,
        page,
      });

      setMovies((prev) => [...prev, ...(data.results || [])]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading more movies:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, totalPages, selectedGenre, selectedSort, selectedYear]);

  // Filter change handlers (syncs with URL query params)
  const handleGenreChange = (genreId) => {
    const params = new URLSearchParams(searchParams);
    if (genreId) {
      params.set("genre", String(genreId));
    } else {
      params.delete("genre");
    }
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value);
    setSearchParams(params);
  };

  const handleYearChange = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("year", e.target.value);
    } else {
      params.delete("year");
    }
    setSearchParams(params);
  };

  const handleFavToggle = (movie) => {
    const isFav = favorites.some((f) => f.id === movie.id);
    if (isFav) {
      onRemoveFavorite(movie.id);
    } else {
      onAddFavorite(movie);
    }
  };

  const handlePlayTrailer = async (movie) => {
    try {
      const res = await getMovieVideos(movie.id);
      const videos = res.results || [];
      const trailer =
        videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
        videos.find((v) => v.site === "YouTube");

      setTrailerData({
        isOpen: true,
        videoKey: trailer ? trailer.key : null,
        title: movie.title || "Movie",
      });
    } catch (err) {
      console.error("Error fetching trailer:", err);
      setTrailerData({
        isOpen: true,
        videoKey: null,
        title: movie.title || "Movie",
      });
    }
  };

  const closeTrailer = () => {
    setTrailerData({ isOpen: false, videoKey: null, title: "" });
  };

  return (
    <main className="explore-page">
      <div className="explore-header">
        <h1 className="explore-title">Explore Catalog</h1>
        <p className="explore-subtitle">
          Discover titles filtered by genre, release year, and critical rating.
        </p>

        {/* Filter Toolbar */}
        <div className="explore-controls">
          <div className="explore-select-group">
            <label htmlFor="sort-select">Sort By:</label>
            <select
              id="sort-select"
              className="explore-select"
              value={selectedSort}
              onChange={handleSortChange}
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Latest Releases</option>
              <option value="revenue.desc">Top Box Office</option>
            </select>
          </div>

          <div className="explore-select-group">
            <label htmlFor="year-select">Release Year:</label>
            <select
              id="year-select"
              className="explore-select"
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2020">2020</option>
              <option value="2010">2010s</option>
              <option value="2000">2000s</option>
            </select>
          </div>
        </div>

        {/* Genre Filter Chips */}
        <div className="genre-filter-bar">
          <button
            type="button"
            className={`genre-filter-chip ${!selectedGenre ? "active" : ""}`}
            onClick={() => handleGenreChange("")}
          >
            All Genres
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`genre-filter-chip ${
                String(selectedGenre) === String(g.id) ? "active" : ""
              }`}
              onClick={() => handleGenreChange(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <SkeletonSpinner text="Exploring titles..." />
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <h3>No titles found</h3>
          <p>Try broadening your filters to find available movies.</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {movies.map((movie) => {
              const isFavorite = favorites.some((f) => f.id === movie.id);
              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFav={isFavorite}
                  onFavToggle={handleFavToggle}
                  onPlayTrailer={handlePlayTrailer}
                />
              );
            })}
          </div>

          {page <= totalPages && (
            <div className="explore-load-more">
              <button
                type="button"
                className="btn-secondary"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading more..." : "Load More Titles"}
              </button>
            </div>
          )}
        </>
      )}

      <TrailerModal
        isOpen={trailerData.isOpen}
        onClose={closeTrailer}
        videoKey={trailerData.videoKey}
        title={trailerData.title}
      />
    </main>
  );
}

export default Explore;
