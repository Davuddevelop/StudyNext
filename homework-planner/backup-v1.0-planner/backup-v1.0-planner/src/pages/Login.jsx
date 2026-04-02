import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    IoLogoGoogle,
    IoLogoApple,
    IoEyeOutline,
    IoEyeOffOutline
} from 'react-icons/io5';
import logo from '../assets/logo.png';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, loginWithGoogle, isFirebaseAvailable } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Invalid credentials. Check your email/password.');
            } else {
                setError('Failed to log in: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Google Sign In Failed. ' + err.message);
        }
    }

    // Styles
    const pageBg = {
        minHeight: '100vh',
        background: isDesktop
            ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' // Soft purple gradient for desktop
            : 'var(--primary)', // Solid brand purple for mobile header
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
        marginTop: isDesktop ? '0' : '180px' // Offset for mobile logo
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
                    gap: '1rem',
                    color: 'white'
                }}>
                    <div className="logo-badge" style={{ '--logo-size': '80px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                        <img src={logo} alt="TaskFlow" />
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px' }}>TaskFlow</h1>
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

                {/* Left Section: Login Form */}
                <div style={{
                    flex: 1,
                    padding: isDesktop ? '5rem 6rem' : '3rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                        <div style={{ textAlign: isDesktop ? 'left' : 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>Sign in</h2>
                            <p style={{ color: '#64748b', fontWeight: '500', fontSize: '1.1rem' }}>Built for busy students like you.</p>
                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: '#fee2e2',
                                color: '#ef4444',
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>{error}</div>
                        )}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>Email</label>
                                <input
                                    type="email"
                                    ref={emailRef}
                                    className="input"
                                    placeholder="Enter your email"
                                    required
                                    style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem' }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    ref={passwordRef}
                                    className="input"
                                    placeholder="Enter password"
                                    required
                                    style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '1.25rem', top: '3.1rem', background: 'none', border: 'none', color: '#94a3b8' }}
                                >
                                    {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                </button>
                            </div>

                            <div style={{ textAlign: isDesktop ? 'left' : 'center', marginTop: '-0.5rem' }}>
                                <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>Forgot password?</Link>
                            </div>

                            <button
                                disabled={loading}
                                className="btn-brand"
                                type="submit"
                                style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', marginTop: '1rem' }}
                            >
                                {loading ? 'Processing...' : 'Continue'}
                            </button>
                        </form>

                        <div style={{
                            marginTop: '2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            color: '#cbd5e1',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                        }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
                            or sign in with
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '1.5rem', marginBottom: '2.5rem' }}>
                            <SocialButton onClick={handleGoogleLogin} icon={<IoLogoGoogle size={24} color="#ea4335" />} />
                            <SocialButton onClick={() => { }} icon={<IoLogoApple size={24} color="black" />} />
                        </div>

                        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
                            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700' }}>Sign Up</Link>
                        </div>
                    </div>
                </div>

                {/* Right Section: Branding (Shown only on Desktop) */}
                {isDesktop && (
                    <div style={{
                        flex: 1.1,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        padding: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative background element */}
                        <div style={{
                            position: 'absolute',
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            opacity: 0.1,
                            pointerEvents: 'none',
                            width: '400px',
                            height: '400px'
                        }}>
                            <img src={logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '1rem' }}>
                            <div className="logo-badge" style={{ '--logo-size': '140px', margin: '0 auto 1.5rem auto', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                                <img src={logo} alt="TaskFlow" />
                            </div>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                marginBottom: '2.5rem',
                                color: isFirebaseAvailable ? '#4ade80' : '#f87171'
                            }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isFirebaseAvailable ? '#4ade80' : '#f87171' }}></div>
                                {isFirebaseAvailable ? 'Connected to Firebase' : 'Running in Local Mode'}
                            </div>

                            <p style={{ fontSize: '1.1rem', fontWeight: '600', opacity: 0.9, marginBottom: '1.5rem' }}>
                                Everything you need to stay on track.
                            </p>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                lineHeight: 1.25,
                                marginBottom: '2rem',
                                color: '#e0e7ff', // Light indigo (not white)
                                letterSpacing: '-0.5px'
                            }}>
                                Manage your classes, tasks, exams & more — <span style={{
                                    color: '#22d3ee', // Bright cyan (not orange)
                                    textShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
                                }}>all in one place.</span>
                            </h2>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function SocialButton({ icon, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#e2e8f0';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#f1f5f9';
            }}
        >
            {icon}
        </button>
    );
}
