import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Hammer, FileText, UserCircle, ArrowLeft, TrendingUp, X, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import './Sidebar.css';

export default function Sidebar({ lowStockCount = 0, isOpen, onClose }) {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/ed-admin-2026/login', { replace: true });
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

            <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                {/* Close button (mobile only) */}
                <button className="sidebar-close-btn" onClick={onClose}>
                    <X size={22} />
                </button>

                <div className="sidebar-header">
                    <div className="brand-logo">
                        <div className="logo-icon">E</div>
                        <div>
                            <h2>Everyday</h2>
                            <span className="brand-subtitle">Business Panel</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <h4 className="nav-title">MENU</h4>
                        <ul>
                            <li>
                                <NavLink to="/ed-admin-2026/inventory" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
                                    <FileText size={20} />
                                    <span>Piezas</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/ed-admin-2026/builder" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
                                    <Hammer size={20} />
                                        <span>Crear Producto</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/ed-admin-2026" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
                                    <LayoutDashboard size={20} />
                                        <span>Productos Disponibles</span>
                                    {lowStockCount > 0 && (
                                        <span className="nav-badge">{lowStockCount}</span>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/ed-admin-2026/sales" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
                                    <TrendingUp size={20} />
                                    <span>Ventas & Análisis</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="nav-section mt-auto">
                        <ul>
                            <li>
                                <Link to="/" className="nav-item return-link">
                                    <ArrowLeft size={20} />
                                    <span>Volver a la landing</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            <UserCircle size={32} color="#fff" />
                        </div>
                        <div className="user-info">
                            <h4>{user?.email?.split('@')[0] ?? 'Admin'}</h4>
                            <span>{user?.email ?? 'Owner'}</span>
                        </div>
                    </div>
                    <button className="sidebar-logout-btn" onClick={handleLogout} title="Cerrar sesión">
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
}
