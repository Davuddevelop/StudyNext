import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { Link, useNavigate } from 'react-router-dom';
import * as Io from 'react-icons/io5';
import mascot from '../assets/fox_logo_sharp.svg';
import useSEO from '../hooks/useSEO';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, loginWithGoogle, isFirebaseAvailable } = useAuth();

    useSEO({
        title: 'Sign In',
        description: 'Access your StudyNext dashboard. The most efficient homework planner and school organizer in Baku.',
        keywords: 'login, studynext, student portal, homework access'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
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
            await login(emailRef.current.value.trim().toLowerCase(), passwordRef.current.value);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('Identity not recognized in our database.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Credential mismatch. Please verify your passcode.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Invalid credentials. Check your input.');
            } else {
                setError('Authentication failed: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            const user = await loginWithGoogle();
            const profile = await userService.getProfile(user);

            if (!profile?.onboarding) {
                // Redirect to signup to complete onboarding
                navigate('/signup');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Detailed Google Login Error:", err);
            setError('Cloud sync failed: ' + err.message);
        }
    }

    const pageBg = {
        minHeight: '100vh',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isDesktop ? 'center' : 'flex-start',
        fontFamily: "'Outfit', sans-serif"
    };

    const cardStyle = {
        width: '100%',
        maxWidth: isDesktop ? '1100px' : 'none',
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        borderRadius: isDesktop ? '32px' : '0',
        overflow: 'hidden',
        minHeight: isDesktop ? '720px' : '100vh',
        position: 'relative',
        backgroundColor: isDesktop ? '#0F0F0F' : 'transparent',
        border: isDesktop ? '1px solid #1A1A1A' : 'none'
    };

    return (
        <div style={pageBg} className={!isDesktop ? "mesh-gradient-premium" : ""}>
            {!isDesktop && <div className="grain-overlay" />}

            {/* Mobile Header */}
            {!isDesktop && (
                <div style={{
                    width: '100%',
                    padding: '4rem 2rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    position: 'relative',
                    zIndex: 20
                }}>
                    <div className="animate-fade-up animate-delay-1 animate-float" style={{
                        width: '70px', height: '70px', filter: 'drop-shadow(0 0 30px rgba(255,107,74,0.3))'
                    }}>
                        <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        color: isFirebaseAvailable ? '#4ade80' : '#FF6B4A',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isFirebaseAvailable ? '#4ade80' : '#FF6B4A' }} />
                        {isFirebaseAvailable ? 'CLOUD SERVICES ACTIVE' : 'LOCAL MODE ONLY'}
                    </div>
                </div>
            )}

            {/* Main Auth Card */}
            <div style={cardStyle} className={!isDesktop ? "glass-panel" : ""}>

                {/* Left Section: Login Form */}
                <div style={{
                    flex: isDesktop ? 1 : 'none',
                    padding: isDesktop ? '4rem 5rem' : '1rem 2rem 4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                        <div className="animate-fade-up" style={{ textAlign: isDesktop ? 'left' : 'center', marginBottom: '3rem', animationDelay: '0.2s' }}>
                            <p style={{
                                fontSize: '0.75rem',
                                fontWeight: '800',
                                color: '#FF6B4A',
                                letterSpacing: '3px',
                                textTransform: 'uppercase',
                                marginBottom: '1rem'
                            }}>Access Portal</p>
                            <h2 style={{
                                fontSize: '3rem',
                                fontWeight: '900',
                                color: '#F5E6D3',
                                marginBottom: '0.75rem',
                                fontFamily: "'DM Serif Display', serif",
                                fontStyle: 'italic',
                                lineHeight: 1.1
                            }}>Welcome Back</h2>
                            <p style={{ color: 'rgba(245,230,211,0.4)', fontWeight: '500', fontSize: '1.1rem' }}>Enter your credentials to sync.</p>
                        </div>

                        {error && (
                            <div className="animate-fade-up" style={{
                                backgroundColor: 'rgba(255,107,107,0.08)',
                                color: '#FF6B6B',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                marginBottom: '2rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                border: '1px solid rgba(255,107,107,0.15)',
                                backdropFilter: 'blur(10px)'
                            }}>{error}</div>
                        )}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    fontWeight: '800',
                                    color: 'rgba(245,230,211,0.7)',
                                    fontSize: '0.7rem',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}>User Identification</label>
                                <input
                                    type="email"
                                    ref={emailRef}
                                    placeholder="email@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#E8F1FF',
                                        border: 'none',
                                        borderRadius: '18px',
                                        padding: '1.25rem',
                                        color: '#000000',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        outline: 'none',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                />
                            </div>

                            <div className="animate-fade-up" style={{ position: 'relative', animationDelay: '0.4s' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    fontWeight: '800',
                                    color: 'rgba(245,230,211,0.7)',
                                    fontSize: '0.7rem',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}>Security Passcode</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    ref={passwordRef}
                                    placeholder="******"
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#E8F1FF',
                                        border: 'none',
                                        borderRadius: '18px',
                                        padding: '1.25rem',
                                        color: '#000000',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        outline: 'none',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1.25rem',
                                        top: '3.1rem',
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {showPassword ? <Io.IoEyeOffOutline size={22} /> : <Io.IoEyeOutline size={22} />}
                                </button>
                            </div>

                            <div className="animate-fade-up" style={{ textAlign: isDesktop ? 'left' : 'center', marginTop: '-0.5rem', animationDelay: '0.5s' }}>
                                <Link to="/forgot-password" style={{ color: '#FF6B4A', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Forgot password?</Link>
                            </div>

                            <button
                                disabled={loading}
                                className="animate-fade-up"
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    background: 'linear-gradient(135deg, #FF6B4A 0%, #FF8266 100%)',
                                    border: 'none',
                                    borderRadius: '18px',
                                    color: '#0A0A0A',
                                    fontWeight: '950',
                                    fontSize: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    cursor: 'pointer',
                                    boxShadow: '0 15px 35px -10px rgba(255, 107, 74, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    animationDelay: '0.6s'
                                }}
                            >
                                <Io.IoSparkles size={18} />
                                {loading ? 'ACCESSING...' : 'Identify Yourself'}
                            </button>
                        </form>

                        <div className="animate-fade-up" style={{
                            marginTop: '2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            color: 'rgba(245,230,211,0.25)',
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            animationDelay: '0.7s'
                        }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                            SOCIAL SYNC
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                        </div>

                        <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', marginBottom: '3rem', animationDelay: '0.8s' }}>
                            <SocialButton onClick={handleGoogleLogin} icon={<Io.IoLogoGoogle size={22} color="#F5E6D3" />} />
                            <SocialButton onClick={() => { }} icon={<Io.IoLogoApple size={22} color="#F5E6D3" />} />
                        </div>

                        <div className="animate-fade-up" style={{ textAlign: 'center', color: 'rgba(245,230,211,0.5)', fontSize: '1rem', fontWeight: '500', animationDelay: '0.8s' }}>
                            No identity? <Link to="/signup" style={{ color: '#FF6B4A', fontWeight: '800' }}>Create One</Link>
                        </div>
                    </div>
                </div>

                {/* Right Section: Visual Panel */}
                {isDesktop && (
                    <div style={{
                        flex: 1.2,
                        background: '#0A0A0A',
                        padding: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: '#F5E6D3',
                        position: 'relative',
                        overflow: 'hidden',
                        borderLeft: '1px solid #1A1A1A'
                    }}>
                        {/* Grid Pattern */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `linear-gradient(rgba(255,107,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,74,0.03) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px',
                            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
                        }} />

                        {/* Right Section Header Badge */}
                        <div style={{
                            position: 'absolute',
                            top: '2.5rem',
                            right: '2.5rem',
                            zIndex: 100
                        }}>
                            <div className="animate-fade-up" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: isFirebaseAvailable
                                    ? 'rgba(34,197,94,0.1)'
                                    : 'rgba(255,107,74,0.1)',
                                border: `1px solid ${isFirebaseAvailable ? 'rgba(34,197,94,0.3)' : 'rgba(255,107,74,0.3)'}`,
                                padding: '6px 14px',
                                borderRadius: '100px',
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                letterSpacing: '1px',
                                color: isFirebaseAvailable ? '#4ade80' : '#FF6B4A',
                                backdropFilter: 'blur(4px)',
                                animationDelay: '0.1s'
                            }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: isFirebaseAvailable ? '#4ade80' : '#FF6B4A'
                                }} />
                                {isFirebaseAvailable ? 'LIVE · FIREBASE' : 'LOCAL · DEMO MODE'}
                            </div>
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div className="animate-fade-up animate-float" style={{
                                width: '130px', height: '130px', margin: '0 auto 3rem auto', filter: 'drop-shadow(0 20px 40px rgba(255,107,74,0.4))', animationDelay: '0.2s'
                            }}>
                                <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>

                            <p className="animate-fade-up" style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '5px', textTransform: 'uppercase', color: '#FF6B4A', marginBottom: '1.5rem', animationDelay: '0.3s' }}>
                                The Future of Workflow
                            </p>

                            <h2 className="animate-fade-up" style={{
                                fontSize: '3.6rem',
                                fontWeight: '900',
                                lineHeight: 1.05,
                                marginBottom: '2.5rem',
                                color: '#F5E6D3',
                                letterSpacing: '-2px',
                                animationDelay: '0.4s'
                            }}>
                                Your classes, tasks & exams <span style={{
                                    fontFamily: "'DM Serif Display', serif",
                                    fontStyle: 'italic',
                                    fontWeight: '400',
                                    color: '#FFB74D',
                                    fontSize: '3.8rem'
                                }}>unified.</span>
                            </h2>

                            <div className="animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', animationDelay: '0.5s' }}>
                                <FeatureChip label="Intelligent Tracking" />
                                <FeatureChip label="Syllabus Sync" />
                                <FeatureChip label="Study Sprints" />
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
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,107,74,0.15)';
                e.currentTarget.style.borderColor = 'rgba(255,107,74,0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {icon}
        </button>
    );
}

function FeatureChip({ label }) {
    return (
        <div style={{
            padding: '8px 18px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: 'rgba(245,230,211,0.6)'
        }}>
            {label}
        </div>
    );
}
