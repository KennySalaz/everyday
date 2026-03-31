import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import './LoginPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || '/ed-admin-2026';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            navigate(from, { replace: true });
        } catch (err) {
            const msgs = {
                'auth/invalid-credential': 'Correo o contraseña incorrectos.',
                'auth/user-not-found': 'No existe una cuenta con ese correo.',
                'auth/wrong-password': 'Contraseña incorrecta.',
                'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
                'auth/invalid-email': 'El correo no tiene un formato válido.',
            };
            setError(msgs[err.code] || 'Error al iniciar sesión. Intenta de nuevo.');
            setLoading(false);
        }
    };

    return (
        <div className="lp-root">

            {/* ── Panel izquierdo decorativo ── */}
            <div className="lp-left" aria-hidden="true">
                <div className="lp-left-content">
                    <div className="lp-left-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                        </svg>
                        everyday
                    </div>
                    <h2 className="lp-left-headline">
                        Gestiona tu negocio<br />
                        desde un solo lugar.
                    </h2>
                    <p className="lp-left-sub">
                        Inventario, cotizaciones y ventas al alcance de tu mano.
                    </p>

                    {/* Tarjetas flotantes decorativas */}
                    <div className="lp-cards-decor">
                        <div className="lp-card-decor lp-card-decor--a">
                            <span className="lp-card-decor-icon">💎</span>
                            <div>
                                <div className="lp-card-decor-title">Inventario</div>
                                <div className="lp-card-decor-sub">32 productos activos</div>
                            </div>
                        </div>
                        <div className="lp-card-decor lp-card-decor--b">
                            <span className="lp-card-decor-icon">✨</span>
                            <div>
                                <div className="lp-card-decor-title">Cotizaciones</div>
                                <div className="lp-card-decor-sub">Genera en segundos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Panel derecho — formulario ── */}
            <div className="lp-right">
                {/* Logo superior */}
                <div className="lp-brand">
                    <div className="lp-brand-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <span className="lp-brand-name">everyday</span>
                </div>

                <div className="lp-form-wrap">
                    <h1 className="lp-title">Bienvenida de vuelta</h1>
                    <p className="lp-subtitle">Inicia sesión en tu cuenta.</p>

                    <form className="lp-form" onSubmit={handleSubmit} noValidate>

                        {/* Email */}
                        <div className="lp-field">
                            <label className="lp-label" htmlFor="lp-email">Correo electrónico</label>
                            <input
                                id="lp-email"
                                type="email"
                                className="lp-input"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                placeholder="Everydayvzla@gmail.com"
                                autoComplete="email"
                                autoFocus
                                required
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="lp-field">
                            <label className="lp-label" htmlFor="lp-pass">Contraseña</label>
                            <div className="lp-pass-wrap">
                                <input
                                    id="lp-pass"
                                    type={showPass ? 'text' : 'password'}
                                    className="lp-input lp-input--pass"
                                    value={pass}
                                    onChange={e => { setPass(e.target.value); setError(''); }}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="lp-eye-btn"
                                    onClick={() => setShowPass(v => !v)}
                                    aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                                >
                                    {showPass ? (
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="lp-error">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            className="lp-btn"
                            disabled={loading || !email || !pass}
                        >
                            {loading ? <span className="lp-spinner" /> : 'Iniciar sesión'}
                        </button>
                    </form>

                    <p className="lp-footer">Panel privado · everyday jewelry</p>
                </div>
            </div>
        </div>
    );
}
