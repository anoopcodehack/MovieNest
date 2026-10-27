import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { StarIcon, PlusIcon, CheckIcon, PlayIcon, InfoIcon } from "./Icons";

function MovieCard({ movie, isFav, onFavToggle, onPlayTrailer }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

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

  // Dynamic 3D tilt calculation based on cursor position
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Tilt up/down
    const rotateY = ((x - centerX) / centerX) * 9;  // Tilt left/right

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX,
      glareY,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      x: 0,
      y: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

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
    <div
      ref={cardRef}
      className={`movie-card ${tilt.isHovered ? "card-hovered" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px) scale3d(1.05, 1.05, 1.05)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)",
        transition: tilt.isHovered
          ? "transform 0.08s ease-out, box-shadow 0.2s ease"
          : "transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s ease",
      }}
    >
      {/* Specular Interactive Lighting Glare */}
      <div
        className="card-glare"
        style={{
          opacity: tilt.isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 70%)`,
        }}
      />

      {/* Poster Image */}
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

          <button
            type="button"
            className={`card-btn-list ${isFav ? "active" : ""}`}
            onClick={handleFavClick}
            title={isFav ? "Remove from My List" : "Add to My List"}
          >
            {isFav ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
          </button>

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
