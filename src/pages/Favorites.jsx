import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { ClockIcon, StarIcon, FilmIcon } from "../components/Icons";

function Favorites({ favorites = [], onRemoveFavorite }) {
  // Calculate Binge Watchlist Analytics
  const totalCount = favorites.length;

  const totalMinutes = favorites.reduce((acc, movie) => {
    return acc + (movie.runtime || 115); // Average ~115 mins per movie
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const validRatings = favorites.filter((m) => m.vote_average);
  const avgRating = validRatings.length
    ? (
        validRatings.reduce((acc, m) => acc + Number(m.vote_average), 0) /
        validRatings.length
      ).toFixed(1)
    : "—";

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div>
          <h1 className="favorites-title">My List</h1>
          <p className="favorites-subtitle">
            Curate and track your personal streaming queue with real-time binge insights.
          </p>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="binge-stats-bar">
          <div className="binge-stat-card">
            <span className="binge-stat-icon">
              <ClockIcon size={20} />
            </span>
            <div className="binge-stat-info">
              <span className="binge-stat-value">
                {hours}h {mins}m
              </span>
              <span className="binge-stat-label">Total Binge Time</span>
            </div>
          </div>

          <div className="binge-stat-card">
            <span className="binge-stat-icon">
              <StarIcon size={20} color="#e5a916" />
            </span>
            <div className="binge-stat-info">
              <span className="binge-stat-value">{avgRating} / 10</span>
              <span className="binge-stat-label">Average Score</span>
            </div>
          </div>

          <div className="binge-stat-card">
            <span className="binge-stat-icon">
              <FilmIcon size={20} />
            </span>
            <div className="binge-stat-info">
              <span className="binge-stat-value">{totalCount} Titles</span>
              <span className="binge-stat-label">Queue Length</span>
            </div>
          </div>
        </div>
      )}

      {totalCount === 0 ? (
        <div className="empty-state">
          <h3>Your list is empty</h3>
          <p>
            Explore popular and trending titles to build your personal watchlist.
          </p>
          <Link to="/" className="btn-primary">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFav={true}
              onFavToggle={() => onRemoveFavorite(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
