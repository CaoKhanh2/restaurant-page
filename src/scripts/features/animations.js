// animations.js — Lenis smooth scroll + GSAP ScrollTrigger
// Hero cinematic (SplitType), Ken Burns, parallax, scroll-reveal, decorative lines.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initAnimations() {
    // ── Lenis smooth scroll (tắt khi reduced-motion) ──────────────
    if (!REDUCE) {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        window.__lenis = lenis; // dùng cho anchor links trong main.js
    }

    // ── Hero timeline ─────────────────────────────────────────────
    const heroContent = document.querySelector('#hero .hero-content');
    if (heroContent) {
        const eyebrow = heroContent.querySelector('.eyebrow');
        const title   = heroContent.querySelector('.hero-title');
        const tagline = heroContent.querySelector('.hero-tagline');
        const cta      = heroContent.querySelector('.hero-cta');

        if (REDUCE) {
            gsap.set([eyebrow, title, tagline, cta], { opacity: 1, y: 0 });
        } else {
            let titleTargets = title;
            if (title) {
                const split = new SplitType(title, { types: 'lines,words', tagName: 'span' });
                titleTargets = split.words.length ? split.words : title;
                gsap.set(title, { opacity: 1 });
            }
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            if (eyebrow) tl.fromTo(eyebrow, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.15);
            tl.fromTo(titleTargets, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.05 }, 0.3);
            if (tagline) tl.fromTo(tagline, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.7);
            if (cta)     tl.fromTo(cta,      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.85);
        }
    }

    // ── Ken Burns trên nền hero ───────────────────────────────────
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && !REDUCE) {
        gsap.to(heroBg, { scale: 1.14, ease: 'none', duration: 14, repeat: -1, yoyo: true });
        // Parallax nhẹ theo scroll
        gsap.to(heroBg, {
            yPercent: 12, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
        });
    }

    // ── Parallax background các section có ảnh nền ────────────────
    if (!REDUCE) {
        ['#takeaway'].forEach((sel) => {
            const el = document.querySelector(sel);
            if (!el) return;
            gsap.fromTo(el, { backgroundPositionY: '40%' }, {
                backgroundPositionY: '60%', ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            });
        });
    }

    // ── Scroll reveal ─────────────────────────────────────────────
    if (!REDUCE) {
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
            const delay = parseFloat(el.dataset.revealDelay) || 0;
            gsap.fromTo(el, { y: 34, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
        });
        gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => {
            gsap.fromTo(group.children, { y: 34, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12,
                scrollTrigger: { trigger: group, start: 'top 86%', once: true },
            });
        });
    }

    // ── Gạch chân trang trí dưới h2 (chờ DOM ổn định) ────────────
    const initLines = () => {
        document.querySelectorAll('section h2').forEach((h2) => {
            if (h2.closest('.about-story-text') || h2.querySelector('.gsap-title-line')) return;
            const line = document.createElement('span');
            line.className = 'gsap-title-line';
            h2.appendChild(line);
            if (REDUCE) { line.style.transform = 'scaleX(1)'; return; }
            gsap.fromTo(line, { scaleX: 0 }, {
                scaleX: 1, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: h2, start: 'top 90%', once: true },
            });
        });
        ScrollTrigger.refresh();
    };
    initLines();
}
