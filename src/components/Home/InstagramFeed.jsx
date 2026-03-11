import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram } from 'lucide-react';
import './InstagramFeed.css';

gsap.registerPlugin(ScrollTrigger);

const instagramImages = [
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596944924616-b0e5c6a18d1e?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601121141477-170d4d1572d7?q=80&w=2670&auto=format&fit=crop"
];

const InstagramFeed = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* Header entra desde arriba */
            gsap.fromTo('.instagram-header, .instagram-subtitle',
                { y: -40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.9, stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
                }
            );

            /* Imágenes: clip-path circle expand en stagger */
            gsap.fromTo('.instagram-item',
                { clipPath: 'circle(0% at 50% 50%)', opacity: 0, scale: 1.1 },
                {
                    clipPath: 'circle(75% at 50% 50%)',
                    opacity: 1,
                    scale: 1,
                    duration: 0.9,
                    stagger: { each: 0.12, from: 'start' },
                    ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
                }
            );

            /* Parallax Y independiente por foto — cada una a diferente velocidad */
            const speeds = [1.2, 2.2, 1.6, 2.8];
            const yRanges = [['5%', '-5%'], ['9%', '-9%'], ['4%', '-4%'], ['11%', '-11%']];
            gsap.utils.toArray('.instagram-item img').forEach((img, i) => {
                gsap.fromTo(img,
                    { y: yRanges[i][0], scale: 1.18, filter: 'brightness(0.82) saturate(0.7)' },
                    {
                        y: yRanges[i][1],
                        scale: 1.04,
                        filter: 'brightness(1) saturate(1)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: img.closest('.instagram-item'),
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: speeds[i],
                        },
                    }
                );
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="instagram-section">
            <div className="container">
                <div className="instagram-header">
                    <Instagram size={24} />
                    <h2>@EverydayJewelry</h2>
                </div>
                <p className="instagram-subtitle">Follow us for daily inspiration</p>

                <div className="instagram-grid">
                    {instagramImages.map((img, index) => (
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" key={index} className="instagram-item">
                            <div className="instagram-overlay">
                                <Instagram size={32} color="#fff" />
                            </div>
                            <img src={img} alt="Instagram post" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
