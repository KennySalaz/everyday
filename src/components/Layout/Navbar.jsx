import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoBlack from '../../assets/logos/Everyday.png';
import logoWhite from '../../assets/logos/Logo blancoEveryday.png';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Detectar si estamos en Home para usar navbar transparente sobre el hero
    const isHome = location.pathname === '/';

    return (
        <>
            <nav className={`navbar ${isScrolled || !isHome ? 'is-scrolled' : ''}`}>
                <div className="container navbar-container">
        <div className="navbar-logo">
                <Link to="/">
                    <img
                        src={isScrolled || !isHome ? logoBlack : logoWhite}
                        alt="Everyday"
                        className="navbar-logo-img"
                    />
                </Link>
            </div>                    {/* Desktop Menu */}
                    <ul className="navbar-links desktop-only">
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/shop">Tienda</Link></li>
                    </ul>

                    <div className="navbar-actions">
                        <button className="icon-btn mobile-only" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/shop">Tienda</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
