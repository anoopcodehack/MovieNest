import { Link } from "react-router-dom";
import { StarIcon, PlusIcon, CheckIcon, PlayIcon, InfoIcon } from "./Icons";

function MovieCard({ movie, isFav, onFavToggle, onPlayTrailer }) {
  if (!movie) return null;

  const title = movie.title || movie.name || "Untitled";
  const releaseDate = movie.release_date || movie.first_air_date || "";
  const year = releaseDate ? releaseDate.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "—";
  const isTv = Boolean(movie.first_air_date || movie.name);
  const detailLink = `/movie/${movie.id}${isTv ? "?type=tv" : ""}`;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80";

  const handleFavClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavToggle(movie);
  };

  const handlePlayClick = (e) => {
    if (onPlayTrailer) {
      e.preventDefault();
      e.stopPropagation();
      onPlayTrailer(movie);
    }
  };

  return (
    <div className="movie-card">
      {/* Clicking poster navigates to Movie Details */}
      <Link to={detailLink} className="movie-card-link">
        <img
          src={poster}
          alt={title}
          className="movie-poster-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80";
          }}
        />
      </Link>

      {/* Floating Rating Badge */}
      {rating !== "—" && (
        <div className="card-rating-badge">
          <StarIcon size={11} color="#e5a916" />
          <span>{rating}</span>
        </div>
      )}

      {/* Hover Information Overlay */}
      <div className="movie-card-overlay">
        <Link to={detailLink} className="card-title-link">
          <h4 className="card-title">{title}</h4>
        </Link>

        <div className="card-meta">
          <span>{year}</span>
          <span>•</span>
          <span className="card-quality">{isTv ? "TV" : "HD"}</span>
        </div>

        <div className="card-actions">
          {/* Play / Watch Trailer */}
          {onPlayTrailer ? (
            <button
              type="button"
              className="card-btn-play"
              onClick={handlePlayClick}
              title="Watch Trailer"
            >
              <PlayIcon size={14} />
              <span>Play</span>
            </button>
          ) : (
            <Link to={detailLink} className="card-btn-play" title="View details">
              <PlayIcon size={14} />
              <span>Play</span>
            </Link>
          )}

          {/* Add / Remove from My List */}
          <button
            type="button"
            className={`card-btn-list ${isFav ? "active" : ""}`}
            onClick={handleFavClick}
            title={isFav ? "Remove from My List" : "Add to My List"}
          >
            {isFav ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
          </button>

          {/* Explicit "More Info" button */}
          <Link
            to={detailLink}
            className="card-btn-info"
            title="More Info (Cast & Details)"
          >
            <InfoIcon size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
