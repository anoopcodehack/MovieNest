import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <Link to="/" className="footer-logo">
            MOVIENEST
          </Link>
          <p className="footer-desc">
            Browse and stream movie collections powered by the TMDB API.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/favorites">My List</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Information</h4>
          <ul>
            <li>
              <a href="#terms" onClick={(e) => e.preventDefault()}>
                Terms of Use
              </a>
            </li>
            <li>
              <a href="#privacy" onClick={(e) => e.preventDefault()}>
                Privacy Statement
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MovieNest. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </footer>
  );
}

export default Footer;
