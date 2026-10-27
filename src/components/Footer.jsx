import { Link } from "react-router-dom";
import { FilmIcon } from "./Icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <Link to="/" className="logo">
            <div className="logo-badge">
              <FilmIcon size={20} color="#fff" />
            </div>
            <span className="logo-text">
              Movie<span>Nest</span>
            </span>
          </Link>
          <p className="footer-desc">
            Your premier destination for streaming discovery. Explore trending
            blockbusters, top-rated masterpieces, and curate your personal
            watchlist powered by the TMDB API.
          </p>
          <div className="footer-tmdb-badge">
            <span>Powered by TMDB API</span>
            <span>•</span>
            <span>Updated Daily</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Discover</h4>
          <ul>
            <li>
              <Link to="/">Trending Movies</Link>
            </li>
            <li>
              <Link to="/">Top Rated</Link>
            </li>
            <li>
              <Link to="/">Popular Releases</Link>
            </li>
            <li>
              <Link to="/favorites">My Watchlist</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li>
              <a href="#about" onClick={(e) => e.preventDefault()}>
                About MovieNest
              </a>
            </li>
            <li>
              <a href="#privacy" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#api" onClick={(e) => e.preventDefault()}>
                API Attribution
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MovieNest. All rights reserved.</p>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </footer>
  );
}

export default Footer;
