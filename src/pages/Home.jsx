import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
    useInView,
    useSpring,
    useVelocity,
} from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ShoppingBag, Sparkles, Star } from 'lucide-react';
import Hero from '../components/Home/Hero';
import Testimonials from '../components/Home/Testimonials';
import InstagramFeed from '../components/Home/InstagramFeed';
import Newsletter from '../components/Home/Newsletter';
import HorizontalScroll from '../components/Home/HorizontalScroll';
import VelocitySection from '../components/Home/VelocitySection';
import AnimatedCounter from '../components/Home/AnimatedCounter';
import { ScrambleOnView } from '../components/Home/TextScramble';
import SplitTitle from '../components/Home/SplitTitle';
import ProcessSection from '../components/Home/ProcessSection';
import MagneticButton from '../components/Home/MagneticButton';
import GoldParticles from '../components/Home/GoldParticles';
import { products } from '../data/products';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Datos ─────────────────────────────────────────────────── */
const categories = [
    { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop', desc: 'Timeless chains & pendants' },
    { name: 'Earrings',  image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop', desc: 'Elevate your everyday' },
    { name: 'Rings',     image: 'https://images.unsplash.com/photo-1605100804763-eb2fc6d2e67c?q=80&w=800&auto=format&fit=crop', desc: 'Statements on your hands' },
    { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', desc: 'Stackable golden layers' },
];

const stats = [
    { value: 500, suffix: '+', label: 'Piezas vendidas' },
    { value: 100, suffix: '%', label: 'Calidad artesanal' },
    { value: 5,   suffix: '★', label: 'Valoración promedio' },
    { value: 2,   suffix: '+', label: 'Años de experiencia' },
];

const marqueeWords = ['GOLD', 'JEWELRY', 'HANDCRAFTED', 'EVERYDAY', 'ELEGANT', 'TIMELESS', 'LUXURY', 'ARTISAN'];

/* ── Helpers de animación ───────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 52 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay, ease: [0.165, 0.84, 0.44, 1] }}
        >
            {children}
        </motion.div>
    );
}

function SlideIn({ children, direction = 'left', delay = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const x = direction === 'left' ? -60 : 60;
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, x }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay, ease: [0.165, 0.84, 0.44, 1] }}
        >
            {children}
        </motion.div>
    );
}

/* ── Componente Marquee (velocidad reactiva al scroll) ─────── */
function Marquee() {
    const words = [...marqueeWords, ...marqueeWords];
    const { scrollY } = useScroll();
    const velocity = useVelocity(scrollY);
    /* skewX sutil en función de la velocidad */
    const rawSkew = useTransform(velocity, [-2000, 0, 2000], ['-6deg', '0deg', '6deg']);
    const skewX = useSpring(rawSkew, { stiffness: 80, damping: 25 });
    /* Factor de velocidad de la animación */
    const rawSpeed = useTransform(velocity, [-3000, 0, 3000], [8, 22, 8]);
    const speed = useSpring(rawSpeed, { stiffness: 60, damping: 20 });

    return (
        <div className="marquee-strip">
            <motion.div
                className="marquee-track"
                style={{ skewX }}
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
            >
                {words.map((w, i) => (
                    <span key={i} className="marquee-word">
                        {w} <span className="marquee-dot">✦</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

/* ── Componente Categoría Card ──────────────────────────── */
function CategoryCard({ cat, index }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    opacity: 1,
                    duration: 1.1,
                    delay: index * 0.1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 82%' },
                }
            );
            /* Imagen: zoom-out + brightness scrub al scrollear */
            const img = el.querySelector('img');
            if (img) {
                gsap.fromTo(img,
                    { scale: 1.22, filter: 'brightness(0.7) saturate(0.5)' },
                    {
                        scale: 1,
                        filter: 'brightness(1) saturate(1)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.5,
                        },
                    }
                );
            }
        });

        /* Tilt 3D en mousemove */
        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * 18;
            const ry = ((e.clientX - rect.left) / rect.width  - 0.5) * -18;
            el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
        };
        const onLeave = () => {
            el.style.transform = '';
            el.style.transition = 'transform 0.6s ease';
        };
        const onEnter = () => { el.style.transition = 'transform 0.12s linear'; };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);

        return () => {
            ctx.revert();
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
            el.removeEventListener('mouseenter', onEnter);
        };
    }, [index]);

    return (
        <div
            ref={ref}
            className="cat-card"
            style={{ willChange: 'clip-path, opacity, transform' }}
        >
            <Link to="/shop" className="cat-card-link">
                <div className="cat-img-wrap">
                    <img src={cat.image} alt={cat.name} loading="lazy" />
                    <div className="cat-overlay" />
                    {/* Info ahora vive sobre la imagen */}
                    <div className="cat-info">
                        <h3 className="cat-name">{cat.name}</h3>
                        <p className="cat-desc">{cat.desc}</p>
                        <div className="cat-hover-label">
                            <span>Explorar</span> <ArrowRight size={13} />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

/* ── Componente Product Card ────────────────────────────── */
function ProductCard({ product, index, onBuy }) {
    const ref = useRef(null);
    const fromX = index % 2 === 0 ? -50 : 50;
    /* Velocidades Y distintas: impares son más rápidos (más parallax) */
    const scrubSpeed = index % 2 === 0 ? 1.8 : 2.8;
    const yRange     = index % 2 === 0 ? ['4%', '-4%'] : ['7%', '-7%'];

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            /* Entrada */
            gsap.fromTo(el,
                { x: fromX, opacity: 0, scale: 0.92 },
                {
                    x: 0, opacity: 1, scale: 1,
                    duration: 1,
                    delay: (index % 2) * 0.08,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                }
            );
            /* Imagen: parallax Y diferencial + brightness scrub */
            const img = el.querySelector('img');
            if (img) {
                gsap.fromTo(img,
                    { scale: 1.18, y: yRange[0], filter: 'brightness(0.78) saturate(0.6)' },
                    {
                        scale: 1.02,
                        y: yRange[1],
                        filter: 'brightness(1.05) saturate(1.05)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: scrubSpeed,
                        },
                    }
                );
            }
        });
        return () => ctx.revert();
    }, [index, fromX, scrubSpeed]);

    return (
        <div
            ref={ref}
            className="prod-card"
            style={{ willChange: 'transform, opacity' }}
            onClick={() => onBuy(product)}
        >
            <div className="prod-img-wrap">
                {product.image
                    ? <img src={product.image} alt={product.name} loading="lazy" />
                    : <div className="prod-fallback"><ShoppingBag size={36} /></div>
                }
                <div className="prod-overlay" />
                <span className="prod-badge">{product.category || 'Destacado'}</span>
                <button className="prod-quick-buy">
                    <ShoppingBag size={15} /> Comprar
                </button>
            </div>
        </div>
    );
}

