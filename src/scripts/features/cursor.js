// cursor.js — two-layer custom cursor (dot + ring). Only enabled on pointer:fine devices.
export function initCursor() {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    document.body.classList.add('has-cursor');

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let shown = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
        if (!shown) {
            shown = true;
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        }
    }, { passive: true });

    // Ring smoothly trails the pointer
    const raf = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Enlarge the ring when hovering interactive elements
    const hoverSel = 'a, button, .category, .dish-card, .grid-item, .related-dish-card, .set-menu-card';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverSel)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverSel)) ring.classList.remove('is-hover');
    });

    // Hide when the mouse leaves the window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        if (shown) { dot.style.opacity = '1'; ring.style.opacity = '1'; }
    });
}
