import { useParams, useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails, getTvVideos, getMovieVideos } from "../api/tmdb";
import {
  StarIcon,
  ClockIcon,
  CalendarIcon,
  ArrowLeftIcon,
  PlusIcon,
  CheckIcon,
  PlayIcon,
} from "../components/Icons";
import { SkeletonSpinner } from "../components/Loader";
import TrailerModal from "../components/TrailerModal";

function MovieDetails({ favorites = [], onAddFavorite, onRemoveFavorite }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isTv = searchParams.get("type") === "tv";

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Trailer Modal state
  const [trailerData, setTrailerData] = useState({
    isOpen: false,
    videoKey: null,
    title: "",
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getMovieDetails(id)
      .then((data) => {
        if (!isMounted) return;
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("MovieDetails fetch error:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePlayTrailer = async () => {
    if (!movie) return;
    try {
      // Check if videos are already appended in movie object
      let videos = movie.videos?.results || [];

      if (!videos.length) {
        const res = isTv ? await getTvVideos(id) : await getMovieVideos(id);
        videos = res.results || [];
      }

      const trailer =
        videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
        videos.find((v) => v.site === "YouTube");

      setTrailerData({
        isOpen: true,
        videoKey: trailer ? trailer.key : null,
        title: movie.title || movie.name || "Trailer",
      });
    } catch (err) {
      console.error("Error opening trailer:", err);
      setTrailerData({
        isOpen: true,
        videoKey: null,
        title: movie.title || movie.name || "Trailer",
      });
    }
  };

  const closeTrailer = () => {
    setTrailerData({ isOpen: false, videoKey: null, title: "" });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SkeletonSpinner text="Loading title..." />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="empty-state">
        <h3>Title Not Found</h3>
        <p>We couldn't retrieve the details for this title.</p>
        <Link to="/" className="btn-primary">
          Back to Browse
        </Link>
      </div>
    );
  }

  const title = movie.title || movie.name || "Untitled";
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80";

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80";

  const releaseDate = movie.release_date || movie.first_air_date || "";
  const releaseYear = releaseDate ? releaseDate.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "N/A";

  const formatRuntime = (mins) => {
    if (!mins) return isTv ? "TV Series" : "N/A";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const isFavorite = favorites.some((f) => f.id === movie.id);

  const handleToggleFavorite = () => {
    if (!onAddFavorite || !onRemoveFavorite) return;
    if (isFavorite) {
      onRemoveFavorite(movie.id);
    } else {
      onAddFavorite(movie);
    }
  };

  const castList = movie.credits?.cast?.slice(0, 10) || [];

  return (
    <div className="details-page">
      {/* Cinematic Backdrop */}
      <div className="details-hero">
        <img src={backdrop} alt={title} className="details-backdrop-img" />
        <div className="details-backdrop-overlay" />
      </div>

      {/* Main Details Container */}
      <div className="details-container">
        <div className="details-poster-box">
          <img
            src={poster}
            alt={title}
            className="details-poster-img"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80";
            }}
          />
        </div>

        <div className="details-info-box">
          <Link to="/" className="back-btn">
            <ArrowLeftIcon size={16} />
            <span>Back to Browse</span>
          </Link>

          <h1 className="details-title">{title}</h1>

          {movie.tagline && (
            <p className="details-tagline">"{movie.tagline}"</p>
          )}

          {/* Clean Meta Row */}
          <div className="details-meta-row">
            <span className="details-rating">
              <StarIcon size={15} color="#e5a916" />
              <strong>{rating}</strong>
              <span className="details-rating-max">/10</span>
            </span>

            <span className="meta-divider">•</span>

            <span className="meta-text">
              <ClockIcon size={14} />
              {formatRuntime(movie.runtime)}
            </span>

            <span className="meta-divider">•</span>

            <span className="meta-text">
              <CalendarIcon size={14} />
              {releaseDate || releaseYear}
            </span>

            <span className="meta-divider">•</span>

            <span className="quality-pill">{isTv ? "TV" : "HD"}</span>
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="details-genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-tag">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Actions: Watch Trailer & My List */}
          <div className="details-actions">
            <button
              type="button"
              className="btn-play-action"
              onClick={handlePlayTrailer}
            >
              <PlayIcon size={18} />
              <span>Watch Trailer</span>
            </button>

            <button
              type="button"
              className={isFavorite ? "btn-secondary" : "btn-secondary"}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? (
                <>
                  <CheckIcon size={18} />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <PlusIcon size={18} />
                  <span>Add to My List</span>
                </>
              )}
            </button>
          </div>

          {/* Synopsis */}
          <h3 className="details-section-title">Overview</h3>
          <p className="details-overview-text">
            {movie.overview || "No overview available for this title."}
          </p>

          {/* Cast */}
          {castList.length > 0 && (
            <div className="cast-section">
              <h3 className="details-section-title">Cast</h3>
              <div className="cast-grid">
                {castList.map((actor) => {
                  const photo = actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

                  return (
                    <div key={actor.id} className="cast-card">
                      <img
                        src={photo}
                        alt={actor.name}
                        className="cast-photo"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                        }}
                      />
                      <p className="cast-name" title={actor.name}>
                        {actor.name}
                      </p>
                      <p className="cast-character" title={actor.character}>
                        {actor.character || "Cast"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={trailerData.isOpen}
        onClose={closeTrailer}
        videoKey={trailerData.videoKey}
        title={trailerData.title}
      />
    </div>
  );
}

export default MovieDetails;
