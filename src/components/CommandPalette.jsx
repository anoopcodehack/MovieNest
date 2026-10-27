import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../api/tmdb";
import useDebounce from "../hooks/useDebounce";
import { SearchIcon, StarIcon, CloseIcon } from "./Icons";

function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 350);

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search when debounced query updates
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    searchMovies(debouncedQuery)
      .then((data) => {
        if (!isMounted) return;
        setResults((data.results || []).slice(0, 8)); // Top 8 results
        setSelectedIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Command palette search error:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Keyboard navigation inside command palette
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        const item = results[selectedIndex];
        const isTv = Boolean(item.first_air_date || item.name);
        navigate(`/movie/${item.id}${isTv ? "?type=tv" : ""}`);
        onClose();
      }
    }
  };

  const handleSelectNav = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-backdrop" onClick={onClose}>
      <div
        className="cmd-palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="cmd-input-wrap">
          <SearchIcon size={18} color="#888" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Type a movie, TV show, or press Esc to close..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="cmd-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Quick Nav Suggestions when query is empty */}
        {!query && (
          <div className="cmd-suggestions">
            <span className="cmd-section-label">Quick Jump</span>
            <div
              className="cmd-item"
              onClick={() => handleSelectNav("/")}
            >
              <span>🎬 Browse Trending Movies</span>
              <kbd className="cmd-kbd">Home</kbd>
            </div>
            <div
              className="cmd-item"
              onClick={() => handleSelectNav("/tv")}
            >
              <span>📺 TV Shows & Series</span>
              <kbd className="cmd-kbd">TV</kbd>
            </div>
            <div
              className="cmd-item"
              onClick={() => handleSelectNav("/explore")}
            >
              <span>🧭 Explore Catalog by Genre</span>
              <kbd className="cmd-kbd">Catalog</kbd>
            </div>
            <div
              className="cmd-item"
              onClick={() => handleSelectNav("/roulette")}
            >
              <span>🎲 Movie Roulette (Mood Picker)</span>
              <kbd className="cmd-kbd">Surprise Me</kbd>
            </div>
            <div
              className="cmd-item"
              onClick={() => handleSelectNav("/favorites")}
            >
              <span>💖 My Watchlist Queue</span>
              <kbd className="cmd-kbd">My List</kbd>
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="cmd-results">
            {loading && <div className="cmd-loading">Searching MovieNest catalog...</div>}

            {!loading && results.length === 0 && (
              <div className="cmd-empty">No results found for "{query}"</div>
            )}

            {!loading &&
              results.map((item, index) => {
                const title = item.title || item.name || "Untitled";
                const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : null;
                const isTv = Boolean(item.first_air_date || item.name);
                const poster = item.poster_path
                  ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                  : null;

                return (
                  <div
                    key={item.id}
                    className={`cmd-item ${index === selectedIndex ? "active" : ""}`}
                    onClick={() => {
                      navigate(`/movie/${item.id}${isTv ? "?type=tv" : ""}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="cmd-item-left">
                      {poster ? (
                        <img src={poster} alt="" className="cmd-item-poster" />
                      ) : (
                        <div className="cmd-item-poster-empty">🎬</div>
                      )}
                      <div>
                        <p className="cmd-item-title">{title}</p>
                        <p className="cmd-item-meta">
                          {isTv ? "TV Series" : "Movie"} {year && `• ${year}`}
                        </p>
                      </div>
                    </div>

                    {rating && (
                      <span className="cmd-item-rating">
                        <StarIcon size={12} color="#e5a916" />
                        <span>{rating}</span>
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        <div className="cmd-footer">
          <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>Enter</kbd> to select</span>
          <span><kbd>Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
