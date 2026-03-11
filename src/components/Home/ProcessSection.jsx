import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitTitle from './SplitTitle';
import './ProcessSection.css';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    {
        number: '01',
        title: 'Diseño',
        desc: 'Cada pieza nace como un boceto a mano. Estudiamos proporciones, texturas y la historia que quiere contar.',
        icon: '✏️',
        image: 'https://images.unsplash.com/photo-1559818820-7c1b1e0e4b3d?q=80&w=800&auto=format&fit=crop',
    },
    {
        number: '02',
        title: 'Material',
        desc: 'Seleccionamos oro 14K y piedras de origen ético. Solo lo mejor merece llevar nuestro nombre.',
        icon: '💎',
        image: 'https://images.unsplash.com/photo-1605100804763-eb2fc6d2e67c?q=80&w=800&auto=format&fit=crop',
    },
    {
        number: '03',
        title: 'Artesanía',
        desc: 'Manos expertas dan forma al metal. Cada soldadura, cada pulido es un acto de precisión y amor.',
        icon: '🔨',
        image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=800&auto=format&fit=crop',
    },
    {
        number: '04',
        title: 'Para ti',
        desc: 'Cada joya sale envuelta en nuestra firma. Lista para ser parte de tu historia.',
        icon: '✨',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
    },
];

export default function ProcessSection() {
    const sectionRef = useRef(null);
    const lineRef    = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* Línea de progreso se dibuja al scrollear */
            gsap.fromTo(lineRef.current,
                { scaleX: 0, transformOrigin: 'left' },
                {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 60%',
                        end: 'bottom 70%',
                        scrub: 1,
                    },
                }
            );

            /* Cada step entra con stagger + clip desde abajo */
            gsap.utils.toArray('.proc-step').forEach((step, i) => {
                gsap.fromTo(step,
                    { y: 80, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
                    {
                        y: 0,
                        opacity: 1,
                        clipPath: 'inset(0% 0 0 0)',
                        duration: 0.9,
                        delay: i * 0.12,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 65%',
                        },
                    }
                );

                /* Imagen: diagonal mask reveal + parallax + grayscale→color */
                const imgWrap = step.querySelector('.proc-img-wrap');
                const img     = step.querySelector('.proc-img');
                if (imgWrap && img) {
                    /* Diagonal reveal: clip-path de esquina a esquina */
                    gsap.fromTo(imgWrap,
                        { clipPath: 'inset(100% 0 0 100%)' },
                        {
                            clipPath: 'inset(0% 0 0 0%)',
                            duration: 1.1,
                            delay: i * 0.15,
                            ease: 'power3.inOut',
                            scrollTrigger: {
                                trigger: step,
                                start: 'top 78%',
                            },
                        }
                    );

                    /* Parallax Y + grayscale→color al scrollear */
                    gsap.fromTo(img,
                        { scale: 1.22, y: '6%', filter: 'grayscale(70%) saturate(0.3) brightness(0.8)' },
                        {
                            scale: 1,
                            y: '-6%',
                            filter: 'grayscale(0%) saturate(1.1) brightness(1)',
                            ease: 'none',
                            scrollTrigger: {
                                trigger: step,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: 1.8,
                            },
                        }
                    );
                }
            });

            /* Número decorativo de fondo se mueve en parallax */
            gsap.utils.toArray('.proc-bg-num').forEach(num => {
                gsap.fromTo(num,
                    { y: 40 },
                    {
                        y: -40,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: num.closest('.proc-step'),
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 2,
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="process-section">
            <div className="container">

                {/* Header */}
                <div className="proc-header">
                    <p className="section-label proc-label">nuestro proceso</p>
                    <SplitTitle
                        text="Hecho con intención"
                        as="h2"
                        mode="words"
                        className="proc-headline"
                    />
                    <p className="proc-subhead">
                        Del boceto a tus manos — cada paso con propósito.
                    </p>
                </div>

                {/* Línea de progreso */}
                <div className="proc-timeline-wrap">
                    <div ref={lineRef} className="proc-timeline-line" />
                </div>

                {/* Pasos */}
                <div className="proc-grid">
                    {STEPS.map((step, i) => (
                        <div key={i} className={`proc-step proc-step--${i % 2 === 0 ? 'even' : 'odd'}`}>
                            {/* Número decorativo de fondo */}
                            <span className="proc-bg-num" aria-hidden="true">{step.number}</span>

                            {/* Imagen */}
                            <div className="proc-img-wrap">
                                <img className="proc-img" src={step.image} alt={step.title} loading="lazy" />
                                <div className="proc-img-tint" />
                                <span className="proc-icon">{step.icon}</span>
                            </div>

                            {/* Texto */}
                            <div className="proc-body">
                                <span className="proc-num-label">{step.number}</span>
                                <h3 className="proc-title">{step.title}</h3>
                                <p className="proc-desc">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
