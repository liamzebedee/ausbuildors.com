#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -rf build

# Bundle HTML pages with Bun
bun build \
  index.html \
  about.html \
  members.html \
  expertise.html \
  --outdir=build \
  --minify

# Copy static assets referenced at runtime by JS (nav logo, member logos, etc.)
cp -rL assets/ build/assets/
cp -L logo.png build/logo.png
cp -rL media/ build/media/
cp og-image.jpg build/og-image.jpg

echo "Build complete -> build/"
