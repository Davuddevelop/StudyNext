import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    IoLogoGoogle,
    IoLogoApple,
    IoEyeOutline,
    IoEyeOffOutline,
    IoSparkles
} from 'react-icons/io5';
import mascot from '../assets/mascot_white.png';

// Inject distinctive fonts - DM Serif Display (elegant serif) + Outfit (modern geometric sans)
if (!document.querySelector('#login-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'login-fonts';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700;800;900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}

// Inject keyframe animations
if (!document.querySelector('#login-animations')) {
    const style = document.createElement('style');
    style.id = 'login-animations';
    style.textContent = `
        @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes gridPulse {
            0%, 100% { opacity: 0.03; }
            50% { opacity: 0.08; }
        }
        .animate-fade-up { animation: fadeSlideUp 0.8s ease-out forwards; opacity: 0; }
        .animate-delay-1 { animation-delay: 0.1s; }
        .animate-delay-2 { animation-delay: 0.25s; }
        .animate-delay-3 { animation-delay: 0.4s; }
        .animate-delay-4 { animation-delay: 0.55s; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .shimmer-text {
            background: linear-gradient(90deg, #F5E6D3 0%, #FF6B4A 50%, #F5E6D3 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s linear infinite;
        }
    `;
    document.head.appendChild(style);
}

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
        maxWidth: isDesktop ? '900px' : 'none',
        backgroundColor: 'white',
        borderRadius: isDesktop ? '32px' : '32px 32px 0 0',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: isDesktop ? '0 40px 100px -20px rgba(139, 92, 246, 0.15)' : 'none',
        flexDirection: isDesktop ? 'row' : 'column',
        minHeight: isDesktop ? '650px' : 'calc(100vh - 180px)',
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

                {/* Right Section: Editorial Dark Theme with Warm Accents */}
                {isDesktop && (
                    <div style={{
                        flex: 1.1,
                        background: '#0F0F0F',
                        padding: '3.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: '#F5E6D3',
                        position: 'relative',
                        overflow: 'hidden',
                        fontFamily: "'Outfit', sans-serif"
                    }}>
                        {/* Geometric grid pattern background */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `
                                linear-gradient(rgba(255,107,74,0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,107,74,0.03) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                            animation: 'gridPulse 4s ease-in-out infinite'
                        }} />

                        {/* Warm gradient orb */}
                        <div style={{
                            position: 'absolute',
                            top: '-20%',
                            right: '-20%',
                            width: '500px',
                            height: '500px',
                            background: 'radial-gradient(circle, rgba(255,107,74,0.15) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        {/* Bottom accent gradient */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-30%',
                            left: '-10%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(255,183,77,0.1) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Status badge */}
                            <div className="animate-fade-up animate-delay-1" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: isFirebaseAvailable
                                    ? 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)'
                                    : 'linear-gradient(135deg, rgba(255,107,74,0.15) 0%, rgba(255,107,74,0.05) 100%)',
                                border: `1px solid ${isFirebaseAvailable ? 'rgba(34,197,94,0.3)' : 'rgba(255,107,74,0.3)'}`,
                                padding: '8px 16px',
                                borderRadius: '100px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                letterSpacing: '0.5px',
                                marginBottom: '2.5rem',
                                color: isFirebaseAvailable ? '#4ade80' : '#FF6B4A'
                            }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: isFirebaseAvailable ? '#4ade80' : '#FF6B4A',
                                    boxShadow: `0 0 10px ${isFirebaseAvailable ? '#4ade80' : '#FF6B4A'}`
                                }} />
                                {isFirebaseAvailable ? 'LIVE · FIREBASE' : 'LOCAL · DEMO MODE'}
                            </div>

                            {/* Mascot with float animation */}
                            <div className="animate-fade-up animate-delay-2 animate-float" style={{
                                width: '120px',
                                height: '120px',
                                marginBottom: '2rem',
                                filter: 'drop-shadow(0 20px 40px rgba(255,107,74,0.3))'
                            }}>
                                <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>

                            {/* Eyebrow text */}
                            <p className="animate-fade-up animate-delay-2" style={{
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: '#FF6B4A',
                                marginBottom: '1rem'
                            }}>
                                Built for students
                            </p>

                            {/* Main headline - editorial style with mixed fonts */}
                            <h2 className="animate-fade-up animate-delay-3" style={{
                                fontSize: '2.8rem',
                                fontWeight: '800',
                                lineHeight: 1.1,
                                marginBottom: '1.5rem',
                                letterSpacing: '-1px'
                            }}>
                                <span style={{ color: '#F5E6D3' }}>Your</span>{' '}
                                <span style={{
                                    fontFamily: "'DM Serif Display', serif",
                                    fontStyle: 'italic',
                                    fontWeight: '400',
                                    color: '#FFB74D'
                                }}>classes,</span><br/>
                                <span style={{ color: '#F5E6D3' }}>tasks &</span>{' '}
                                <span style={{
                                    fontFamily: "'DM Serif Display', serif",
                                    fontStyle: 'italic',
                                    fontWeight: '400',
                                    color: '#FFB74D'
                                }}>exams</span><br/>
                                <span className="shimmer-text" style={{
                                    fontSize: '3.2rem',
                                    fontWeight: '900'
                                }}>unified.</span>
                            </h2>

                            {/* Subtext */}
                            <p className="animate-fade-up animate-delay-4" style={{
                                fontSize: '1.05rem',
                                fontWeight: '400',
                                color: 'rgba(245,230,211,0.6)',
                                lineHeight: 1.6,
                                maxWidth: '320px'
                            }}>
                                Stop juggling apps. One space for everything academic.
                            </p>

                            {/* Feature pills */}
                            <div className="animate-fade-up animate-delay-4" style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '2rem',
                                flexWrap: 'wrap'
                            }}>
                                {['Smart scheduling', 'Exam prep', 'Progress tracking'].map((feature, i) => (
                                    <span key={i} style={{
                                        padding: '8px 14px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        color: 'rgba(245,230,211,0.7)'
                                    }}>
                                        {feature}
                                    </span>
                                ))}
                            </div>
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
