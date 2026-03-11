import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

export default function TextScramble({ text, as: Tag = 'span', className = '', delay = 0, duration = 1.2, trigger = true }) {
    const [output, setOutput] = useState(() => text.replace(/[^ ]/g, '?'));
    const frameRef = useRef(null);
    const startedRef = useRef(false);

    const scramble = () => {
        const chars = CHARS;
        const total = text.length;
        let revealed = 0;
        const start = performance.now() + delay * 1000;
        const end = start + duration * 1000;

        const tick = (now) => {
            if (now < start) { frameRef.current = requestAnimationFrame(tick); return; }

            const progress = Math.min((now - start) / (end - start), 1);
            revealed = Math.floor(progress * total);

            setOutput(
                text.split('').map((char, i) => {
                    if (char === ' ') return ' ';
                    if (i < revealed) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );

            if (progress < 1) frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        if (trigger && !startedRef.current) {
            startedRef.current = true;
            scramble();
        }
        return () => cancelAnimationFrame(frameRef.current);
    }, [trigger]); // eslint-disable-line

    return <Tag className={className}>{output}</Tag>;
}

/* ── Versión con observer (auto-trigger al entrar en viewport) ── */
export function ScrambleOnView({ text, as: Tag = 'span', className = '', delay = 0, duration = 1.2 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <Tag ref={ref} className={className}>
            {inView ? (
                <TextScramble text={text} as="span" delay={delay} duration={duration} trigger />
            ) : (
                text.replace(/[^ ]/g, '?')
            )}
        </Tag>
    );
}
