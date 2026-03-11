import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SplitTitle — anima cada letra/palabra con stagger GSAP al entrar en viewport.
 *
 * Props:
 *   text     {string}  — texto a animar
 *   as       {string}  — tag HTML (h1, h2, h3, p…)
 *   mode     {string}  — 'chars' | 'words'
 *   delay    {number}  — delay en segundos
 *   className {string}
 *   style    {object}
 */
export default function SplitTitle({
    text,
    as: Tag = 'h2',
    mode = 'words',
    delay = 0,
    className = '',
    style = {},
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Dividir en spans
        const units = mode === 'chars'
            ? text.split('')
            : text.split(' ');

        el.innerHTML = units
            .map((u, i) =>
                `<span class="split-unit" style="display:inline-block; overflow:hidden; vertical-align:bottom;">`
                + `<span class="split-inner" style="display:inline-block;">${u === ' ' ? '&nbsp;' : u}</span>`
                + `</span>${mode === 'words' && i < units.length - 1 ? ' ' : ''}`
            )
            .join('');

        const inners = el.querySelectorAll('.split-inner');

        gsap.fromTo(inners,
            {
                y: '110%',
                opacity: 0,
                rotateZ: mode === 'chars' ? 6 : 2,
            },
            {
                y: '0%',
                opacity: 1,
                rotateZ: 0,
                duration: mode === 'chars' ? 0.6 : 0.85,
                stagger: mode === 'chars' ? 0.035 : 0.08,
                delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
            }
        );

        return () => ScrollTrigger.getAll().forEach(t => t.vars?.trigger === el && t.kill());
    }, [text, mode, delay]);

    return <Tag ref={ref} className={className} style={style} aria-label={text} />;
}
