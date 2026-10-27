import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTheme, setTheme } from "../utils/theme";
import { FilmIcon, SearchIcon, CloseIcon, SunIcon, MoonIcon, HeartIcon } from "./Icons";

function Navbar({ favoritesCount = 0 }) {
  const [theme, setThemeState] = useState(getTheme());
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const location = useLocation();
  const navigate = useNavigate();

  // Sync input when search query param changes
  useEffect(() => {
    setSearchInput(searchParams.get("q") || "");
  }, [searchParams]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      if (location.pathname !== "/") {
        navigate(`/?q=${encodeURIComponent(trimmed)}`);
      } else {
        setSearchParams({ q: trimmed });
      }
    } else {
      if (location.pathname === "/") {
        setSearchParams({});
      }
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    if (location.pathname === "/") {
      setSearchParams({});
    }
  };

  const isHomeActive = location.pathname === "/" && !searchParams.get("q");
  const isFavoritesActive = location.pathname === "/favorites";

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="logo">
          <div className="logo-badge">
            <FilmIcon size={20} color="#fff" />
          </div>
          <span className="logo-text">
            Movie<span>Nest</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isHomeActive ? "active" : ""}`}>
            <span>Home</span>
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${isFavoritesActive ? "active" : ""}`}
          >
            <HeartIcon size={15} filled={isFavoritesActive} />
            <span>Watchlist</span>
            {favoritesCount > 0 && (
              <span className="nav-badge-count">{favoritesCount}</span>
            )}
          </Link>
        </div>
      </div>

      <div className="nav-right">
        <form onSubmit={handleSearchSubmit} className="nav-search-form">
          <span className="nav-search-icon">
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search movies, genres..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              className="nav-search-clear"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </form>

        <button
          className="theme-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
