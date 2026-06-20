import { defineConfig } from 'astro/config';

// Static build (no SSR/adapter) → output `dist/` HTML thuần, upload thẳng vào
// public_html của Hostinger. KHÔNG đổi sang output:'server' (sẽ cần Node runtime).
export default defineConfig({
  site: 'https://les-4saisonsgeneve.ch',
  base: '/',
  output: 'static',
  build: {
    // Giữ URL .html như site cũ (/menu.html, /about.html…) để không vỡ SEO/link.
    format: 'file',
  },
  // Lenis/GSAP là client-side; không cần tối ưu đặc biệt ở server.
});
