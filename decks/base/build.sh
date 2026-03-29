#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

nix-shell -p '(texliveBasic.withPackages (ps: with ps; [ beamer fontawesome5 fontspec booktabs pgf etoolbox xcolor hyperref collection-fontsrecommended luatexbase ctablestack collection-luatex tex-gyre ragged2e ]))' \
  --run "lualatex -interaction=nonstopmode deck.tex && lualatex -interaction=nonstopmode deck.tex"
