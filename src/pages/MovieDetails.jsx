import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../api/tmdb";
import {
  StarIcon,
  ClockIcon,
  CalendarIcon,
  ArrowLeftIcon,
  HeartIcon,
  CheckIcon,
} from "../components/Icons";
import { SkeletonSpinner } from "../components/Loader";

function MovieDetails({ favorites = [], onAddFavorite, onRemoveFavorite }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SkeletonSpinner text="Loading cinematic details..." />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="empty-favorites">
        <h3>Movie Not Found</h3>
        <p>We couldn't retrieve the details for this title.</p>
        <Link to="/" className="btn-primary-cta">
          Back to Home
        </Link>
      </div>
    );
  }

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80";

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80";

  const releaseYear = movie.release_date?.slice(0, 4) || "N/A";
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "N/A";

  // Format runtime from minutes to hours and minutes (e.g. 135 mins -> 2h 15m)
  const formatRuntime = (mins) => {
    if (!mins) return "N/A";
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
      {/* Atmospheric Backdrop Header */}
      <div className="details-hero">
        <img src={backdrop} alt={movie.title} className="details-backdrop-img" />
        <div className="details-backdrop-overlay" />
      </div>

      {/* Main Details Section */}
      <div className="details-container">
        {/* Left: Poster Box */}
        <div className="details-poster-box">
          <img
            src={poster}
            alt={movie.title}
            className="details-poster-img"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80";
            }}
          />
        </div>

        {/* Right: Info Box */}
        <div className="details-info-box">
          <Link to="/" className="back-btn">
            <ArrowLeftIcon size={16} />
            <span>Back to Movies</span>
          </Link>

          <h1 className="details-title">{movie.title}</h1>

          {movie.tagline && (
            <p className="details-tagline">"{movie.tagline}"</p>
          )}

          {/* Metadata Chips */}
          <div className="details-meta-row">
            <span className="meta-chip gold">
              <StarIcon size={15} color="#f5c518" />
              <strong>{rating}</strong>
              <span style={{ opacity: 0.65, fontSize: "11px" }}>/ 10</span>
            </span>

            <span className="meta-chip">
              <ClockIcon size={14} />
              {formatRuntime(movie.runtime)}
            </span>

            <span className="meta-chip">
              <CalendarIcon size={14} />
              {movie.release_date || releaseYear}
            </span>

            {movie.status && (
              <span className="meta-chip" style={{ color: "#22c55e" }}>
                {movie.status}
              </span>
            )}
          </div>

          {/* Genre Badges */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="details-genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-pill">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="details-actions">
            <button
              type="button"
              className={isFavorite ? "btn-secondary-cta" : "btn-primary-cta"}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? (
                <>
                  <CheckIcon size={18} color="#22c55e" />
                  <span>In Your Watchlist</span>
                </>
              ) : (
                <>
                  <HeartIcon size={18} />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>
          </div>

          {/* Overview */}
          <h3 className="details-overview-title">Storyline</h3>
          <p className="details-overview-text">
            {movie.overview || "No overview available for this title."}
          </p>

          {/* Cast Carousel / Grid */}
          {castList.length > 0 && (
            <div className="cast-section">
              <h3 className="cast-section-title">Top Billed Cast</h3>
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
    </div>
  );
}

export default MovieDetails;
