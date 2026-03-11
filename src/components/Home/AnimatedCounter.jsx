import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * AnimatedCounter — cuenta de 0 al valor `to` cuando entra en viewport.
 *
 * Props:
 *   to       {number}  — valor destino
 *   duration {number}  — segundos de animación (default 1.8)
 *   prefix   {string}  — prefijo (ej. '$')
 *   suffix   {string}  — sufijo (ej. '+', '%', '★')
 *   decimals {number}  — decimales a mostrar (default 0)
 *   className {string}
 */
export default function AnimatedCounter({
    to = 100,
    duration = 1.8,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = '',
    delay = 0,
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const [count, setCount] = useState(0);
    const rafRef = useRef(null);
    const startedRef = useRef(false);

    useEffect(() => {
        if (!inView || startedRef.current) return;
        startedRef.current = true;

        let startTime = null;
        const delayMs = delay * 1000;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime - delayMs;
            if (elapsed < 0) { rafRef.current = requestAnimationFrame(step); return; }

            const progress = Math.min(elapsed / (duration * 1000), 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(to * eased);

            if (progress < 1) rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [inView]); // eslint-disable-line

    const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

    return (
        <span ref={ref} className={className}>
            {prefix}{display}{suffix}
        </span>
    );
}
