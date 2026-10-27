import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";

function Favorites({ favorites = [], onRemoveFavorite }) {
  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1 className="favorites-title">My List</h1>
        {favorites.length > 0 && (
          <span className="favorites-count">{favorites.length} Titles</span>
        )}
      </div>

      {favorites.length === 0 ? (
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
