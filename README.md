# InfinityX News Portal

A responsive React news portal built around the Project 5 brief in **5 React JS Projects.pdf**. InfinityX News (`https://infinityx-news.base44.app/`) is used as inspiration/reference; this is an independent React implementation and does not imply an official partnership.

## Features
- Homepage with featured story, breaking-news strip, latest articles and category sections
- Search, category filtering and sort controls
- Dynamic article details route
- Bookmark/read-later page with `localStorage` persistence
- Loading, error, retry and no-results states
- Responsive desktop/mobile navigation and dark mode toggle
- GNews API integration with local sample articles as a graceful demo fallback

## Run locally
1. Install Node.js (18+ recommended).
2. Extract this folder and open it in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and add your GNews API key as `VITE_GNEWS_API_KEY=...`.
5. Run `npm run dev` and open the local URL shown in the terminal.

Without an API key, the app uses clearly labelled sample stories so the interface can still be demonstrated. Sample story text is for demonstration and should not be presented as live reporting.

## Main React concepts demonstrated
Components, props, `useState`, `useEffect`, React Router, URL parameters, API fetching, array methods (`map`, `filter`, `find`), conditional rendering, reusable components, and `localStorage`.
