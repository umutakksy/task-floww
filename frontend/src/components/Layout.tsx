import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    LogOut,
    Briefcase
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                    <div style={{
                        width: '40px', height: '40px', background: 'var(--primary)',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Briefcase color="white" size={20} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem' }}>TaskFlow</h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <NavLink
                        to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                            borderRadius: '12px', textDecoration: 'none', color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            transition: 'all 0.2s'
                        })}
                    >
                        <LayoutDashboard size={20} />
                        <span>Panel</span>
                    </NavLink>

                    {user?.role === 'ADMIN' && (
                        <NavLink
                            to="/admin/users"
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                borderRadius: '12px', textDecoration: 'none', color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                transition: 'all 0.2s'
                            })}
                        >
                            <Users size={20} />
                            <span>Kullanıcılar</span>
                        </NavLink>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px', height: '40px', background: 'var(--bg-dark)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', border: '1px solid var(--glass-border)'
                            }}>
                                {user?.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.username}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-muted"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                borderRadius: '12px', width: '100%', background: 'transparent',
                                border: 'none', color: 'var(--text-muted)', textAlign: 'left'
                            }}
                        >
                            <LogOut size={20} />
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </nav>
            </aside>

            <main style={{ overflowY: 'auto' }}>
                <div className="main-content">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
