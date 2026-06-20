// cursor.js — custom cursor 2 lớp (dot + ring). Chỉ bật trên thiết bị pointer:fine.
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

    // Ring trượt mượt theo sau con trỏ
    const raf = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Phóng to ring khi hover phần tử tương tác
    const hoverSel = 'a, button, .category, .dish-card, .grid-item, .related-dish-card, .set-menu-card';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverSel)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverSel)) ring.classList.remove('is-hover');
    });

    // Ẩn khi rời cửa sổ
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        if (shown) { dot.style.opacity = '1'; ring.style.opacity = '1'; }
    });
}
