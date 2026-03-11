import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail, Gift, Zap } from 'lucide-react';
import './Newsletter.css';

gsap.registerPlugin(ScrollTrigger);

const perks = [
    { icon: Gift,  label: '10% descuento en tu primer pedido' },
    { icon: Zap,   label: 'Acceso anticipado a nuevas colecciones' },
    { icon: Mail,  label: 'Contenido exclusivo para miembros' },
];

const Newsletter = () => {
    const sectionRef = useRef(null);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.nl-left',
                { x: -70, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
                  scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
            );
            gsap.fromTo('.nl-right',
                { x: 70, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.1, delay: 0.12, ease: 'power3.out',
                  scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
            );
            gsap.fromTo('.nl-perk',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
                  scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } }
            );
            /* Línea divisora */
            gsap.fromTo('.nl-divider',
                { scaleY: 0, transformOrigin: 'top' },
                { scaleY: 1, duration: 1.2, ease: 'power3.out',
                  scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <section ref={sectionRef} className="nl-section">
            {/* Fondo con textura */}
            <div className="nl-bg" aria-hidden="true" />
            <div className="nl-bg-word" aria-hidden="true">CLUB</div>

            <div className="container nl-inner">
                {/* Columna izquierda */}
                <div className="nl-left">
                    <p className="nl-eyebrow">Únete al club</p>
                    <h2 className="nl-title">
                        Sé el primero<br />
                        en saberlo
                    </h2>
                    <p className="nl-subtitle">
                        Acceso exclusivo a lanzamientos, piezas limitadas y
                        beneficios que no encontrarás en ningún otro lugar.
                    </p>
                    <ul className="nl-perks">
                        {perks.map(({ icon: Icon, label }, i) => (
                            <li key={i} className="nl-perk">
                                <span className="nl-perk-icon"><Icon size={15} /></span>
                                <span>{label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Divisor vertical */}
                <div className="nl-divider" aria-hidden="true" />

                {/* Columna derecha */}
                <div className="nl-right">
                    {sent ? (
                        <div className="nl-success">
                            <div className="nl-success-icon">✦</div>
                            <h3>¡Bienvenida al club!</h3>
                            <p>Revisa tu correo para confirmar tu suscripción y obtener tu descuento.</p>
                        </div>
                    ) : (
                        <>
                            <p className="nl-form-label">Tu correo electrónico</p>
                            <form className="nl-form" onSubmit={handleSubmit}>
                                <div className="nl-input-group">
                                    <input
                                        type="email"
                                        placeholder="nombre@correo.com"
                                        required
                                        className="nl-input"
                                    />
                                    <button type="submit" className="nl-btn">
                                        Unirme <ArrowRight size={15} />
                                    </button>
                                </div>
                                <p className="nl-disclaimer">
                                    Sin spam. Jamás. Cancela cuando quieras.
                                </p>
                            </form>

                            {/* Social proof */}
                            <div className="nl-proof">
                                <div className="nl-proof-avatars">
                                    {['A','B','C','D'].map((l, i) => (
                                        <div key={i} className="nl-proof-av" style={{ zIndex: 4 - i }}>{l}</div>
                                    ))}
                                </div>
                                <span>+2,400 personas ya son miembros</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
