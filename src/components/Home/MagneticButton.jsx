import React, { useRef, useCallback } from 'react';

/**
 * MagneticButton — envuelve un botón/link y lo atrae hacia el cursor.
 * 
 * Props:
 *   children   — contenido del botón
 *   strength   — intensidad del efecto (0.3 = suave, 0.6 = fuerte)
 *   className  — clase del wrapper
 *   as         — tag del elemento (div, button, a…)
 */
export default function MagneticButton({
    children,
    strength = 0.4,
    className = '',
    as: Tag = 'div',
    ...rest
}) {
    const ref = useRef(null);

    const onMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
    }, [strength]);

    const onLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
        el.style.transform = 'translate(0, 0)';
        setTimeout(() => {
            if (el) el.style.transition = '';
        }, 500);
    }, []);

    const onEnter = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = 'transform 0.15s ease';
    }, []);

    return (
        <Tag
            ref={ref}
            className={`magnetic-btn ${className}`}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onMouseEnter={onEnter}
            {...rest}
        >
            {children}
        </Tag>
    );
}
