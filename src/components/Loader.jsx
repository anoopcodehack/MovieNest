export function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export function SkeletonHero() {
  return <div className="skeleton skeleton-hero" />;
}

export function SkeletonRow({ count = 6 }) {
  return (
    <div className="skeleton-row">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonSpinner({ text = "Loading..." }) {
  return (
    <div className="skeleton-spinner">
      <div className="spinner-circle" />
      <span>{text}</span>
    </div>
  );
}

function Loader() {
  return <SkeletonSpinner text="Loading movies..." />;
}

export default Loader;
