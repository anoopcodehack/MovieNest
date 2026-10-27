import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTheme, setTheme } from "../utils/theme";
import useDebounce from "../hooks/useDebounce";
import { SearchIcon, CloseIcon, SunIcon, MoonIcon } from "./Icons";

function Navbar({ favoritesCount = 0, onOpenCmd }) {
  const [theme, setThemeState] = useState(getTheme());
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  useEffect(() => {
    setSearchInput(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    const trimmed = debouncedSearch.trim();

    if (trimmed && trimmed !== currentQ) {
      if (location.pathname !== "/") {
        navigate(`/?q=${encodeURIComponent(trimmed)}`);
      } else {
        setSearchParams({ q: trimmed });
      }
    } else if (!trimmed && currentQ && location.pathname === "/") {
      setSearchParams({});
    }
  }, [debouncedSearch, location.pathname, navigate, searchParams, setSearchParams]);

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
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    if (location.pathname === "/") {
      setSearchParams({});
    }
  };

  const isHomeActive = location.pathname === "/" && !searchParams.get("q");
  const isTvActive = location.pathname === "/tv";
  const isExploreActive = location.pathname === "/explore";
  const isRouletteActive = location.pathname === "/roulette";
  const isFavoritesActive = location.pathname === "/favorites";

  return (
    <nav className={`nav ${isScrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-left">
        <Link to="/" className="logo">
          MOVIENEST
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isHomeActive ? "active" : ""}`}>
            <span>Home</span>
          </Link>
          <Link to="/tv" className={`nav-link ${isTvActive ? "active" : ""}`}>
            <span>TV Shows</span>
          </Link>
          <Link
            to="/explore"
            className={`nav-link ${isExploreActive ? "active" : ""}`}
          >
            <span>Explore</span>
          </Link>
          <Link
            to="/roulette"
            className={`nav-link ${isRouletteActive ? "active" : ""}`}
          >
            <span>Surprise Me 🎲</span>
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${isFavoritesActive ? "active" : ""}`}
          >
            <span>My List</span>
            {favoritesCount > 0 && (
              <span className="nav-count">({favoritesCount})</span>
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
            placeholder="Titles, people, genres"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput ? (
            <button
              type="button"
              className="nav-search-clear"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <CloseIcon size={14} />
            </button>
          ) : (
            onOpenCmd && (
              <button
                type="button"
                className="nav-cmd-kbd"
                onClick={onOpenCmd}
                title="Quick Spotlight (Ctrl+K)"
              >
                Ctrl K
              </button>
            )
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
