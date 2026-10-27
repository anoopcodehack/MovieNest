import { Link } from "react-router-dom";
import { ArrowUpIcon } from "./Icons";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-top-accent" />

      <div className="footer-content">
        <div className="footer-left">
          <Link to="/" className="footer-logo">
            MOVIENEST
          </Link>
          <p className="footer-desc">
            Browse, search, and stream your favorite movies and TV series
            powered by real-time TMDB intelligence.
          </p>

          <button
            type="button"
            className="footer-scroll-top-btn"
            onClick={scrollToTop}
            title="Back to top"
          >
            <ArrowUpIcon size={16} />
            <span>Back to Top</span>
          </button>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li>
              <Link to="/" className="footer-link-animated">Home</Link>
            </li>
            <li>
              <Link to="/tv" className="footer-link-animated">TV Shows</Link>
            </li>
            <li>
              <Link to="/explore" className="footer-link-animated">Explore Catalog</Link>
            </li>
            <li>
              <Link to="/favorites" className="footer-link-animated">My List</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li>
              <a href="#terms" className="footer-link-animated" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#privacy" className="footer-link-animated" onClick={(e) => e.preventDefault()}>
                Privacy Statement
              </a>
            </li>
            <li>
              <a href="#attribution" className="footer-link-animated" onClick={(e) => e.preventDefault()}>
                TMDB Attribution
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MovieNest. Built with React 19 & TMDB API.</p>
        <p className="footer-legal">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </footer>
  );
}

export default Footer;
