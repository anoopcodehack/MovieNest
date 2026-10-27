import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import TVShows from "./pages/TVShows";
import Explore from "./pages/Explore";
import Roulette from "./pages/Roulette";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import "./App.css";

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCmdOpen, setIsCmdOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Global Ctrl+K / Cmd+K Command Palette Shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const addFavorite = (item) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar
          favoritesCount={favorites.length}
          onOpenCmd={() => setIsCmdOpen(true)}
        />

        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  favorites={favorites}
                  onAddFavorite={addFavorite}
                  onRemoveFavorite={removeFavorite}
                />
              }
            />

            <Route
              path="/tv"
              element={
                <TVShows
                  favorites={favorites}
                  onAddFavorite={addFavorite}
                  onRemoveFavorite={removeFavorite}
                />
              }
            />

            <Route
              path="/explore"
              element={
                <Explore
                  favorites={favorites}
                  onAddFavorite={addFavorite}
                  onRemoveFavorite={removeFavorite}
                />
              }
            />

            <Route
              path="/roulette"
              element={
                <Roulette
                  favorites={favorites}
                  onAddFavorite={addFavorite}
                  onRemoveFavorite={removeFavorite}
                />
              }
            />

            <Route
              path="/favorites"
              element={
                <Favorites
                  favorites={favorites}
                  onRemoveFavorite={removeFavorite}
                />
              }
            />

            <Route
              path="/movie/:id"
              element={
                <MovieDetails
                  favorites={favorites}
                  onAddFavorite={addFavorite}
                  onRemoveFavorite={removeFavorite}
                />
              }
            />
          </Routes>
        </div>

        <Footer />

        <CommandPalette
          isOpen={isCmdOpen}
          onClose={() => setIsCmdOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
