import { Link } from "react-router-dom";
import { PlayIcon, PlusIcon, CheckIcon, StarIcon, InfoIcon } from "./Icons";

function HeroBanner({ movie, isFav, onFavToggle, onPlayTrailer }) {
  if (!movie) return null;

  const title = movie.title || movie.name || "Featured Title";
  const releaseDate = movie.release_date || movie.first_air_date || "";
  const year = releaseDate ? releaseDate.slice(0, 4) : "2025";
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "N/A";
  const isTv = Boolean(movie.first_air_date || movie.name);
  const detailLink = `/movie/${movie.id}${isTv ? "?type=tv" : ""}`;

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="hero-banner">
      <div className="hero-backdrop-container">
        <img src={backdrop} alt={title} className="hero-backdrop-img" />
        <div className="hero-gradient-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-tag">
          <span className="hero-tag-badge">TOP 10</span>
          <span className="hero-tag-text">
            {isTv ? "#1 in TV Shows Today" : "#1 in Movies Today"}
          </span>
        </div>

        <Link to={detailLink} style={{ color: "inherit" }}>
          <h1 className="hero-title">{title}</h1>
        </Link>

        <div className="hero-meta">
          <span className="hero-rating">
            <StarIcon size={15} color="#e5a916" />
            <strong>{rating}</strong>
          </span>
          <span className="hero-meta-divider">•</span>
          <span>{year}</span>
          <span className="hero-meta-divider">•</span>
          <span className="hero-quality-badge">{isTv ? "TV-MA" : "HD"}</span>
        </div>

        <p className="hero-overview">
          {movie.overview || "Stream trending releases and discover award-winning titles on MovieNest."}
        </p>

        <div className="hero-actions">
          {/* Watch Trailer */}
          {onPlayTrailer && (
            <button
              type="button"
              className="hero-btn-play"
              onClick={() => onPlayTrailer(movie)}
              title="Watch Trailer"
            >
              <PlayIcon size={20} />
              <span>Watch Trailer</span>
            </button>
          )}

          {/* More Info */}
          <Link to={detailLink} className="hero-btn-info" title="Full details and cast">
            <InfoIcon size={19} />
            <span>More Info</span>
          </Link>

          {/* Watchlist */}
          <button
            type="button"
            className="hero-btn-list"
            onClick={() => onFavToggle(movie)}
            title={isFav ? "In My List" : "Add to My List"}
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
