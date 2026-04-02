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
    IoStarOutline
} from 'react-icons/io5';
import mascot from '../assets/mascot_white.png';

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
            backgroundColor: 'white',
            borderRight: '1px solid var(--border)',
            padding: '3rem 1.5rem 3rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', padding: '0.75rem 0' }}>
                <div className="logo-badge" style={{ '--logo-size': '96px', border: 'none', boxShadow: 'none', background: 'white' }}>
                    <img src={mascot} alt="StudyNext" />
                </div>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>StudyNext</span>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <NavItem to="/" icon={<IoHomeOutline size={22} />} label="Dashboard" active={isActive('/')} />
                <NavItem to="/calendar" icon={<IoCalendarOutline size={22} />} label="Calendar" active={isActive('/calendar')} />
                <NavItem to="/list" icon={<IoListOutline size={22} />} label="Tasks" active={isActive('/list')} />
                <NavItem to="/settings" icon={<IoSettingsOutline size={22} />} label="Settings" active={isActive('/settings')} />
            </nav>

            {!isPremium && (
                <Link to="/premium" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px -4px rgba(245, 158, 11, 0.4)',
                        border: 'none',
                        transition: 'all 0.2s'
                    }}>
                        <div style={{ fontWeight: '800', color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <IoStarOutline size={18} /> Upgrade to Pro
                        </div>
                    </div>
                </Link>
            )}

            <button onClick={logout} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem', borderRadius: '12px', border: 'none', background: 'none',
                color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '700', fontSize: '1.1rem'
            }}>
                <IoLogOutOutline size={24} /> Log Out
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
            padding: '0.875rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: active ? '#f1f5f9' : 'transparent',
            color: active ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: active ? '700' : '500',
            fontSize: '1rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            border: 'none',
            boxShadow: 'none'
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
            backgroundColor: 'white',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '0 1rem',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 100
        }}>
            <BottomNavItem to="/" icon={<IoHomeOutline size={24} />} label="Home" active={isActive('/')} />
            <BottomNavItem to="/calendar" icon={<IoCalendarOutline size={24} />} label="Events" active={isActive('/calendar')} />
            <Link to="/add"
                className="btn-glow"
                style={{
                    marginTop: '-1.5rem',
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px -6px rgba(139, 92, 246, 0.5)',
                    border: 'none'
                }}>
                <IoAdd size={32} />
            </Link>
            <BottomNavItem to="/list" icon={<IoListOutline size={24} />} label="Tasks" active={isActive('/list')} />
            <BottomNavItem to="/settings" icon={<IoSettingsOutline size={24} />} label="Settings" active={isActive('/settings')} />
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
            textDecoration: 'none'
        }}>
            {icon}
            <span style={{ fontSize: '0.7rem', fontWeight: active ? '700' : '500' }}>{label}</span>
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
                marginLeft: 'var(--sidebar-width)',
                paddingBottom: isMobile ? 'var(--header-height)' : 0,
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden'
            }}>
                <header style={{
                    height: 'var(--header-height)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 var(--container-padding)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90,
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(10px)'
                }}>

                    {isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="logo-badge" style={{ '--logo-size': '96px', background: 'white', border: 'none', boxShadow: 'none' }}>
                                <img src={mascot} alt="StudyNext" />
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px' }}>StudyNext</span>
                        </div>
                    )}
                    <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', marginLeft: isMobile ? '0' : 'auto' }}>
                        <div style={{ textAlign: 'right', display: isMobile ? 'none' : 'block' }}>
                            <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {userProfile?.displayName || 'Student'}
                                {isPremium && <span style={{ background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem' }}>PRO</span>}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
                        </div>
                        <div style={{
                            width: 'var(--avatar-size)',
                            height: 'var(--avatar-size)',
                            borderRadius: '16px',
                            backgroundColor: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isPremium ? '2px solid #f59e0b' : '2px solid white',
                            boxShadow: 'var(--shadow-sm)',
                            overflow: 'hidden'
                        }}>
                            {userProfile?.photoURL ?
                                <img src={userProfile.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                <IoHappyOutline size={isMobile ? 28 : 36} color="var(--primary)" />
                            }
                        </div>
                    </Link>
                </header>

                <div style={{ padding: 'var(--container-padding)' }}>
                    <Outlet />
                </div>
            </main>

            {isMobile && <BottomNav />}
        </div>
    );
}
