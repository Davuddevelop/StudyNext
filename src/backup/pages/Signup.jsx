import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    IoArrowBackOutline
} from 'react-icons/io5';
import mascot from '../assets/mascot_white.png';

export default function Signup() {
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup, isFirebaseAvailable } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            const fullName = `${firstNameRef.current.value.trim()} ${lastNameRef.current.value.trim()}`;
            await signup(emailRef.current.value, passwordRef.current.value, fullName);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already in use. Try logging in.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Use at least 6 characters.');
            } else {
                setError('Account creation failed: ' + err.message);
            }
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
        minHeight: isDesktop ? '800px' : 'calc(100vh - 180px)',
        marginTop: isDesktop ? '0' : '180px'
    };

    return (
        <div style={pageBg}>
            {/* Mobile Header (Hidden on Desktop) */}
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
                    <div className="logo-badge" style={{ '--logo-size': '80px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                        <img src={mascot} alt="StudyNext" />
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px' }}>StudyNext</h1>
                    <div style={{
                        fontSize: '0.65rem',
                        fontWeight: '900',
                        color: isFirebaseAvailable ? '#4ade80' : '#f87171',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '0.25rem'
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isFirebaseAvailable ? '#4ade80' : '#f87171' }}></div>
                        {isFirebaseAvailable ? 'LIVE (FIREBASE)' : 'LOCAL (DEMO MODE)'}
                    </div>
                </div>
            )}

            {/* Main Auth Card */}
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
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>Create Account</h2>
                            <p style={{ color: '#64748b', fontWeight: '500', fontSize: '1.1rem' }}>Join thousands of productive students.</p>
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

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>First Name</label>
                                    <input
                                        type="text"
                                        ref={firstNameRef}
                                        className="input"
                                        placeholder="Davud"
                                        required
                                        style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>Last Name</label>
                                    <input
                                        type="text"
                                        ref={lastNameRef}
                                        className="input"
                                        placeholder="Surname"
                                        required
                                        style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem' }}
                                    />
                                </div>
                            </div>
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

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>Password</label>
                                <input
                                    type="password"
                                    ref={passwordRef}
                                    className="input"
                                    placeholder="At least 6 characters"
                                    required
                                    style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    ref={passwordConfirmRef}
                                    className="input"
                                    placeholder="Repeat your password"
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
                                {loading ? 'Creating account...' : 'Get Started'}
                            </button>
                        </form>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
                            By signing up, you agree to our <br />
                            <Link to="/terms" style={{ color: 'var(--primary)', fontWeight: '700' }}>Terms of Service</Link> & <Link to="/privacy" style={{ color: 'var(--primary)', fontWeight: '700' }}>Privacy Policy</Link>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Login</Link>
                        </div>
                    </div>
                </div>

                {/* Right Section: Branding (Desktop Only) */}
                {
                    isDesktop && (
                        <div style={{
                            flex: 1.1,
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            padding: '4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            color: 'white',
                            position: 'relative'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div className="logo-badge" style={{ '--logo-size': '100px', margin: '0 auto 2rem auto', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)' }}>
                                    <img src={mascot} alt="StudyNext" />
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1.2, marginBottom: '2rem' }}>
                                    Master your syllabus. Sync your schedule.
                                </h2>
                                <p style={{ fontSize: '1.2rem', fontWeight: '500', opacity: 0.9 }}>
                                    StudyNext helps students across the globe stay organized and achieve their goals.
                                </p>
                            </div>
                        </div>
                    )
                }

            </div >
        </div >
    );
}
