# SPA Architecture

## How it works

Single file SPA router: `src/spa.tsx`. All 4 HTML pages (`index.html`, `about.html`, `members.html`, `expertise.html`) load this same script.

### On initial page load
1. Detects current route from URL path
2. Renders `<Nav>` with correct active state
3. Inits fade-in animations
4. Runs page-specific init (API calls, member list rendering, PoW miner, etc.)

### On navigation (clicking a nav link)
1. Click intercepted on internal `<a>` tags (`about.html`, `members.html`, etc.)
2. Target HTML fetched via `fetch()` and cached
3. `DOMParser` extracts `<main>` content and `<title>`
4. Current `<main>` innerHTML swapped
5. `history.pushState` updates URL
6. Nav, fade-ins, and page-specific init re-run
7. Scrolls to top

### Browser back/forward
Handled via `popstate` listener — re-runs navigate without pushState.

## File structure

```
src/spa.tsx        — Router + all page init logic combined
src/jsx.ts         — Minimal JSX runtime (h, Fragment)
src/Nav.tsx        — Nav component
src/data/members.ts — Member data
```

Old per-page entry points (`src/index.tsx`, `src/about.tsx`, `src/members.tsx`, `src/expertise.tsx`) are unused — safe to delete.

## Build

All 4 HTML files are still Bun entrypoints (so direct URL access works). They all reference `src/spa.tsx`. Bun bundles the same module 4 times — the JS output is identical across pages.

```
bun build index.html about.html members.html expertise.html --production --outdir=build --minify
```

## Known tradeoffs

- **Fetch + innerHTML swap**: Works but fragile. DOMParser parses full HTML just to extract `<main>`. Event listeners on swapped-in content need re-binding via page init functions.
- **4 identical JS bundles**: Bun outputs a separate JS file per HTML entrypoint, but they're the same code. No deduplication at the file level.
- **Twitter embeds**: Requires `twttr.widgets.load()` call after swap to re-render tweet blockquotes.

## Future: component-based approach

Move page content from static HTML into TSX component functions. One `index.html` shell, router calls components directly and replaces `<main>` children. Eliminates fetch/parse/innerHTML entirely. Smaller build (one entrypoint, one JS bundle).
