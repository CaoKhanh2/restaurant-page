import { defineConfig } from 'astro/config';

// Static build (no SSR/adapter) → outputs plain `dist/` HTML, upload directly to
// Hostinger's public_html. Do NOT switch to output:'server' (would require a Node runtime).
export default defineConfig({
  site: 'https://les-4saisonsgeneve.ch',
  base: '/',
  output: 'static',
  build: {
    // Keep .html URLs like the old site (/menu.html, /about.html…) so SEO/links don't break.
    format: 'file',
  },
  // Lenis/GSAP are client-side; no special server-side optimization needed.
});
