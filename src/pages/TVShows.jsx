import { useEffect, useState, useCallback } from "react";
import {
  getTrendingTv,
  getPopularTv,
  getTopRatedTv,
  getOnTheAirTv,
  getTvVideos,
} from "../api/tmdb";
import MovieRow from "../components/MovieRow";
import MovieSlider from "../components/MovieSlider";
import HeroBanner from "../components/HeroBanner";
import TrailerModal from "../components/TrailerModal";
import { SkeletonHero, SkeletonRow, SkeletonSpinner } from "../components/Loader";

function TVShows({ favorites = [], onAddFavorite, onRemoveFavorite }) {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [popularPage, setPopularPage] = useState(1);
  const [popularLoading, setPopularLoading] = useState(false);
  const [popularHasMore, setPopularHasMore] = useState(true);

  // Trailer Modal state
  const [trailerData, setTrailerData] = useState({
    isOpen: false,
    videoKey: null,
    title: "",
    movieId: null,
    isTv: true,
  });

  useEffect(() => {
    let isMounted = true;
    setLoadingInitial(true);

    Promise.allSettled([
      getTrendingTv(),
      getPopularTv(1),
      getTopRatedTv(),
      getOnTheAirTv(),
    ]).then(([trendingRes, popularRes, topRatedRes, onTheAirRes]) => {
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
      if (onTheAirRes.status === "fulfilled") {
        setOnTheAir(onTheAirRes.value.results || []);
      }

      setLoadingInitial(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const loadMorePopular = useCallback(async () => {
    if (popularLoading || !popularHasMore) return;

    setPopularLoading(true);
    try {
      const data = await getPopularTv(popularPage);
      if (!data.results || data.results.length === 0) {
        setPopularHasMore(false);
      } else {
        setPopular((prev) => [...prev, ...data.results]);
        setPopularPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Popular TV fetch error:", err);
    } finally {
      setPopularLoading(false);
    }
  }, [popularLoading, popularHasMore, popularPage]);

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

  const handleFavToggle = (item) => {
    const isFav = favorites.some((f) => f.id === item.id);
    if (isFav) {
      onRemoveFavorite(item.id);
    } else {
      onAddFavorite(item);
    }
  };

  const handlePlayTrailer = async (item) => {
    try {
      const res = await getTvVideos(item.id);
      const videos = res.results || [];
      const trailer =
        videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
        videos.find((v) => v.site === "YouTube");

      setTrailerData({
        isOpen: true,
        videoKey: trailer ? trailer.key : null,
        title: item.name || item.title || "Series",
        movieId: item.id,
        isTv: true,
      });
    } catch (err) {
      console.error("Error fetching trailer:", err);
      setTrailerData({
        isOpen: true,
        videoKey: null,
        title: item.name || item.title || "Series",
        movieId: item.id,
        isTv: true,
      });
    }
  };

  const closeTrailer = () => {
    setTrailerData({ isOpen: false, videoKey: null, title: "", movieId: null, isTv: true });
  };

  if (loadingInitial) {
    return (
      <main>
        <SkeletonHero />
        <SkeletonRow count={6} />
        <SkeletonRow count={6} />
      </main>
    );
  }

  const featuredShow = trending.length > 0 ? trending[0] : popular[0];
  const isFeaturedFav = featuredShow
    ? favorites.some((f) => f.id === featuredShow.id)
    : false;

  return (
    <main>
      {featuredShow && (
        <HeroBanner
          movie={featuredShow}
          isFav={isFeaturedFav}
          onFavToggle={handleFavToggle}
          onPlayTrailer={handlePlayTrailer}
        />
      )}

      <div id="trending-tv">
        <MovieSlider
          title="Trending TV Series"
          movies={trending}
          favorites={favorites}
          onFavToggle={handleFavToggle}
          onPlayTrailer={handlePlayTrailer}
        />
      </div>

      <div id="top-rated-tv">
        <MovieRow
          title="Critically Acclaimed Shows"
          movies={topRated}
          favorites={favorites}
          onFavToggle={handleFavToggle}
          onPlayTrailer={handlePlayTrailer}
        />
      </div>

      <div id="popular-tv">
        <MovieRow
          title="Popular TV Shows"
          movies={popular}
          favorites={favorites}
          onFavToggle={handleFavToggle}
          onPlayTrailer={handlePlayTrailer}
        />
        {popularLoading && (
          <SkeletonSpinner text="Loading more TV series..." />
        )}
      </div>

      <div id="on-the-air">
        <MovieRow
          title="Currently Airing"
          movies={onTheAir}
          favorites={favorites}
          onFavToggle={handleFavToggle}
          onPlayTrailer={handlePlayTrailer}
        />
      </div>

      <TrailerModal
        isOpen={trailerData.isOpen}
        onClose={closeTrailer}
        videoKey={trailerData.videoKey}
        title={trailerData.title}
        movieId={trailerData.movieId}
        isTv={trailerData.isTv}
      />
    </main>
  );
}

export default TVShows;
