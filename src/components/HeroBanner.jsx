import { Link } from "react-router-dom";
import { PlayIcon, PlusIcon, CheckIcon, StarIcon } from "./Icons";

function HeroBanner({ movie, isFav, onFavToggle }) {
  if (!movie) return null;

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80";

  const year = movie.release_date?.slice(0, 4) || "2025";
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "N/A";

  return (
    <div className="hero-banner">
      <div className="hero-backdrop-container">
        <img src={backdrop} alt={movie.title} className="hero-backdrop-img" />
        <div className="hero-gradient-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-tag">
          <span className="hero-tag-badge">TOP 10</span>
          <span className="hero-tag-text">#1 in Movies Today</span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta">
          <span className="hero-rating">
            <StarIcon size={15} color="#e5a916" />
            <strong>{rating}</strong>
          </span>
          <span className="hero-meta-divider">•</span>
          <span>{year}</span>
          <span className="hero-meta-divider">•</span>
          <span className="hero-quality-badge">HD</span>
        </div>

        <p className="hero-overview">
          {movie.overview || "Stream trending releases and discover award-winning titles on MovieNest."}
        </p>

        <div className="hero-actions">
          <Link to={`/movie/${movie.id}`} className="hero-btn-play">
            <PlayIcon size={20} />
            <span>Play</span>
          </Link>

          <button
            type="button"
            className="hero-btn-list"
            onClick={() => onFavToggle(movie)}
          >
            {isFav ? (
              <>
                <CheckIcon size={20} />
                <span>In My List</span>
              </>
            ) : (
              <>
                <PlusIcon size={20} />
                <span>My List</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
