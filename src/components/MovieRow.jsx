import { memo } from "react";
import MovieCard from "./MovieCard";

function MovieRow({
  title,
  movies = [],
  favorites = [],
  onFavToggle,
  onPlayTrailer,
}) {
  if (!movies || !movies.length) return null;

  return (
    <section className="row">
      <div className="row-header">
        <div className="row-title-container">
          <h2 className="row-title">{title}</h2>
        </div>
      </div>

      <div className="row-scroll">
        {movies.map((movie) => {
          const isFavorite = favorites.some((f) => f.id === movie.id);
          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFav={isFavorite}
              onFavToggle={onFavToggle}
              onPlayTrailer={onPlayTrailer}
            />
          );
        })}
      </div>
    </section>
  );
}

export default memo(MovieRow);
