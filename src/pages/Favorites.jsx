import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { FilmIcon, HeartIcon } from "../components/Icons";

function Favorites({ favorites = [], onRemoveFavorite }) {
  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="favorites-title-wrap">
          <HeartIcon size={26} filled color="var(--accent)" />
          <h1 className="favorites-title">My Watchlist</h1>
        </div>

        {favorites.length > 0 && (
          <span className="favorites-count-badge">
            {favorites.length} {favorites.length === 1 ? "Movie" : "Movies"} Saved
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon-wrap">
            <FilmIcon size={34} />
          </div>
          <h3>Your Watchlist is Empty</h3>
          <p>
            You haven't saved any movies yet. Browse trending titles and tap the
            heart icon on any movie card to add it to your personal watchlist!
          </p>
          <Link to="/" className="btn-primary-cta">
            Explore Trending Movies
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
