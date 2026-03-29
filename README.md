# ausbuildors.com

Website for AusBuildors. Deployed on Cloudflare Pages via Wrangler.

## Structure

```
v3/            ← current site (active)
  index.html     landing page
  about.html     about page
  members.html   members page
  src/           TSX components + data
  styles.css     global styles
  build.sh       bun build script → build/
  build/         output served by Cloudflare
v2/            ← previous version (archived)
v1/            ← original version (archived)
brand-assets-stuff/  logos, memes, sponsor images
media/               shared images used across versions
```

## Deploy

Wrangler serves `v3/build/` as static assets (see `wrangler.jsonc`).

```sh
cd v3 && ./build.sh     # bun build + copy static assets
npx wrangler deploy      # deploy to Cloudflare
```

### Quick iterate

`./iter.sh` builds, commits everything, and pushes in one shot:

```sh
./iter.sh   # runs v3/build.sh → git add -A → git commit → git push
```

## Dev

```sh
bun run v3/dev.ts   # starts dev server on http://localhost:3000
```

The dev server serves from `v3/` directly (no build step needed), bundles TSX/TS on the fly, and live-reloads the browser on file changes.
