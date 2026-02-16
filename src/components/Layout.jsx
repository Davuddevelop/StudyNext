import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    IoHomeOutline,
    IoCalendarOutline,
    IoListOutline,
    IoSettingsOutline,
    IoAdd,
    IoLogOutOutline,
    IoHappyOutline,
    IoSparkles
} from 'react-icons/io5';
// Previous logo: mascot_white.png
import mascot from '../assets/fox_logo_sharp.svg';

function Sidebar() {
    const { pathname } = useLocation();
    const { logout, isPremium } = useAuth();
    const isActive = (path) => pathname === path;

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'var(--bg-elevated)',
            borderRight: '1px solid var(--border)',
            padding: '2rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0.5rem' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <img src={mascot} alt="StudyNext" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                </div>
                <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.3px' }}>StudyNext</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>Student Planner</div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <NavItem to="/dashboard" icon={<IoHomeOutline size={20} />} label="Dashboard" active={isActive('/dashboard')} />
                <NavItem to="/calendar" icon={<IoCalendarOutline size={20} />} label="Calendar" active={isActive('/calendar')} />
                <NavItem to="/list" icon={<IoListOutline size={20} />} label="Tasks" active={isActive('/list')} />
                <NavItem to="/settings" icon={<IoSettingsOutline size={20} />} label="Settings" active={isActive('/settings')} />
            </nav>

            {/* Upgrade Card */}
            {!isPremium && (
                <Link to="/premium" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        padding: '1.25rem',
                        borderRadius: '14px',
                        marginBottom: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '150px',
                            height: '150px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />
                        <div style={{
                            fontWeight: '700',
                            color: '#0F0F0F',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <IoSparkles size={18} /> Upgrade to Pro
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(15,15,15,0.7)', marginTop: '0.5rem', position: 'relative', zIndex: 1 }}>
                            Unlock all features
                        </p>
                    </div>
                </Link>
            )}

            {/* Logout */}
            <button onClick={logout} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
            }}>
                <IoLogOutOutline size={20} /> Log Out
            </button>
        </aside>
    );
}

function NavItem({ to, icon, label, active }) {
    return (
        <Link to={to} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            backgroundColor: active ? 'var(--primary-muted)' : 'transparent',
            color: active ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: active ? '600' : '500',
            fontSize: '0.95rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            border: active ? '1px solid rgba(255, 107, 74, 0.2)' : '1px solid transparent'
        }}>
            {icon}
            {label}
        </Link>
    );
}

function BottomNav() {
    const { pathname } = useLocation();
    const isActive = (path) => pathname === path;

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'var(--header-height)',
            backgroundColor: 'var(--bg-elevated)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 0.5rem',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 100,
            backdropFilter: 'blur(20px)'
        }}>
            <BottomNavItem to="/dashboard" icon={<IoHomeOutline size={22} />} label="Home" active={isActive('/dashboard')} />
            <BottomNavItem to="/calendar" icon={<IoCalendarOutline size={22} />} label="Events" active={isActive('/calendar')} />
            <Link to="/add"
                style={{
                    marginTop: '-1.75rem',
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #FF8266 100%)',
                    color: '#0F0F0F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px -6px rgba(255, 107, 74, 0.5)',
                    border: '3px solid var(--bg-elevated)'
                }}>
                <IoAdd size={28} />
            </Link>
            <BottomNavItem to="/list" icon={<IoListOutline size={22} />} label="Tasks" active={isActive('/list')} />
            <BottomNavItem to="/settings" icon={<IoSettingsOutline size={22} />} label="Settings" active={isActive('/settings')} />
        </nav>
    );
}

function BottomNavItem({ to, icon, label, active }) {
    return (
        <Link to={to} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: active ? 'var(--primary)' : 'var(--text-muted)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '10px',
            transition: 'all 0.2s'
        }}>
            {icon}
            <span style={{ fontSize: '0.65rem', fontWeight: active ? '600' : '500' }}>{label}</span>
        </Link>
    );
}

export default function Layout() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { currentUser, userProfile, isPremium } = useAuth();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex' }}>
            {!isMobile && <Sidebar />}

            <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
                paddingBottom: isMobile ? 'calc(var(--header-height) + 1rem)' : 0,
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden'
            }}>
                {/* Header */}
                <header style={{
                    height: 'var(--header-height)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 var(--container-padding)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90,
                    backgroundColor: 'rgba(10, 10, 10, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border)'
                }}>
                    {/* Mobile Logo */}
                    {isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                <img src={mascot} alt="StudyNext" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>StudyNext</span>
                        </div>
                    )}

                    {/* User Profile */}
                    <Link to="/settings" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        textDecoration: 'none',
                        marginLeft: isMobile ? '0' : 'auto',
                        padding: '0.5rem',
                        borderRadius: '12px',
                        transition: 'all 0.2s'
                    }}>
                        <div style={{ textAlign: 'right', display: isMobile ? 'none' : 'block' }}>
                            <div style={{
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                color: 'var(--text)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: '8px'
                            }}>
                                {userProfile?.displayName || 'Student'}
                                {isPremium && (
                                    <span style={{
                                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                        color: '#0F0F0F',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.65rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.5px'
                                    }}>PRO</span>
                                )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
                        </div>
                        <div style={{
                            width: isMobile ? '40px' : 'var(--avatar-size)',
                            height: isMobile ? '40px' : 'var(--avatar-size)',
                            borderRadius: '12px',
                            backgroundColor: 'var(--surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isPremium ? '2px solid var(--primary)' : '1px solid var(--border)',
                            overflow: 'hidden'
                        }}>
                            {userProfile?.photoURL ?
                                <img src={userProfile.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                <IoHappyOutline size={isMobile ? 22 : 32} color="var(--text-muted)" />
                            }
                        </div>
                    </Link>
                </header>

                {/* Page Content */}
                <div style={{ padding: 'var(--container-padding)' }}>
                    <Outlet />
                </div>
            </main>

            {isMobile && <BottomNav />}
        </div>
    );
}
