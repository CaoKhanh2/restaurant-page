// main.js — entry client script (bundled bởi Astro).
// UI behaviors + theme toggle + preloader + khởi tạo animations & cursor.
import { initAnimations } from '../features/animations.js';
import { initCursor } from '../features/cursor.js';
import { initI18n } from '../features/i18n.js';

// ── Scroll progress bar ───────────────────────────────────────
const initScrollProgress = () => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = docHeight > 0 ? (window.pageYOffset / docHeight * 100) + '%' : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
};

// ── Header compact khi scroll ─────────────────────────────────
const initScrollHeader = () => {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 60);
    }, { passive: true });
};

// ── Back to top ───────────────────────────────────────────────
const initBackToTop = () => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.pageYOffset > 300);
    }, { passive: true });
};

// ── Mobile nav ────────────────────────────────────────────────
const initMobileNav = () => {
    const toggle = document.getElementById('mobile-nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = toggle.querySelector('i');
        if (icon) { icon.classList.toggle('fa-bars'); icon.classList.toggle('fa-xmark'); }
    });
    // Đóng menu khi bấm link
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
        nav.classList.remove('active');
        const icon = toggle.querySelector('i');
        if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    }));
};

// ── Theme toggle ──────────────────────────────────────────────
const setThemeIcon = (btn, theme) => {
    const icon = btn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
};
const initThemeToggle = () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    setThemeIcon(btn, document.documentElement.getAttribute('data-theme') || 'dark');
    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.add('theme-transitioning');
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        setThemeIcon(btn, next);
        setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 450);
    });
};

// ── Anchor links → route qua Lenis nếu có ─────────────────────
const initAnchorLinks = () => {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (href === '#' || href.length < 2) {
            e.preventDefault();
            if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.2, offset: -70 });
        else target.scrollIntoView({ behavior: 'smooth' });
    });
};

// ── Preloader ─────────────────────────────────────────────────
const hidePreloader = () => {
    const pre = document.getElementById('preloader');
    if (!pre) return;
    const done = () => document.documentElement.classList.add('preloaded');
    // tối thiểu ~700ms cho cảm giác premium, nhưng không chặn lâu
    const MIN = 700;
    const start = window.__pageStart || 0;
    if (document.readyState === 'complete') {
        setTimeout(done, Math.max(0, MIN));
    } else {
        window.addEventListener('load', () => setTimeout(done, MIN));
        // fallback an toàn
        setTimeout(done, 2600);
    }
};

const boot = () => {
    initScrollProgress();
    initScrollHeader();
    initBackToTop();
    initMobileNav();
    initThemeToggle();
    initAnchorLinks();
    initAnimations();
    initCursor();
    hidePreloader();
    initI18n();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
