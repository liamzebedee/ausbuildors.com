# CLAUDE.md

## Rules

### Cache busting
All local asset references in HTML files (stylesheets, images, logos, media) must include a `?v=N` query parameter for cache busting. When adding or modifying asset references, always include the param. When making changes to existing assets (CSS, images), increment the version number across all references.

Example: `src="assets/logos/foo/icon.png?v=1"`, `href="styles.css?v=1"`

This does NOT apply to external URLs (e.g. twitter embeds, CDN links).
