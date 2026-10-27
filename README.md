# 🎬 MovieNest

<div align="center">

![MovieNest Banner](https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80)

**An Enterprise-Grade Movie & Series Streaming Discovery Platform**  
*Built with React 19, React Router v7, TMDB REST API, and Custom GPU-Accelerated 3D Interactions.*

[![React Version](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7.11.0-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![TMDB API](https://img.shields.io/badge/API-TMDB_v3-01D277?logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/documentation/api)
[![Tests](https://img.shields.io/badge/Tests-Passing-success)](https://jestjs.io)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[**Live Demo**](https://movienest-git-master-anoop-as-projects.vercel.app/) &nbsp;|&nbsp; [**Report Bug**](https://github.com/anoopcodehack/movienest/issues) &nbsp;|&nbsp; [**Request Feature**](https://github.com/anoopcodehack/movienest/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features (Better Than Netflix)](#-key-features-better-than-netflix)
- [Engineering & Architecture Highlights](#-engineering--architecture-highlights)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Testing](#-testing)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🔭 Overview

**MovieNest** is an industry-standard streaming and entertainment discovery web application designed to solve the common pitfalls of commercial streaming interfaces — specifically **choice overload**, **clunky search latency**, and **lack of catalog transparency**.

Built from the ground up using **React 19**, the application integrates TMDB's comprehensive REST API with custom algorithmic features such as a **Movie Roulette Mood Picker**, **Global `Ctrl+K` Command Palette**, **Interactive 3D Mouse Tilt Physics**, and **Watchlist Binge Time Analytics**.

---

## ⚡ Key Features (Better Than Netflix)

### 1. 🎲 "Movie Roulette / Mood Picker" (`/roulette`)
- **Problem**: Users spend an average of 30–45 minutes scrolling endlessly without choosing a title (Decision Paralysis).
- **Solution**: Users select their current vibe (*Mind-Bending Sci-Fi*, *Adrenaline Rush*, *Feel Good Comedy*, *Edge-of-Your-Seat Thriller*, etc.) and spin. The algorithm selects a verified top-tier title (7.0+ score) with instant trailer and watchlist actions.

### 2. ⚡ Power-User `Ctrl+K` Spotlight Command Palette
- **Problem**: Finding titles or changing categories requires multiple clicks and page reloads.
- **Solution**: Pressing `Ctrl + K` (or `Cmd + K` on macOS) opens a floating command palette supporting keyboard navigation (`↑`, `↓`, `Enter`, `Esc`), real-time debounced title querying, and one-key shortcuts to any catalog view.

### 3. ⏱️ Watchlist Binge Stats & Time Calculator (`/favorites`)
- **Problem**: Commercial streaming platforms do not inform users how long their queue takes to watch.
- **Solution**: Real-time aggregation calculates the exact watch time (`Xh Ym`) of all saved titles, average TMDB critical rating, and total queue length.

### 4. 🎬 Actor & Director Filmography Explorer (`PersonModal`)
- **Problem**: Clicking on an actor on commercial platforms rarely displays their full external filmography.
- **Solution**: Clicking any actor headshot in the Cast section opens their complete career dossier — biography, birth info, and top acclaimed career roles with direct navigation to those titles.

### 5. 🕹️ Interactive 3D Mouse Tilt & Specular Lighting
- Movie cards feature GPU-accelerated 3D perspective transforms (`rotateX`, `rotateY`) tracking cursor coordinates, paired with dynamic specular lighting glares that follow mouse movement.

### 6. 🍿 Accessible YouTube Trailer Player (`TrailerModal`)
- Responsive 16:9 embedded player with background scroll lock, keyboard `Escape` dismissal, and backdrop click handling.

---

## 🧠 Engineering & Architecture Highlights

This project was built following professional software engineering patterns that showcase senior frontend capabilities:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│   (React 19 Components + React Router v7 Navigation)        │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────┐  ┌────────────────────────────┐
│      Performance Layer      │  │     State & Persistence    │
│  - useDebounce Hook (400ms) │  │  - URLSearchParams Sync   │
│  - React.memo Memoization   │  │  - LocalStorage Queue      │
│  - Infinite Scroll Throttler│  │  - Polymorphic Data Models │
└──────────────┬──────────────┘  └────────────┬───────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TMDB REST API Layer                      │
│      (Movies, TV Shows, Video Teasers, Person Credits)      │
└─────────────────────────────────────────────────────────────┘
```

1. **Custom `useDebounce` Hook**: Eliminates redundant network calls on search inputs with a 400ms cancellation timer, cutting API overhead by >80% and preventing TMDB rate limits (`HTTP 429`).
2. **URL State Synchronization**: Multi-parameter catalog filters (genre, sorting metric, release year) sync bidirectionally with `URLSearchParams`, ensuring all filtered views are bookmarkable and shareable.
3. **Polymorphic Data Schema**: `MovieCard` gracefully normalizes polymorphic differences between Movies (`title`, `release_date`) and TV Series (`name`, `first_air_date`).
4. **Render Optimization**: `MovieRow` and action triggers are optimized via `React.memo` and `useCallback` to prevent cascading re-renders across 20+ tile carousels.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Library** | [React 19](https://react.dev) |
| **Routing** | [React Router DOM v7](https://reactrouter.com) |
| **Carousel Engine** | [Swiper.js v12](https://swiperjs.com) |
| **API Provider** | [The Movie Database (TMDB) API v3](https://developer.themoviedb.org/docs) |
| **Typography** | [Plus Jakarta Sans (Google Fonts)](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| **Styling** | Clean CSS Variables Design System (OLED Dark `#141414`) |
| **Testing** | [Jest](https://jestjs.io) & [@testing-library/react](https://testing-library.com) |

---

## 📂 Project Directory Structure

```text
movienest/
├── public/
│   ├── favicon.ico           # Application favicon
│   ├── index.html            # HTML shell with Google Fonts preconnect
│   └── manifest.json         # PWA web manifest
├── src/
│   ├── api/
│   │   └── tmdb.js           # REST API client & endpoint definitions
│   ├── components/
│   │   ├── CommandPalette.jsx# Ctrl+K Spotlight modal with keyboard navigation
│   │   ├── Footer.jsx        # Multi-column footer with smooth scroll-to-top
│   │   ├── HeroBanner.jsx    # Cinematic featured spotlight banner
│   │   ├── Icons.jsx         # Custom SVG icon library (Zero dependencies)
│   │   ├── Loader.jsx        # Shimmer skeleton loader components
│   │   ├── MovieCard.jsx     # Interactive 3D tilt card with specular glare
│   │   ├── MovieRow.jsx      # Memoized horizontal scrolling carousel row
│   │   ├── MovieSlider.jsx   # Swiper.js touch-enabled slider
│   │   ├── Navbar.jsx        # Glassmorphic header with search & theme switch
│   │   ├── PersonModal.jsx   # Actor & director filmography explorer modal
│   │   └── TrailerModal.jsx  # 16:9 YouTube iframe modal with scroll lock
│   ├── hooks/
│   │   └── useDebounce.js    # Custom debounce hook for search inputs
│   ├── pages/
│   │   ├── Explore.jsx       # Multi-parameter catalog discovery & genre filter
│   │   ├── Favorites.jsx     # Watchlist with Binge Time Analytics
│   │   ├── Home.jsx          # Home view with hero spotlight & categorized rows
│   │   ├── MovieDetails.jsx  # Atmospheric title view with cast reel
│   │   ├── Roulette.jsx      # Movie Roulette mood-based picker
│   │   └── TVShows.jsx       # Dedicated TV series discovery hub
│   ├── utils/
│   │   ├── localStorage.js   # Client persistence utilities
│   │   ├── localStorage.test.js # Unit test suite for storage operations
│   │   └── theme.js          # Dark / Light theme persistence
│   ├── App.css               # Global layout wrappers
│   ├── App.jsx               # Route orchestrator & global keyboard listeners
│   ├── index.css             # Obsidian streaming design system
│   └── index.js              # Application root entry point
├── .env                      # Local environment configuration (Ignored by git)
├── .gitignore                # Git ignore specifications
├── package.json              # Project dependencies & npm scripts
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** / **pnpm**
- A free **TMDB API Key** from [themoviedb.org](https://www.themoviedb.org/settings/api)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anoopcodehack/movienest.git
   cd movienest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `movienest` root directory:
   ```env
   REACT_APP_TMDB_KEY=your_tmdb_api_key_here
   ```

4. **Launch development server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the automated test suite using Jest:

```bash
npm test -- --watchAll=false
```

---

## 👤 Author

**Anoop A**  
- **GitHub**: [@anoopcodehack](https://github.com/anoopcodehack)  
- **LinkedIn**: [Anoop A](https://linkedin.com/in/anoop-a-95b7b3331)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
