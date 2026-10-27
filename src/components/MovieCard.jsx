import { Link } from "react-router-dom";
import { StarIcon, HeartIcon } from "./Icons";

function MovieCard({ movie, isFav, onFavToggle }) {
  if (!movie) return null;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80";

  const year = movie.release_date?.slice(0, 4) || "N/A";
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "—";

  const handleFavClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavToggle(movie);
  };

  return (
    <div className="movie-card">
      <img
        src={poster}
        alt={movie.title || "Movie Poster"}
        className="movie-poster-img"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80";
        }}
      />

      {/* Floating Rating Pill */}
      {rating !== "—" && (
        <div className="card-rating-badge">
          <StarIcon size={12} color="#f5c518" />
          <span>{rating}</span>
        </div>
      )}

      {/* Hover Information & Quick Action Overlay */}
      <div className="movie-card-overlay">
        <h4 className="card-title">{movie.title}</h4>
        <div className="card-meta">
          <span>{year}</span>
          <span>•</span>
          <span>{movie.original_language?.toUpperCase() || "HD"}</span>
        </div>

        <div className="card-actions">
          <Link to={`/movie/${movie.id}`} className="card-btn-view">
            View
          </Link>

          <button
            type="button"
            className={`card-btn-fav ${isFav ? "active" : ""}`}
            onClick={handleFavClick}
            title={isFav ? "Remove from Watchlist" : "Add to Watchlist"}
            aria-label={isFav ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <HeartIcon size={16} filled={isFav} color={isFav ? "#fff" : "currentColor"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
