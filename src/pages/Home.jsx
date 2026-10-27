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
import { CloseIcon } from "../components/Icons";

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

  if (query.trim()) {
    return (
      <main className="search-results-section">
        <div className="search-results-header">
          <div>
            <h1 className="search-results-title">
              Results for "{query}"
            </h1>
            <p className="search-results-count">
              {searchResults.length} {searchResults.length === 1 ? "title" : "titles"}
            </p>
          </div>

          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClearSearch}
          >
            <CloseIcon size={14} />
            <span>Clear</span>
          </button>
        </div>

        {searchLoading ? (
          <SkeletonSpinner text={`Searching for "${query}"...`} />
        ) : searchResults.length === 0 ? (
          <div className="empty-state">
            <h3>No results found</h3>
            <p>Your search for "{query}" did not match any titles.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={handleClearSearch}
            >
              Back to Browse
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
      {featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          isFav={isFeaturedFav}
          onFavToggle={handleFavToggle}
        />
      )}

      <div id="trending">
        <MovieSlider
          title="Trending Now"
          movies={trending}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
      </div>

      <div id="top-rated">
        <MovieRow
          title="Top Rated"
          movies={topRated}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
      </div>

      <div id="popular">
        <MovieRow
          title="Popular on MovieNest"
          movies={popular}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
        {popularLoading && (
          <SkeletonSpinner text="Loading more titles..." />
        )}
      </div>

      <div id="upcoming">
        <MovieRow
          title="Upcoming Releases"
          movies={upcoming}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
      </div>
    </main>
  );
}

export default Home;
