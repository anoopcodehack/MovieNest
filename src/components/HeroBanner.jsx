import { Link } from "react-router-dom";
import { PlayIcon, PlusIcon, CheckIcon, StarIcon, SparklesIcon } from "./Icons";

function HeroBanner({ movie, isFav, onFavToggle }) {
  if (!movie) return null;

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80";

  const year = movie.release_date?.slice(0, 4) || "2025";
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "N/A";
  const lang = movie.original_language ? movie.original_language.toUpperCase() : "EN";

  return (
    <div className="hero-banner">
      <div className="hero-backdrop-container">
        <img src={backdrop} alt={movie.title} className="hero-backdrop-img" />
        <div className="hero-gradient-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <SparklesIcon size={14} color="#ff4b55" />
          <span>Featured Spotlight</span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta">
          <span className="meta-chip gold">
            <StarIcon size={14} color="#f5c518" />
            {rating}
          </span>
          <span className="meta-chip">{year}</span>
          <span className="meta-chip">{lang}</span>
          <span className="meta-chip">Ultra HD 4K</span>
        </div>

        <p className="hero-overview">
          {movie.overview || "Discover this trending blockbuster now on MovieNest."}
        </p>

        <div className="hero-actions">
          <Link to={`/movie/${movie.id}`} className="btn-primary-cta">
            <PlayIcon size={18} />
            <span>View Details</span>
          </Link>

          <button
            type="button"
            className="btn-secondary-cta"
            onClick={() => onFavToggle(movie)}
          >
            {isFav ? (
              <>
                <CheckIcon size={18} color="#22c55e" />
                <span>In Watchlist</span>
              </>
            ) : (
              <>
                <PlusIcon size={18} />
                <span>Add to Watchlist</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
