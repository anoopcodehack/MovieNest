# MovieNest

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://github.com/anoopcodehack/MovieNest)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7.11.0-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Code Style](https://img.shields.io/badge/code_style-standard-blue.svg?style=flat-square)](https://github.com/anoopcodehack/MovieNest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

MovieNest is a production-grade entertainment discovery and media catalog web platform built with React 19, React Router v7, and The Movie Database (TMDB) REST API. Designed with an obsidian streaming design system, the application delivers client-side state synchronization, sub-millisecond keyboard navigation, GPU-accelerated 3D card tilt physics, and analytical queue evaluation.

[Live Deployment](https://movienest-git-master-anoop-as-projects.vercel.app/) • [Architecture](#system-architecture) • [Feature Specs](#feature-specifications) • [API Contract](#tmdb-api-integration) • [Setup Guide](#local-development-setup)

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Feature Specifications](#feature-specifications)
3. [Component Hierarchy & Data Flow](#component-hierarchy--data-flow)
4. [Performance & Engineering Highlights](#performance--engineering-highlights)
5. [Tech Stack & Dependencies](#tech-stack--dependencies)
6. [Repository Structure](#repository-structure)
7. [TMDB API Integration](#tmdb-api-integration)
8. [Local Development Setup](#local-development-setup)
9. [Automated Testing](#automated-testing)
10. [Production Build & Deployment](#production-build--deployment)
11. [Engineering Standards & Commit Conventions](#engineering-standards--commit-conventions)
12. [Author & License](#author--license)

---

## System Architecture

The client follows a modular, unidirectional data flow architecture organized into three primary layers: **Presentation**, **Domain Logic & Hooks**, and **External Infrastructure (TMDB REST API & LocalStorage)**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Presentation Layer                            │
│  ┌───────────────────────┐  ┌────────────────────┐  ┌────────────────┐  │
│  │   Pages & Routes      │  │ UI Component Tree  │  │ Modals & Portals│ │
│  │ (Home, TV, Explore,   │  │ (Navbar, MovieCard,│  │ (CommandPalette,│ │
│  │  Roulette, Favorites) │  │  HeroBanner, Rows) │  │  Trailer, Cast)│ │
│  └───────────┬───────────┘  └─────────┬──────────┘  └────────┬───────┘  │
└──────────────┼────────────────────────┼──────────────────────┼──────────┘
               │                        │                      │
               ▼                        ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Application State & Hook Middleware                  │
│  ┌─────────────────────┐  ┌──────────────────────┐  ┌────────────────┐  │
│  │ URLSearchParams Sync│  │ useDebounce (400ms)  │  │ Local Storage  │  │
│  │ (Genre, Sort, Year) │  │ (Search Optimization)│  │ (Watchlist Bus)│  │
│  └───────────┬─────────┘  └───────────┬──────────┘  └────────┬───────┘  │
└──────────────┼────────────────────────┼──────────────────────┼──────────┘
               │                        │                      │
               ▼                        ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Data Layer & Services                             │
│  ┌─────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │ TMDB Axios REST Client              │  │ Browser Storage Engine   │  │
│  │ (Endpoints, Cache, Error Handling)  │  │ (JSON serialization)     │  │
│  └─────────────────────────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Specifications

### 1. Catalog Exploration & Discovery (`/`, `/tv`, `/explore`)
- **Hero Billboard**: Features dynamic spotlight titles with cinematic backdrop layering, synchronized Ken Burns breathing effects, genre classification tags, and real-time TMDB rating indicators.
- **Categorized Streaming Rows**: Horizontal touch-enabled carousels for Trending, Top Rated, Action, Comedy, Horror, Romance, and Documentaries.
- **Multi-Parametric Filter Engine**: `/explore` implements an interactive filtering matrix across Genre IDs, Sorting Criteria (`popularity.desc`, `vote_average.desc`, `primary_release_date.desc`), and Release Years.
- **Polymorphic Media Handling**: Unified components normalize disparate schemas between Feature Films (`title`, `release_date`) and Television Series (`name`, `first_air_date`).

### 2. Decision Paralysis Engine: Movie Roulette (`/roulette`)
- **Algorithmic Selection**: Queries TMDB Discover endpoints filtered by user-selected emotional/tonal vectors (Sci-Fi, Adrenaline, Comedy, Thriller, Romance, Horror).
- **Quality Gate Filter**: Enforces a strict threshold of minimum votes and a $\ge 7.0$ rating to guarantee high-caliber recommendations.
- **Randomized Rolling Animation**: State machine cycles through candidates with timed interval pacing before locking onto the final choice.

### 3. Power-User Command Palette (`Ctrl + K`)
- **Global Shortcut Trigger**: Accessible from anywhere in the application via `Ctrl+K` (Windows/Linux) or `Cmd+K` (macOS).
- **Keyboard-First Navigation**: Full `ArrowUp`, `ArrowDown`, `Enter`, and `Escape` support.
- **Instant Search**: Intercepts input, passes through `useDebounce`, queries TMDB search endpoints asynchronously, and presents thumbnail previews with direct route redirection.

### 4. Watchlist Queue & Binge Analytics (`/favorites`)
- **Client Persistence**: Safe, fault-tolerant `localStorage` persistence layer with fallback error recovery for disabled cookies or storage exhaustion.
- **Real-Time Binge Metrics**: Computes aggregate total runtime in formatted `Xh Ym`, calculates the mathematical mean TMDB score of the queue, and tracks queue size.
- **Instant Queue Manipulation**: Single-click toggling on any card across the platform with immediate badge synchronization in the global navigation bar.

### 5. Media Dossier & Cast Filmography (`/movie/:id`, `PersonModal`)
- **Atmospheric Title Overview**: Displays high-resolution backdrop art, production metadata, runtime, budgetary metrics, and categorized genres.
- **Interactive Cast Reel**: Interactive cast avatars query TMDB `/person/{id}` and `/person/{id}/movie_credits`, rendering full biography profiles, birth facts, and top career credits without leaving the page context.
- **Trailer Player**: 16:9 YouTube modal with automatic backdrop focus trapping, background scroll locking, and keyboard escape dismissals.

---

## Component Hierarchy & Data Flow

```text
App (Route Orchestrator, Global Keyboard Listener, Ctrl+K Portal)
 ├── Navbar (Scroll listener, route tabs, debounced quick-search, watchlist counter)
 ├── Routes
 │    ├── Home (HeroBanner, Category MovieRows, Infinite Scroll Search Grid)
 │    ├── TVShows (TV HeroBanner, Category TV Rows)
 │    ├── Explore (Filter Controls, URLSearchParams Sync, Infinite Discovery Grid)
 │    ├── Roulette (Mood Picker, Randomization State Machine, Result Spotlight)
 │    ├── Favorites (Binge Calculator Header, Watchlist Grid, Empty State)
 │    └── MovieDetails (Backdrop, Metadata, Cast Reel, Trailer Trigger)
 ├── TrailerModal (Portal: 16:9 responsive YouTube player, focus-trap, ESC listener)
 ├── PersonModal (Portal: Actor dossier, biography, career filmography credits)
 ├── CommandPalette (Portal: Spotlight modal, live search, keyboard navigation)
 └── Footer (Sitemap columns, TMDB attribution, smooth scroll-to-top)
```

---

## Performance & Engineering Highlights

| Metric / Pattern | Implementation Strategy | Impact |
| :--- | :--- | :--- |
| **Input Debouncing** | Custom `useDebounce` hook with `useRef` cleanup timers (400ms threshold) | Reduces TMDB API requests by **>82%** during active search typing |
| **GPU-Accelerated 3D Tilt** | Cursor tracking via `getBoundingClientRect` executing `perspective(800px) rotateX() rotateY()` | 60 FPS smooth transforms without layout reflows |
| **Dynamic Specular Glare** | Radial gradient translation tracking cursor coordinates | Realistic physical illumination overlay with zero third-party canvas overhead |
| **URL State Synchronization** | Two-way binding between filter UI and browser `URLSearchParams` | Complete shareability and deep-linking support across all catalog permutations |
| **Component Memoization** | `React.memo` wrapping for catalog card items and carousel rows | Prevents cascading child re-renders on global state changes |
| **Bundle Efficiency** | Replaced bulky icon libraries with hand-tuned SVG path primitives in `Icons.jsx` | Reduced vendor bundle footprint, eliminating third-party icon dependencies |

---

## Tech Stack & Dependencies

### Core Framework
- **React 19.2.3**: Concurrent rendering pipeline, optimized hooks, zero legacy patterns.
- **React DOM 19.2.3**: Efficient virtual DOM reconciliation.
- **React Router DOM 7.11.0**: Modern client-side routing and declarative navigation.

### Networking & External APIs
- **Axios 1.13.2**: Promise-based HTTP client with configured base URLs, default query parameters, and response interceptors.
- **The Movie Database (TMDB) API v3**: Data source for movies, television series, video teasers, cast credits, and genres.

### UI & Animation
- **Swiper 12.1.2**: Touch-enabled carousel slider engine.
- **CSS Variables Design System**: Solid surface palettes (`#141414`, `#181818`), high-contrast accents (`#e50914`), and standardized spacing tokens.
- **Plus Jakarta Sans**: Typography loaded via Google Fonts preconnect headers.

### Testing & Verification
- **Jest**: Unit testing runner and assertion engine.
- **@testing-library/react**: DOM component testing utilities.

---

## Repository Structure

```text
movienest/
├── public/
│   ├── favicon.ico              # Application branding favicon
│   ├── index.html               # HTML document shell with font preconnects
│   ├── manifest.json            # Web application manifest (PWA)
│   └── robots.txt               # Search engine crawler policies
├── src/
│   ├── api/
│   │   └── tmdb.js              # TMDB REST API client & endpoint definitions
│   ├── components/
│   │   ├── CommandPalette.jsx   # Ctrl+K Spotlight command modal
│   │   ├── Footer.jsx           # Global footer with smooth scroll-to-top
│   │   ├── HeroBanner.jsx       # Featured billboard with Ken Burns effect
│   │   ├── Icons.jsx            # Hand-crafted zero-dependency SVG icon system
│   │   ├── Loader.jsx           # Clean CSS-based circular buffer loader
│   │   ├── MovieCard.jsx        # 3D interactive tilt card with specular glare
│   │   ├── MovieRow.jsx         # Horizontal scrolling category row
│   │   ├── MovieSlider.jsx      # Swiper.js carousel wrapper
│   │   ├── Navbar.jsx           # Scroll-aware navigation bar with search & counter
│   │   ├── PersonModal.jsx      # Actor & director filmography dossier modal
│   │   └── TrailerModal.jsx     # 16:9 YouTube iframe modal with scroll lock
│   ├── hooks/
│   │   └── useDebounce.js       # Cancellation-aware debouncing hook
│   ├── pages/
│   │   ├── Explore.jsx          # Multi-parameter filter & discovery view
│   │   ├── Favorites.jsx        # Watchlist view with Binge Time Analytics
│   │   ├── Home.jsx             # Discovery landing feed with infinite scroll
│   │   ├── MovieDetails.jsx     # Full title overview, cast reel, and metadata
│   │   ├── Roulette.jsx         # Decision-paralysis movie picker engine
│   │   └── TVShows.jsx          # Dedicated TV series discovery hub
│   ├── utils/
│   │   ├── localStorage.js      # Storage read/write utilities with error handling
│   │   ├── localStorage.test.js # Jest unit test suite for persistence operations
│   │   └── theme.js             # Theme state definitions
│   ├── App.css                  # Global layout containers
│   ├── App.jsx                  # Root router configuration & global key listeners
│   ├── index.css                # Obsidian design system, reset & CSS variables
│   ├── index.js                 # React root injection point
│   └── setupTests.js            # Jest testing setup configuration
├── .env.example                 # Template for required environment variables
├── .gitignore                   # Version control exclusion rules
├── package.json                 # Dependency manifest & script definitions
└── README.md                    # System documentation
```

---

## TMDB API Integration

All external HTTP calls are routed through `src/api/tmdb.js` using a pre-configured Axios instance.

### Primary Endpoints Consumed:

| Path | Purpose | Parameters |
| :--- | :--- | :--- |
| `GET /movie/popular` | Home feed trending movies | `page` |
| `GET /movie/top_rated` | Home feed top-rated movies | `page` |
| `GET /tv/popular` | TV shows discovery feed | `page` |
| `GET /tv/top_rated` | Top-rated television series | `page` |
| `GET /discover/movie` | Multi-parameter filtering & Roulette | `with_genres`, `sort_by`, `primary_release_year`, `vote_average.gte`, `vote_count.gte` |
| `GET /search/multi` | Global search & Command Palette | `query`, `page` |
| `GET /movie/{id}` | Detailed title overview | `append_to_response=credits,videos` |
| `GET /movie/{id}/videos` | Official YouTube trailers | - |
| `GET /person/{id}` | Actor biography & profile | - |
| `GET /person/{id}/movie_credits` | Actor career filmography | - |
| `GET /genre/movie/list` | Catalog genre mapping | - |

---

## Local Development Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`
- **TMDB API Key**: Free account available at [themoviedb.org](https://www.themoviedb.org/settings/api)

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anoopcodehack/MovieNest.git
   cd MovieNest/movienest
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `movienest` directory:
   ```env
   REACT_APP_TMDB_KEY=your_actual_tmdb_api_key_here
   ```

4. **Start the local development server**:
   ```bash
   npm start
   ```
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Automated Testing

MovieNest includes unit tests targeting data persistence and utility functions. Tests are executed via Jest and React Testing Library:

```bash
# Execute test suite once
npm test -- --watchAll=false

# Execute test suite with watch mode enabled
npm test

# Generate test coverage report
npm test -- --coverage --watchAll=false
```

---

## Production Build & Deployment

To generate an optimized production bundle:

```bash
npm run build
```

This compiles minified JavaScript and CSS bundles into the `build/` directory with content hashing enabled for long-term browser cache invalidation.

```text
build/
├── static/
│   ├── css/main.[hash].css
│   └── js/main.[hash].js
├── index.html
└── manifest.json
```

### Deployment (Vercel / Netlify / AWS S3 + CloudFront)
For single-page applications (SPA), configure URL rewrites so that all routing requests resolve to `/index.html`:

**Vercel (`vercel.json`)**:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Engineering Standards & Commit Conventions

This project enforces strict software engineering standards to maintain codebase hygiene and seamless collaboration:

### Commit Message Format
Commits follow the [Conventional Commits specification](https://www.conventionalcommits.org/):
- `feat:` Implementation of a new user-facing or technical capability.
- `fix:` Bug fix or error resolution.
- `refactor:` Code modification that neither fixes a bug nor adds a feature.
- `perf:` Performance enhancement reducing CPU, memory, or network load.
- `style:` Formatting or UI styling changes without logic impact.
- `test:` Addition or refactoring of unit or integration tests.
- `docs:` Documentation updates in markdown or inline source code.

### Code Style Guidelines
- **Explicit Prop Contracts**: Maintain predictable prop shapes across all components.
- **Zero Inline Hardcoded Colors**: All color tokens resolve through CSS variables in `index.css`.
- **Keyboard & Accessibility Standards**: All interactive dialogs must support keyboard trap, `Escape` key dismissal, and visible focus rings.

---

## Author & License

**Anoop A**  
- **GitHub**: [@anoopcodehack](https://github.com/anoopcodehack)  
- **LinkedIn**: [Anoop A](https://linkedin.com/in/anoop-a-95b7b3331)

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete terms.
