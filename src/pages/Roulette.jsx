import { useState } from "react";
import { Link } from "react-router-dom";
import { discoverMovies, getMovieVideos } from "../api/tmdb";
import { PlayIcon, PlusIcon, CheckIcon, StarIcon, InfoIcon } from "../components/Icons";
import TrailerModal from "../components/TrailerModal";

const MOODS = [
  { id: "scifi", label: "Mind-Bending", genreId: 878, desc: "Sci-Fi & High Concept" },
  { id: "action", label: "Adrenaline Rush", genreId: 28, desc: "Fast-paced Action & Adventure" },
  { id: "comedy", label: "Feel Good", genreId: 35, desc: "Hilarious & Uplifting Comedy" },
  { id: "thriller", label: "Edge-of-Your-Seat", genreId: 53, desc: "Mystery & Psychological Thriller" },
  { id: "drama", label: "Deep & Emotional", genreId: 18, desc: "Critically Acclaimed Drama" },
  { id: "horror", label: "Late Night Spooky", genreId: 27, desc: "Horror & Suspense" },
];

function Roulette({ favorites = [], onAddFavorite, onRemoveFavorite }) {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [resultMovie, setResultMovie] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [trailerData, setTrailerData] = useState({
    isOpen: false,
    videoKey: null,
    title: "",
    movieId: null,
  });

  const handleSpin = async () => {
    setIsSpinning(true);
    try {
      // Pick a random page between 1 and 4 to ensure diverse titles
      const randomPage = Math.floor(Math.random() * 4) + 1;
      const data = await discoverMovies({
        genreId: selectedMood.genreId,
        sortBy: "vote_average.desc",
        page: randomPage,
      });

      const pool = (data.results || []).filter(
        (m) => m.vote_count > 150 && m.poster_path && m.backdrop_path
      );

      // Simulate a 1-second shuffle experience
      setTimeout(() => {
        if (pool.length > 0) {
          const randomIndex = Math.floor(Math.random() * pool.length);
          setResultMovie(pool[randomIndex]);
        }
        setIsSpinning(false);
      }, 900);
    } catch (err) {
      console.error("Roulette spin error:", err);
      setIsSpinning(false);
    }
  };

  const isFavorite = resultMovie ? favorites.some((f) => f.id === resultMovie.id) : false;

  const handleFavToggle = () => {
    if (!resultMovie) return;
    if (isFavorite) {
      onRemoveFavorite(resultMovie.id);
    } else {
      onAddFavorite(resultMovie);
    }
  };

  const handlePlayTrailer = async () => {
    if (!resultMovie) return;
    try {
      const res = await getMovieVideos(resultMovie.id);
      const videos = res.results || [];
      const trailer =
        videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
        videos.find((v) => v.site === "YouTube");

      setTrailerData({
        isOpen: true,
        videoKey: trailer ? trailer.key : null,
        title: resultMovie.title || "Movie",
        movieId: resultMovie.id,
      });
    } catch (err) {
      console.error("Error opening trailer:", err);
      setTrailerData({
        isOpen: true,
        videoKey: null,
        title: resultMovie.title || "Movie",
        movieId: resultMovie.id,
      });
    }
  };

  const closeTrailer = () => {
    setTrailerData({ isOpen: false, videoKey: null, title: "", movieId: null });
  };

  const backdrop = resultMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${resultMovie.backdrop_path}`
    : null;

  const poster = resultMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${resultMovie.poster_path}`
    : null;

  return (
    <main className="roulette-page">
      <div className="roulette-container">
        <header className="roulette-header">
          <h1 className="roulette-title">Movie Roulette</h1>
          <p className="roulette-subtitle">
            Beat choice paralysis. Pick your current vibe and roll for a verified high-rated title.
          </p>
        </header>

        {/* Mood Selector Pills */}
        <div className="roulette-mood-grid">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              className={`roulette-mood-btn ${
                selectedMood.id === mood.id ? "active" : ""
              }`}
              onClick={() => setSelectedMood(mood)}
            >
              <span className="mood-btn-label">{mood.label}</span>
              <span className="mood-btn-desc">{mood.desc}</span>
            </button>
          ))}
        </div>

        {/* Spin CTA Button */}
        <div className="roulette-action-wrap">
          <button
            type="button"
            className={`btn-roulette-spin ${isSpinning ? "spinning" : ""}`}
            onClick={handleSpin}
            disabled={isSpinning}
          >
            <span>{isSpinning ? "Selecting Title..." : "Roll The Dice 🎲"}</span>
          </button>
        </div>

        {/* Picked Movie Showcase */}
        {resultMovie && !isSpinning && (
          <div className="roulette-showcase-card">
            {backdrop && (
              <div className="roulette-showcase-backdrop">
                <img src={backdrop} alt="" />
                <div className="roulette-showcase-overlay" />
              </div>
            )}

            <div className="roulette-showcase-content">
              {poster && (
                <div className="roulette-showcase-poster">
                  <img src={poster} alt={resultMovie.title} />
                </div>
              )}

              <div className="roulette-showcase-info">
                <span className="roulette-picked-badge">Match Found</span>
                <h2 className="roulette-movie-title">{resultMovie.title}</h2>

                <div className="roulette-meta">
                  <span className="meta-rating">
                    <StarIcon size={14} color="#e5a916" />
                    <strong>{Number(resultMovie.vote_average).toFixed(1)}</strong>
                  </span>
                  <span>•</span>
                  <span>{resultMovie.release_date?.slice(0, 4) || "N/A"}</span>
                  <span>•</span>
                  <span className="quality-pill">HD</span>
                </div>

                <p className="roulette-overview">{resultMovie.overview}</p>

                <div className="roulette-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handlePlayTrailer}
                  >
                    <PlayIcon size={18} />
                    <span>Watch Trailer</span>
                  </button>

                  <Link
                    to={`/movie/${resultMovie.id}`}
                    className="btn-secondary"
                  >
                    <InfoIcon size={18} />
                    <span>Full Details</span>
                  </Link>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleFavToggle}
                  >
                    {isFavorite ? (
                      <>
                        <CheckIcon size={18} />
                        <span>In My List</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon size={18} />
                        <span>Add to List</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <TrailerModal
        isOpen={trailerData.isOpen}
        onClose={closeTrailer}
        videoKey={trailerData.videoKey}
        title={trailerData.title}
        movieId={trailerData.movieId}
      />
    </main>
  );
}

export default Roulette;
