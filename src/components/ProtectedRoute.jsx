import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const [user, setUser] = useState(undefined); // undefined = cargando

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null);
        });
        return unsubscribe;
    }, []);

    // Mientras Firebase verifica la sesión, no redirigir aún
    if (user === undefined) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f0eb',
            }}>
                <div style={{
                    width: 32,
                    height: 32,
                    border: '3px solid rgba(74,59,50,0.15)',
                    borderTopColor: '#D4AF37',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/ed-admin-2026/login" state={{ from: location.pathname }} replace />;
    }

    return children;
}