/* ── Sección parallax banner intermedio ─────────────────── */
function ParallaxBanner() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y        = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
    const opacity  = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
    const scale    = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1, 1.08]);
    const scaleX   = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1.04, 1, 1, 1.04]);
    const lineLeft = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '100%']);
    const lineRight= useTransform(scrollYProgress, [0.1, 0.6], ['100%', '0%']);
    const bgBlur   = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [5, 0, 0, 5]);
    const blurVal  = useTransform(bgBlur, v => `blur(${v.toFixed(1)}px)`);

    return (
        <section ref={ref} className="parallax-banner">
            <motion.div className="parallax-bg" style={{ y, scale, scaleX, filter: blurVal }}>
                <div className="parallax-tint" />
            </motion.div>

            {/* Esquinas decorativas */}
            <div className="pb-corner pb-corner--tl" aria-hidden="true" />
            <div className="pb-corner pb-corner--tr" aria-hidden="true" />
            <div className="pb-corner pb-corner--bl" aria-hidden="true" />
            <div className="pb-corner pb-corner--br" aria-hidden="true" />

            {/* Líneas decorativas que se dibujan al scrollear */}
            <div className="pb-lines" aria-hidden="true">
                <motion.div className="pb-line pb-line--top"    style={{ width: lineLeft }} />
                <motion.div className="pb-line pb-line--bottom" style={{ width: lineRight }} />
            </div>

            <motion.div className="parallax-content" style={{ opacity }}>
                <motion.p
                    className="parallax-eyebrow"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    <Sparkles size={14} /> nuestra filosofía
                </motion.p>

                <SplitTitle
                    text="Jewelry for your story"
                    as="blockquote"
                    mode="words"
                    delay={0.2}
                    className="parallax-quote"
                />

                <motion.p
                    className="parallax-source"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    — Everyday Studio
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 1 }}
                >
                    <MagneticButton as={Link} to="/about" className="pb-cta-wrap">
                        <span className="pb-cta">Nuestra historia <ArrowRight size={14} /></span>
                    </MagneticButton>
                </motion.div>
            </motion.div>
        </section>
    );
}

