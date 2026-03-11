import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                {/* Column 1: Brand */}
                <div className="footer-col footer-brand" style={{ maxWidth: '400px' }}>
                    <h3 className="footer-logo">Everyday</h3>
                    <p>Joyas atemporales creadas para tus momentos cotidianos. Elaboradas a mano con amor y materiales responsables.</p>
                    <div className="footer-socials">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <Instagram size={18} />
                        </a>
                        <a href="https://wa.me/584241539300" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                            <MessageCircle size={18} />
                        </a>
                        <a href="mailto:hello@everyday.com" aria-label="Email">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>

                {/* Column 2: Contact */}
                <div className="footer-col">
                    <h4 className="footer-heading">Contacto Directo</h4>
                    <div className="footer-contact-item">
                        <Mail size={15} />
                        <a href="mailto:hello@everyday.com">hello@everyday.com</a>
                    </div>
                    <div className="footer-contact-item">
                        <MessageCircle size={15} />
                        <a href="https://wa.me/584241539300" target="_blank" rel="noreferrer">Escríbenos al WhatsApp (+58 424-1539300)</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p>&copy; {new Date().getFullYear()} Everyday Jewelry. Todos los derechos reservados.</p>
                    <p className="footer-tagline">Hecho con ♡ para ti</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
