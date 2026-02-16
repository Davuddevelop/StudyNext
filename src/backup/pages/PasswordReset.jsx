import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
    IoArrowBackOutline
} from 'react-icons/io5';
import mascot from '../assets/mascot_white.png';

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
        background: isDesktop
            ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
            : 'var(--primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isDesktop ? 'center' : 'flex-start',
        padding: isDesktop ? '2rem' : '0'
    };

    const cardStyle = {
        width: '100%',
        maxWidth: isDesktop ? '1100px' : 'none',
        backgroundColor: 'white',
        borderRadius: isDesktop ? '32px' : '32px 32px 0 0',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: isDesktop ? '0 40px 100px -20px rgba(139, 92, 246, 0.15)' : 'none',
        flexDirection: isDesktop ? 'row' : 'column',
        minHeight: isDesktop ? '700px' : 'calc(100vh - 180px)',
        marginTop: isDesktop ? '0' : '180px'
    };

    return (
        <div style={pageBg}>
            {/* Mobile Header */}
            {!isDesktop && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    padding: '3rem 2rem 5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'white'
                }}>
                    <Link to="/login" style={{
                        position: 'absolute',
                        left: '2rem',
                        top: '2rem',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <IoArrowBackOutline size={20} color="white" />
                    </Link>
                    <div className="logo-badge" style={{ '--logo-size': '80px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,1)' }}>
                        <img src={mascot} alt="StudyNext" />
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px' }}>StudyNext</h1>
                </div>
            )}

            <div style={cardStyle}>

                {/* Left Section: Form */}
                <div style={{
                    flex: 1,
                    padding: isDesktop ? '5rem 6rem' : '3rem 2rem',
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
                                color: '#64748b',
                                fontWeight: '700',
                                marginBottom: '2.5rem',
                                fontSize: '0.9rem'
                            }}>
                                <IoArrowBackOutline size={18} /> Back to Login
                            </Link>
                        )}

                        <div style={{ textAlign: isDesktop ? 'left' : 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>Reset Password</h2>
                            <p style={{ color: '#64748b', fontWeight: '500', fontSize: '1.1rem' }}>We'll send you a link to your email.</p>
                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: '#fee2e2',
                                color: '#ef4444',
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>{error}</div>
                        )}

                        {message && (
                            <div style={{
                                backgroundColor: '#d1fae5',
                                color: '#065f46',
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>{message}</div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>Email Address</label>
                                <input
                                    type="email"
                                    ref={emailRef}
                                    className="input"
                                    placeholder="student@example.com"
                                    required
                                    style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem' }}
                                />
                            </div>

                            <button
                                disabled={loading}
                                className="btn-brand"
                                type="submit"
                                style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', marginTop: '1.5rem' }}
                            >
                                {loading ? 'Sending link...' : 'Send Reset Link'}
                            </button>
                        </form>

                        {!isDesktop && (
                            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
                                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Remember your password? Login</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Branding (Desktop Only) */}
                {isDesktop && (
                    <div style={{
                        flex: 1.1,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        padding: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className="logo-badge" style={{ '--logo-size': '100px', margin: '0 auto 2rem auto', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,1)' }}>
                                <img src={mascot} alt="StudyNext" />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1.2, marginBottom: '2rem' }}>
                                Get back on track quickly.
                            </h2>
                            <p style={{ fontSize: '1.2rem', fontWeight: '500', opacity: 0.9 }}>
                                Resetting your password is just one click away. We've got you covered.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