/* ── Sección Stats ──────────────────────────────────────── */
function StatsSection() {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.stat-item',
                { y: 60, opacity: 0, rotateX: 30 },
                {
                    y: 0, opacity: 1, rotateX: 0,
                    duration: 0.9,
                    stagger: 0.14,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: ref.current, start: 'top 80%' },
                }
            );
            gsap.fromTo('.stat-sep',
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: ref.current, start: 'top 78%' },
                }
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="stats-section">
            <GoldParticles />
            <div className="container stats-container">
                <div className="stats-eyebrow">
                    <ScrambleOnView text="our numbers" as="p" className="section-label" duration={1} />
                </div>
                <div className="stats-grid">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-item">
                            <span className="stat-big">
                                <AnimatedCounter to={s.value} suffix={s.suffix} delay={i * 0.14} duration={1.8} />
                            </span>
                            <span className="stat-lbl">{s.label}</span>
                            {i < stats.length - 1 && <div className="stat-sep" />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════════════════ */
const Home = () => {
    const featuredProducts = products.filter(p => p.featured).slice(0, 4);

    const handleBuyWhatsApp = (product) => {
        const price = product.price ? product.price.toFixed(2) : '0.00';
        const text = `Hola! Me interesa comprar el producto: ${product.name} por $${price}`;
        window.open(`https://wa.me/584125594826?text=${encodeURIComponent(text)}`, '_blank');
    };

    /* Scroll progress para la barra indicadora */
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div className="home-page">
            {/* Barra de progreso de scroll */}
            <motion.div className="scroll-progress-bar" style={{ scaleX }} />

            {/* ── Hero ─────────────────────────────────────── */}
            <Hero />

            {/* ── Marquee ──────────────────────────────────── */}
            <Marquee />

            {/* ── Stats animados ───────────────────────────── */}
            <StatsSection />

            {/* ── Horizontal Scroll (categorías pinned) ────── */}
            <HorizontalScroll />

            {/* ── Categorías (grid con GSAP clip reveal) ───── */}
            <section className="section-categories">
                <div className="container">
                    <div className="section-header-center">
                        <ScrambleOnView text="Browse" as="p" className="section-label" duration={0.8} />
                        <SplitTitle text="Shop by Category" as="h2" mode="words" className="section-title" />
                        <motion.div
                            className="section-divider"
                            initial={{ scaleX: 0, transformOrigin: 'left' }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        />
                    </div>
                    <div className="categories-grid">
                        {categories.map((cat, i) => (
                            <CategoryCard key={cat.name} cat={cat} index={i} />
                        ))}
                    </div>
                    <div className="categories-cta-row">
                        <MagneticButton as={Link} to="/shop" className="categories-cta-wrap">
                            <span className="categories-cta">
                                Ver todas las categorías <ArrowRight size={14} />
                            </span>
                        </MagneticButton>
                    </div>
                </div>
            </section>

            {/* ── Parallax Banner ──────────────────────────── */}
            <ParallaxBanner />

            {/* ── Proceso artesanal ────────────────────────── */}
            <ProcessSection />

            {/* ── Velocity Section (texto + blur) ──────────── */}
            <VelocitySection />

            {/* ── Best Sellers ─────────────────────────────── */}
            <section className="section-bestsellers">
                <div className="container">
                    <div className="section-header-row">
                        <div>
                            <ScrambleOnView text="Curated" as="p" className="section-label" duration={0.7} />
                            <SplitTitle text="Best Sellers" as="h2" mode="words" className="section-title" />
                        </div>
                        <SlideIn direction="right" delay={0.1}>
                            <MagneticButton as={Link} to="/shop" className="view-all-magnetic">
                                <span className="view-all-link">
                                    Ver colección <ArrowRight size={13} />
                                </span>
                            </MagneticButton>
                        </SlideIn>
                    </div>

                    <div className="bestsellers-grid">
                        {featuredProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} onBuy={handleBuyWhatsApp} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials, Instagram, Newsletter ──────── */}
            <Testimonials />
            <InstagramFeed />
            <Newsletter />
        </div>
    );
};

export default Home;
