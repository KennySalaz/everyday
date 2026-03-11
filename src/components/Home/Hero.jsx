import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=2670&auto=format&fit=crop",
        tag: "New Collection",
        title: "Elegant\nSimplicity",
        subtitle: "Handcrafted pieces that celebrate the beauty in your everyday moments.",
        cta: "Shop Now"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2574&auto=format&fit=crop",
        tag: "Best Sellers",
        title: "Timeless\nElegance",
        subtitle: "Gold vermeil and ethically sourced gemstones for lasting beauty.",
        cta: "Explore"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=2670&auto=format&fit=crop",
        tag: "Limited Edition",
        title: "Shine\nBright",
        subtitle: "Statement pieces for every occasion. Discover your signature.",
        cta: "View Pieces"
    }
];

const Hero = () => {
    const heroRef = useRef(null);

    /* Parallax de salida: cuando el hero sale por arriba, la imagen baja */
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const imgY     = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
    const panelY   = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
    const panelOp  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const imgBlur  = useTransform(scrollYProgress, [0, 1], [0, 6]);
    const blurStr  = useTransform(imgBlur, v => `blur(${v.toFixed(1)}px) saturate(${(1 - v * 0.06).toFixed(2)})`);

    return (
        <section ref={heroRef} className="hero">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                speed={1500}
                navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev' }}
                pagination={{ clickable: true, el: '.hero-pagination' }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop
                className="hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="hero-slide-full">
                            {/* Imagen con parallax scrubbed al scrollear fuera */}
                            <motion.div
                                className="hero-bg-image"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    y: imgY,
                                    scale: imgScale,
                                    filter: blurStr,
                                }}
                            >
                                <div className="hero-bg-overlay" />
                            </motion.div>

                            {/* Panel de contenido también sube al salir */}
                            <div className="hero-content-container container">
                                <motion.div
                                    className="hero-glass-panel"
                                    style={{ y: panelY, opacity: panelOp }}
                                    initial={{ opacity: 0, y: 60 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.2, ease: [0.165, 0.84, 0.44, 1] }}
                                >
                                    <span className="hero-tag">{slide.tag}</span>
                                    <h1 className="hero-title">{slide.title}</h1>
                                    <p className="hero-subtitle">{slide.subtitle}</p>
                                    <div className="hero-actions">
                                        <Link to="/shop" className="hero-cta">
                                            {slide.cta} <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom controls */}
            <div className="hero-controls-glass">
                <button className="hero-prev hero-nav-btn">&#8592;</button>
                <div className="hero-pagination" />
                <button className="hero-next hero-nav-btn">&#8594;</button>
            </div>

            {/* Flecha de scroll indicador */}
            <motion.div
                className="hero-scroll-hint"
                style={{ opacity: panelOp }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
                <span className="hero-scroll-line" />
            </motion.div>
        </section>
    );
};

export default Hero;
