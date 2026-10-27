import { useEffect } from "react";
import { CloseIcon } from "./Icons";

function TrailerModal({ isOpen, onClose, videoKey, title = "Trailer" }) {
  // Handle ESC key press & lock background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="trailer-modal-backdrop" onClick={onClose}>
      <div
        className="trailer-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trailer-modal-header">
          <h3 className="trailer-modal-title">{title} — Official Trailer</h3>
          <button
            type="button"
            className="trailer-modal-close"
            onClick={onClose}
            aria-label="Close trailer"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="trailer-modal-video-wrap">
          {videoKey ? (
            <iframe
              className="trailer-iframe"
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0`}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="trailer-fallback">
              <p>Official trailer is not currently available for this title.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
