/**
 * url(path) — returns the correct path for both dev and build:
 *   - Dev  (import.meta.env.DEV)  : /gallery      (Astro dev server does not accept .html)
 *   - Prod (import.meta.env.PROD) : /gallery.html  (build.format:'file' → .html needed)
 *
 * Use for every internal link with a .html suffix.
 * Do NOT use for external links or assets (images, fonts, etc.).
 *
 * @param {string} path - path WITHOUT the .html suffix, e.g. '/gallery', '/sub-page/category'
 * @param {string} [query] - query string if any, e.g. '?category=dimsum'
 * @returns {string}
 */
export function url(path, query = '') {
  const suffix = import.meta.env.PROD ? '.html' : '';
  return `${path}${suffix}${query}`;
}
