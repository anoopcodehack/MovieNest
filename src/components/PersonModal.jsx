import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPersonDetails } from "../api/tmdb";
import { StarIcon, CloseIcon } from "./Icons";
import { SkeletonSpinner } from "./Loader";

function PersonModal({ isOpen, onClose, personId }) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    if (!isOpen || !personId) return;

    let isMounted = true;
    setLoading(true);
    setShowFullBio(false);

    getPersonDetails(personId)
      .then((data) => {
        if (!isMounted) return;
        setPerson(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Person details fetch error:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, personId]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter & sort top famous movies
  const topCredits = (person?.movie_credits?.cast || [])
    .filter((m) => m.poster_path && m.vote_count > 50)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 6);

  const photo = person?.profile_path
    ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80";

  return (
    <div className="person-modal-backdrop" onClick={onClose}>
      <div
        className="person-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="person-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon size={20} />
        </button>

        {loading ? (
          <div style={{ padding: "60px 0" }}>
            <SkeletonSpinner text="Loading filmography..." />
          </div>
        ) : !person ? (
          <div className="empty-state">
            <p>Could not load person information.</p>
          </div>
        ) : (
          <div className="person-modal-body">
            {/* Top Profile Card */}
            <div className="person-profile-header">
              <img src={photo} alt={person.name} className="person-avatar" />
              <div className="person-profile-info">
                <h2 className="person-name">{person.name}</h2>
                <div className="person-meta">
                  {person.known_for_department && (
                    <span>Known for: {person.known_for_department}</span>
                  )}
                  {person.birthday && <span>• Born: {person.birthday}</span>}
                  {person.place_of_birth && (
                    <span>• {person.place_of_birth}</span>
                  )}
                </div>

                {person.biography && (
                  <p className="person-biography">
                    {showFullBio
                      ? person.biography
                      : `${person.biography.slice(0, 260)}...`}
                    {person.biography.length > 260 && (
                      <button
                        type="button"
                        className="btn-bio-toggle"
                        onClick={() => setShowFullBio(!showFullBio)}
                      >
                        {showFullBio ? " Read Less" : " Read More"}
                      </button>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Top Filmography Credits */}
            {topCredits.length > 0 && (
              <div className="person-filmography-section">
                <h3 className="person-filmography-title">
                  Top Acclaimed Roles
                </h3>
                <div className="person-filmography-grid">
                  {topCredits.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/movie/${movie.id}`}
                      className="person-movie-card"
                      onClick={onClose}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        className="person-movie-poster"
                      />
                      <p className="person-movie-title">{movie.title}</p>
                      <div className="person-movie-meta">
                        <span className="person-movie-character">
                          {movie.character ? `as ${movie.character}` : "Cast"}
                        </span>
                        {movie.vote_average > 0 && (
                          <span className="person-movie-score">
                            <StarIcon size={10} color="#e5a916" />
                            {Number(movie.vote_average).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonModal;
