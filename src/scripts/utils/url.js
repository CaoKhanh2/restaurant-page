/**
 * url(path) — trả về đường dẫn đúng cho cả dev lẫn build:
 *   - Dev  (import.meta.env.DEV)  : /gallery      (Astro dev server không nhận .html)
 *   - Prod (import.meta.env.PROD) : /gallery.html  (build.format:'file' → cần .html)
 *
 * Dùng cho mọi internal link có đuôi .html.
 * KHÔNG dùng cho external link hoặc assets (ảnh, font…).
 *
 * @param {string} path - đường dẫn KHÔNG có .html, ví dụ '/gallery', '/sub-page/category'
 * @param {string} [query] - query string nếu có, ví dụ '?category=dimsum'
 * @returns {string}
 */
export function url(path, query = '') {
  const suffix = import.meta.env.PROD ? '.html' : '';
  return `${path}${suffix}${query}`;
}
