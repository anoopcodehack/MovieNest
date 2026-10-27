import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  searchMovies,
} from "../api/tmdb";
import MovieRow from "../components/MovieRow";
import MovieSlider from "../components/MovieSlider";
import HeroBanner from "../components/HeroBanner";
import MovieCard from "../components/MovieCard";
import { SkeletonHero, SkeletonRow, SkeletonSpinner } from "../components/Loader";
import { SearchIcon, CloseIcon } from "../components/Icons";

function Home({ favorites, onAddFavorite, onRemoveFavorite }) {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [popularPage, setPopularPage] = useState(1);
  const [popularLoading, setPopularLoading] = useState(false);
  const [popularHasMore, setPopularHasMore] = useState(true);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // Initial fetch for main categories
  useEffect(() => {
    let isMounted = true;
    setLoadingInitial(true);

    Promise.allSettled([
      getTrending(),
      getPopular(1),
      getTopRated(),
      getUpcoming(),
    ]).then(([trendingRes, popularRes, topRatedRes, upcomingRes]) => {
      if (!isMounted) return;

      if (trendingRes.status === "fulfilled") {
        setTrending(trendingRes.value.results || []);
      }
      if (popularRes.status === "fulfilled") {
        setPopular(popularRes.value.results || []);
        setPopularPage(2);
      }
      if (topRatedRes.status === "fulfilled") {
        setTopRated(topRatedRes.value.results || []);
      }
      if (upcomingRes.status === "fulfilled") {
        setUpcoming(upcomingRes.value.results || []);
      }

      setLoadingInitial(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Search Query when URL search parameter changes
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let isMounted = true;
    setSearchLoading(true);

    searchMovies(query)
      .then((data) => {
        if (!isMounted) return;
        setSearchResults(data.results || []);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.error("Search error:", err);
        if (isMounted) {
          setSearchResults([]);
          setSearchLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  // Infinite scroll loader for Popular movies
  const loadMorePopular = useCallback(async () => {
    if (popularLoading || !popularHasMore || query) return;

    setPopularLoading(true);
    try {
      const data = await getPopular(popularPage);
      if (!data.results || data.results.length === 0) {
        setPopularHasMore(false);
      } else {
        setPopular((prev) => [...prev, ...data.results]);
        setPopularPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Popular fetch error:", err);
    } finally {
      setPopularLoading(false);
    }
  }, [popularLoading, popularHasMore, popularPage, query]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400
      ) {
        loadMorePopular();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePopular]);

  const handleFavToggle = (movie) => {
    const isFav = favorites.some((f) => f.id === movie.id);
    if (isFav) {
      onRemoveFavorite(movie.id);
    } else {
      onAddFavorite(movie);
    }
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  // If search query is active
  if (query.trim()) {
    return (
      <main className="search-results-section">
        <div className="search-results-header">
          <div>
            <h1 className="search-results-title">
              Search Results for <span style={{ color: "var(--accent)" }}>"{query}"</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
              {searchResults.length} {searchResults.length === 1 ? "movie" : "movies"} found
            </p>
          </div>

          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClearSearch}
          >
            <CloseIcon size={14} />
            <span>Clear Search</span>
          </button>
        </div>

        {searchLoading ? (
          <SkeletonSpinner text={`Searching for "${query}"...`} />
        ) : searchResults.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon-wrap">
              <SearchIcon size={32} />
            </div>
            <h3>No movies found</h3>
            <p>We couldn't find any results matching "{query}". Try checking the spelling or searching for another title.</p>
            <button
              type="button"
              className="btn-primary-cta"
              onClick={handleClearSearch}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid">
            {searchResults.map((movie) => {
              const isFavorite = favorites.some((f) => f.id === movie.id);
              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFav={isFavorite}
                  onFavToggle={handleFavToggle}
                />
              );
            })}
          </div>
        )}
      </main>
    );
  }

  // Initial Loading State
  if (loadingInitial) {
    return (
      <main>
        <SkeletonHero />
        <SkeletonRow count={6} />
        <SkeletonRow count={6} />
      </main>
    );
  }

  const featuredMovie = trending.length > 0 ? trending[0] : popular[0];
  const isFeaturedFav = featuredMovie
    ? favorites.some((f) => f.id === featuredMovie.id)
    : false;

  return (
    <main>
      {/* Featured Cinematic Hero Banner */}
      {featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          isFav={isFeaturedFav}
          onFavToggle={handleFavToggle}
        />
      )}

      {/* Quick Category Jump Bar */}
      <div className="filter-bar">
        <span className="filter-pill active">All Categories</span>
        <a href="#trending" className="filter-pill">Trending</a>
        <a href="#top-rated" className="filter-pill">Top Rated</a>
        <a href="#popular" className="filter-pill">Popular</a>
        <a href="#upcoming" className="filter-pill">Upcoming</a>
      </div>

      {/* Trending Movies Slider */}
      <div id="trending">
        <MovieSlider
          title="Trending This Week"
          movies={trending}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
      </div>

      {/* Top Rated Row */}
      <div id="top-rated">
        <MovieRow
          title="Top Rated Masterpieces"
          movies={topRated}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
      </div>

      {/* Popular Movies Row with Infinite Scroll */}
      <div id="popular">
        <MovieRow
          title="Popular Across MovieNest"
          movies={popular}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
        {popularLoading && (
          <SkeletonSpinner text="Loading more popular movies..." />
        )}
      </div>

      {/* Upcoming Movies Row */}
      <div id="upcoming">
        <MovieRow
          title="Upcoming Blockbusters"
          movies={upcoming}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
      </div>
    </main>
  );
}

export default Home;
