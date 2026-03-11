import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import './HorizontalScroll.css';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
    {
        title: 'Necklaces',
        desc: 'Timeless chains & pendants',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1000&auto=format&fit=crop',
        to: '/shop',
        label: 'Explorar',
    },
    {
        title: 'Earrings',
        desc: 'Elevate your everyday',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
        to: '/shop',
        label: 'Descubrir',
    },
    {
        title: 'Rings',
        desc: 'Statements on your hands',
        image: 'https://images.unsplash.com/photo-1605100804763-eb2fc6d2e67c?q=80&w=1000&auto=format&fit=crop',
        to: '/shop',
        label: 'Ver todo',
    },
    {
        title: 'Bracelets',
        desc: 'Stackable golden layers',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
        to: '/shop',
        label: 'Comprar',
    },
    {
        title: 'All Jewelry',
        desc: 'The full collection',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop',
        to: '/shop',
        label: 'Ver colección',
    },
];

export default function HorizontalScroll() {
    const sectionRef = useRef(null);
    const trackRef   = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const track   = trackRef.current;
        if (!section || !track) return;

        // Evitar en móvil
        if (window.matchMedia('(max-width: 768px)').matches) return;

        const ctx = gsap.context(() => {
            const totalWidth = track.scrollWidth - track.offsetWidth;

            // ── Main horizontal scroll ─────────────────────────────────
            const mainST = ScrollTrigger.create({
                trigger: section,
                pin: true,
                scrub: 1.2,
                start: 'top top',
                end: () => `+=${totalWidth}`,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    gsap.to(track, {
                        x: -totalWidth * self.progress,
                        ease: 'none',
                        overwrite: 'auto',
                        duration: 0,
                    });
                },
            });

            // ── Por cada slide: escala + brightness/saturación + counter-parallax ──
            gsap.utils.toArray('.hscroll-slide').forEach((slide, i) => {
                const img = slide.querySelector('.hscroll-img');

                const slideStart = i / SLIDES.length;
                const slideMid   = (i + 0.5) / SLIDES.length;
                const slideEnd   = (i + 1) / SLIDES.length;

                // Scale: entra grande, se normaliza al centro, vuelve a crecer al salir
                gsap.fromTo(img,
                    { scale: 1.18, filter: 'brightness(0.6) saturate(0.3)' },
                    {
                        scale: 1,
                        filter: 'brightness(1.05) saturate(1.1)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            scrub: true,
                            start: `${slideStart * 100}% top`,
                            end:   `${slideMid  * 100}% top`,
                            containerAnimation: gsap.to(track, { x: -totalWidth, ease: 'none', paused: true }),
                        },
                    }
                );

                gsap.fromTo(img,
                    { scale: 1, filter: 'brightness(1.05) saturate(1.1)' },
                    {
                        scale: 1.15,
                        filter: 'brightness(0.65) saturate(0.35)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            scrub: true,
                            start: `${slideMid  * 100}% top`,
                            end:   `${slideEnd  * 100}% top`,
                            containerAnimation: gsap.to(track, { x: -totalWidth, ease: 'none', paused: true }),
                        },
                    }
                );

                // Counter-parallax: imagen se mueve opuesta al track (crea profundidad)
                gsap.fromTo(img,
                    { x: '8%' },
                    {
                        x: '-8%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            scrub: 1.5,
                            start: 'top top',
                            end:   () => `+=${totalWidth}`,
                        },
                    }
                );
            });

        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hscroll-section" aria-label="Colecciones en scroll horizontal">
            <div ref={trackRef} className="hscroll-track">
                {/* Etiqueta fija a la izquierda */}
                <div className="hscroll-fixed-label">
                    <span>colecciones</span>
                    <div className="hscroll-fixed-line" />
                </div>

                {SLIDES.map((slide, i) => (
                    <article key={i} className="hscroll-slide">
                        <div className="hscroll-img-wrap">
                            <img
                                className="hscroll-img"
                                src={slide.image}
                                alt={slide.title}
                                loading="lazy"
                            />
                            <div className="hscroll-tint" />
                        </div>
                        <div className="hscroll-content">
                            <span className="hscroll-index">0{i + 1}</span>
                            <h3 className="hscroll-title">{slide.title}</h3>
                            <p className="hscroll-desc">{slide.desc}</p>
                            <Link to={slide.to} className="hscroll-cta" data-cursor="view">
                                {slide.label} <ArrowRight size={14} />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {/* Indicador de progreso horizontal */}
            <div className="hscroll-progress-wrap">
                {SLIDES.map((_, i) => (
                    <div key={i} className="hscroll-pip" />
                ))}
            </div>
        </section>
    );
}
