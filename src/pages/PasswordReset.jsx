import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
    IoArrowBackOutline
} from 'react-icons/io5';
import mascot from '../assets/fox_logo_sharp.svg';

// Inject distinctive fonts
if (!document.querySelector('#reset-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'reset-fonts';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700;800;900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}

export default function PasswordReset() {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage('Check your inbox for further instructions.');
        } catch (err) {
            setError('Failed to reset password. ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    // Styles
    const pageBg = {
        minHeight: '100vh',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isDesktop ? 'center' : 'flex-start',
        padding: isDesktop ? '2rem' : '0'
    };

    const cardStyle = {
        width: '100%',
        maxWidth: isDesktop ? '1000px' : 'none',
        backgroundColor: '#0F0F0F',
        borderRadius: isDesktop ? '24px' : '0',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: isDesktop ? '0 40px 100px -20px rgba(0, 0, 0, 0.5)' : 'none',
        border: isDesktop ? '1px solid #2A2A2A' : 'none',
        flexDirection: isDesktop ? 'row' : 'column',
        minHeight: isDesktop ? '700px' : '100vh'
    };

    return (
        <div style={pageBg}>
            {/* Mobile Editorial Header */}
            {!isDesktop && (
                <div style={{
                    width: '100%',
                    padding: '3rem 2rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                    background: '#050505',
                    color: '#F5E6D3'
                }}>
                    <Link to="/login" style={{
                        position: 'absolute',
                        left: '1.5rem',
                        top: '1.5rem',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <IoArrowBackOutline size={20} color="#F5E6D3" />
                    </Link>
                    <div className="animate-float" style={{
                        width: '80px',
                        height: '80px',
                        filter: 'drop-shadow(0 15px 30px rgba(255,107,74,0.3))'
                    }}>
                        <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                </div>
            )}

            <div style={cardStyle}>

                {/* Left Section: Form */}
                <div style={{
                    flex: 1,
                    padding: isDesktop ? '5rem 6rem' : '2rem 2rem 4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>

                        {isDesktop && (
                            <Link to="/login" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'rgba(245,230,211,0.5)',
                                fontWeight: '700',
                                marginBottom: '2.5rem',
                                fontSize: '0.9rem'
                            }}>
                                <IoArrowBackOutline size={18} /> Back to Login
                            </Link>
                        )}

                        <div style={{ textAlign: isDesktop ? 'left' : 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#F5E6D3', marginBottom: '0.5rem', fontFamily: "'DM Serif Display', serif" }}>Reset Password</h2>
                            <p style={{ color: 'rgba(245,230,211,0.6)', fontWeight: '500', fontSize: '1.1rem' }}>We'll send you a link to your email.</p>
                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: 'rgba(255,107,107,0.15)',
                                color: '#FF6B6B',
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textAlign: 'center',
                                border: '1px solid rgba(255,107,107,0.3)'
                            }}>{error}</div>
                        )}

                        {message && (
                            <div style={{
                                backgroundColor: 'rgba(78, 205, 196, 0.15)',
                                color: '#4ECDC4',
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textAlign: 'center',
                                border: '1px solid rgba(78, 205, 196, 0.3)'
                            }}>{message}</div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#F5E6D3', fontSize: '0.95rem' }}>Email Address</label>
                                <input
                                    type="email"
                                    ref={emailRef}
                                    placeholder="student@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#050505',
                                        border: '1px solid #333',
                                        padding: '1.1rem',
                                        borderRadius: '14px',
                                        color: '#FFFFFF',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        fontWeight: '500'
                                    }}
                                />
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '1.15rem',
                                    fontSize: '1rem',
                                    marginTop: '1.5rem',
                                    background: 'linear-gradient(135deg, #FF6B4A 0%, #FF8266 100%)',
                                    color: '#0A0A0A',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px -6px rgba(255, 107, 74, 0.4)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {loading ? 'Sending link...' : 'Send Reset Link'}
                            </button>
                        </form>

                        {!isDesktop && (
                            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'rgba(245,230,211,0.6)', fontSize: '1rem', fontWeight: '500' }}>
                                <Link to="/login" style={{ color: '#FF6B4A', fontWeight: '700' }}>Remember your password? Login</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Branding (Desktop Only) */}
                {isDesktop && (
                    <div style={{
                        flex: 1.1,
                        background: '#141414',
                        padding: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: '#F5E6D3',
                        position: 'relative',
                        overflow: 'hidden',
                        fontFamily: "'Outfit', sans-serif"
                    }}>
                        {/* Grid Background */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }} />

                        {/* Gradient Orbs */}
                        <div style={{
                            position: 'absolute',
                            top: '-20%',
                            right: '-10%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(255, 107, 74, 0.1) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <div className="animate-float" style={{
                                width: '120px',
                                height: '120px',
                                margin: '0 auto 2.5rem auto',
                                filter: 'drop-shadow(0 20px 40px rgba(255,107,74,0.3))'
                            }}>
                                <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '2rem', letterSpacing: '-1px' }}>
                                Get back on track <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: '400', color: '#FFB74D' }}>quickly.</span>
                            </h2>
                            <p style={{ fontSize: '1.05rem', fontWeight: '400', color: 'rgba(245,230,211,0.6)', maxWidth: '320px', margin: '0 auto', lineHeight: 1.6 }}>
                                Resetting your password is just one click away. We've got you covered.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
