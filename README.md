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

## Dev

```sh
bun run v3/dev.ts
```
