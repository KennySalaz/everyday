import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        location: "New York, USA",
        text: "Estoy absolutamente enamorada de mi collar. La calidad es excepcional — se siente verdaderamente lujoso. Llegó bellamente empaquetado y luce aún mejor en persona.",
        rating: 5,
        product: "Golden Sunrise Necklace",
        avatar: "SJ",
    },
    {
        id: 2,
        name: "Emily Rodriguez",
        location: "Miami, FL",
        text: "Joyería para cada día que realmente se siente especial. Llevo mi brazalete de oro rosa constantemente y sigue viéndose impecable meses después. La artesanía es excepcional.",
        rating: 5,
        product: "Rose Gold Cuff",
        avatar: "ER",
    },
    {
        id: 3,
        name: "Jessica Park",
        location: "Los Angeles, CA",
        text: "Servicio al cliente increíble y productos aún mejores. Los aretes de perla que pedí son delicados y atemporales — he recibido tantos cumplidos.",
        rating: 5,
        product: "Pearl Drop Earrings",
        avatar: "JP",
    }
];

const Testimonials = () => {
    const [active, setActive] = useState(0);
    const sectionRef          = useRef(null);

    useEffect(() => {
        const id = setInterval(() => setActive(c => (c + 1) % testimonials.length), 5500);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.t-eyebrow, .t-heading',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
                }
            );
            gsap.fromTo('.t-card',
                { y: 60, opacity: 0, scale: 0.96 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.85, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="testimonials-section">
            <div className="t-bg-word" aria-hidden="true">REVIEWS</div>

            <div className="container">
                <div className="t-header">
                    <p className="t-eyebrow">Lo que dicen</p>
                    <h2 className="t-heading">Clientes reales,<br /> resultados reales</h2>
                    <div className="t-header-line" />
                </div>

                <div className="t-grid">
                    {testimonials.map((t, i) => (
                        <div
                            key={t.id}
                            className={`t-card ${i === active ? 't-card--active' : ''}`}
                            onClick={() => setActive(i)}
                        >
                            <div className="t-card-top">
                                <Quote className="t-quote-icon" size={28} />
                                <div className="t-stars">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} size={13} fill="#D4AF37" stroke="none" />
                                    ))}
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {i === active ? (
                                    <motion.p
                                        key="full"
                                        className="t-text t-text--full"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.45 }}
                                    >
                                        {t.text}
                                    </motion.p>
                                ) : (
                                    <p key="short" className="t-text t-text--short">
                                        {t.text.slice(0, 70)}…
                                    </p>
                                )}
                            </AnimatePresence>

                            <div className="t-author">
                                <div className="t-avatar">{t.avatar}</div>
                                <div className="t-author-info">
                                    <strong>{t.name}</strong>
                                    <span>{t.location}</span>
                                </div>
                                <span className="t-product-tag">{t.product}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="t-indicators">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            className={`t-pip ${i === active ? 'active' : ''}`}
                            onClick={() => setActive(i)}
                            aria-label={`Testimonio ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
