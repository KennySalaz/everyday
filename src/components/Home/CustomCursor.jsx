import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
    const dotRef   = useRef(null);
    const ringRef  = useRef(null);
    const trailsRef = useRef([]);
    const mouse    = useRef({ x: 0, y: 0 });
    const ring     = useRef({ x: 0, y: 0 });
    const raf      = useRef(null);
    const [label, setLabel]   = useState('');
    const [variant, setVariant] = useState('default'); // default | hover | text | drag

    useEffect(() => {
        const isMobile = window.matchMedia('(pointer: coarse)').matches;
        if (isMobile) return;

        // ── Crear trail dots ──────────────────────────────
        const TRAIL_COUNT = 8;
        const trails = Array.from({ length: TRAIL_COUNT }, (_, i) => {
            const el = document.createElement('div');
            el.className = 'cursor-trail';
            el.style.setProperty('--i', i);
            document.body.appendChild(el);
            return { el, x: 0, y: 0 };
        });
        trailsRef.current = trails;

        // ── Mouse move ───────────────────────────────────
        const onMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
        };

        // ── Detect hover target ──────────────────────────
        const onOver = (e) => {
            const el = e.target.closest('a, button, [data-cursor]');
            if (!el) { setVariant('default'); setLabel(''); return; }
            const cur = el.dataset.cursor;
            if (cur === 'drag')  { setVariant('drag');  setLabel('drag');  return; }
            if (cur === 'view')  { setVariant('view');  setLabel('view');  return; }
            const tag = el.tagName.toLowerCase();
            if (tag === 'a' || tag === 'button') setVariant('hover');
            else setVariant('default');
            setLabel('');
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseover', onOver, { passive: true });

        // ── RAF loop: lag del ring + trail ───────────────
        const lerp = (a, b, t) => a + (b - a) * t;

        const loop = () => {
            ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
            ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

            if (ringRef.current) {
                ringRef.current.style.transform =
                    `translate(${ring.current.x}px, ${ring.current.y}px)`;
            }

            // trail con lag progresivo
            trails.forEach((t, i) => {
                const prev = i === 0 ? ring.current : trails[i - 1];
                t.x = lerp(t.x, prev.x, 0.35 - i * 0.025);
                t.y = lerp(t.y, prev.y, 0.35 - i * 0.025);
                t.el.style.transform = `translate(${t.x}px, ${t.y}px)`;
                t.el.style.opacity = String((1 - i / TRAIL_COUNT) * 0.45);
            });

            raf.current = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onOver);
            cancelAnimationFrame(raf.current);
            trails.forEach(t => t.el.remove());
        };
    }, []);

    return (
        <>
            {/* Dot preciso */}
            <div ref={dotRef} className={`cursor-dot cursor-dot--${variant}`} />
            {/* Ring con lag */}
            <div ref={ringRef} className={`cursor-ring cursor-ring--${variant}`}>
                {label && <span className="cursor-label">{label}</span>}
            </div>
        </>
    );
}
