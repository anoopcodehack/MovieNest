import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import MovieCard from "./MovieCard";

function MovieSlider({ title, movies = [], favorites = [], onFavToggle }) {
  if (!movies || !movies.length) return null;

  return (
    <section className="movie-slider">
      <div className="row-header">
        <div className="row-title-container">
          <div className="row-accent-bar" />
          <h2 className="row-title">{title}</h2>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={18}
        slidesPerView={5}
        navigation
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 14 },
          900: { slidesPerView: 4, spaceBetween: 16 },
          1200: { slidesPerView: 5, spaceBetween: 18 },
          1440: { slidesPerView: 6, spaceBetween: 20 },
        }}
      >
        {movies.map((movie) => {
          const isFavorite = favorites.some((f) => f.id === movie.id);
          return (
            <SwiperSlide key={movie.id}>
              <MovieCard
                movie={movie}
                isFav={isFavorite}
                onFavToggle={onFavToggle}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

export default MovieSlider;
