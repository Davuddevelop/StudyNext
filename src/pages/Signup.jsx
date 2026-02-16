import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { Link, useNavigate } from 'react-router-dom';
import * as Io from 'react-icons/io5';
import mascot from '../assets/fox_logo_sharp.svg';
import useSEO from '../hooks/useSEO';

export default function Signup() {
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup, loginWithGoogle, isFirebaseAvailable } = useAuth();

    useSEO({
        title: 'Create Account',
        description: 'Join StudyNext and evolve your study routine with the best AI homework planner for students in Azerbaijan.',
        keywords: 'signup, student registration, school organizer, Baku students'
    });

    // Onboarding State
    const [step, setStep] = useState(0); // 0: Account, 1: Goal, 2: Level, 3: Style
    const [onboardingData, setOnboardingData] = useState({
        goal: '',
        level: '',
        style: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
    const [tempUser, setTempUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Detect if user is already logged in (e.g. via Google from Login page) but needs onboarding
    const { currentUser } = useAuth();
    useEffect(() => {
        if (currentUser && step === 0 && !tempUser) {
            userService.getProfile(currentUser).then(profile => {
                if (!profile?.onboarding) {
                    setTempUser(currentUser);
                    setStep(1); // Start onboarding
                } else if (profile?.onboarding) {
                    navigate('/dashboard');
                }
            });
        }
    }, [currentUser, step, tempUser, navigate]);

    const handleNextStep = () => {
        setStep(prev => prev + 1);
        setError('');
    };

    async function handleAccountCreation(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        if (!agreedToTerms) {
            return setError('You must agree to the Terms and Conditions');
        }

        try {
            setError('');
            setLoading(true);
            const fullName = `${firstNameRef.current.value.trim()} ${lastNameRef.current.value.trim()}`;
            const user = await signup(emailRef.current.value.trim().toLowerCase(), passwordRef.current.value, fullName);
            setTempUser(user);
            handleNextStep();
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

    async function handleGoogleSignup() {
        if (!agreedToTerms) {
            return setError('You must agree to the Terms and Conditions before using Cloud Sync');
        }
        try {
            setError('');
            setLoading(true);
            const user = await loginWithGoogle();
            setTempUser(user);

            const profile = await userService.getProfile(user);
            if (profile?.onboarding) {
                navigate('/dashboard');
            } else {
                setStep(1); // Start onboarding
            }
        } catch (err) {
            console.error("Detailed Google Signup Error:", err);
            setError('Cloud sync failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleCompleteOnboarding(dataUpdates) {
        const finalData = { ...onboardingData, ...dataUpdates };
        try {
            setLoading(true);
            if (tempUser?.uid) {
                await userService.updateProfile(tempUser.uid, { onboarding: finalData });
            }
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to save onboarding:", err);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    }

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
        minHeight: isDesktop ? '750px' : '100vh'
    };

    return (
        <div style={pageBg} className={!isDesktop ? "mesh-gradient-premium" : ""}>
            {!isDesktop && <div className="grain-overlay" />}

            {/* Progress Bar */}
            {step > 0 && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255,107,74,0.05)',
                    zIndex: 1000
                }}>
                    <div style={{
                        width: `${(step / 3) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #FF6B4A, #FFB74D)',
                        transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                        boxShadow: '0 0 15px rgba(255,107,74,0.4)'
                    }} />
                </div>
            )}

            {/* Mobile Header (Step 0) */}
            {!isDesktop && step === 0 && (
                <div style={{
                    width: '100%',
                    padding: '5rem 2rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    position: 'relative',
                    zIndex: 20
                }}>
                    <Link to="/login" className="animate-fade-up" style={{
                        position: 'absolute',
                        left: '1.5rem',
                        top: '1.5rem',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        padding: '0.75rem',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Io.IoArrowBackOutline size={20} color="#F5E6D3" />
                    </Link>
                    <div className="animate-fade-up animate-delay-1 animate-float" style={{
                        width: '80px', height: '80px', filter: 'drop-shadow(0 20px 40px rgba(255,107,74,0.4))'
                    }}>
                        <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                </div>
            )}

            <div style={cardStyle} className={!isDesktop ? "glass-panel" : ""}>
                <div style={{
                    flex: 1,
                    padding: isDesktop ? '4rem 5rem' : '3rem 1.5rem 5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 20
                }}>
                    <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
                        {step === 0 && (
                            <>
                                {isDesktop && (
                                    <Link to="/login" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: 'rgba(245,230,211,0.5)',
                                        fontWeight: '600',
                                        marginBottom: '2rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        <Io.IoArrowBackOutline size={18} /> Back to Login
                                    </Link>
                                )}
                                <div className="animate-fade-up" style={{ textAlign: isDesktop ? 'left' : 'center', marginBottom: '2.5rem', animationDelay: '0.2s' }}>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#F5E6D3', marginBottom: '0.5rem', fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>Create Account</h2>
                                    <p style={{ color: 'rgba(245,230,211,0.4)', fontWeight: '500', fontSize: '1.1rem' }}>Begin your academic evolution.</p>
                                </div>
                                {error && (
                                    <div className="animate-fade-up" style={{
                                        backgroundColor: 'rgba(255,107,107,0.1)',
                                        color: '#FF6B6B',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        marginBottom: '1.5rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        border: '1px solid rgba(255,107,107,0.2)'
                                    }}>{error}</div>
                                )}
                                <form onSubmit={handleAccountCreation} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', animationDelay: '0.3s' }}>
                                        <input type="text" ref={firstNameRef} placeholder="First" required className="auth-input-premium" />
                                        <input type="text" ref={lastNameRef} placeholder="Last" required className="auth-input-premium" />
                                    </div>
                                    <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
                                        <input type="email" ref={emailRef} placeholder="Email" required className="auth-input-premium" />
                                    </div>
                                    <div className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
                                        <input type="password" ref={passwordRef} placeholder="Password" required className="auth-input-premium" />
                                    </div>
                                    <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
                                        <input type="password" ref={passwordConfirmRef} placeholder="Confirm Password" required className="auth-input-premium" />
                                    </div>
                                    <div className="animate-fade-up" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginTop: '0.5rem',
                                        animationDelay: '0.65s',
                                        cursor: 'pointer',
                                        userSelect: 'none'
                                    }} onClick={() => setAgreedToTerms(!agreedToTerms)}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '6px',
                                            border: `2px solid ${agreedToTerms ? '#FF6B4A' : 'rgba(255,255,255,0.1)'}`,
                                            backgroundColor: agreedToTerms ? '#FF6B4A' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
                                        }}>
                                            {agreedToTerms && <Io.IoCheckmarkSharp size={14} color="#0A0A0A" strokeWidth={4} />}
                                        </div>
                                        <span style={{ color: 'rgba(245,230,211,0.6)', fontSize: '0.85rem', fontWeight: '500' }}>
                                            I agree to the <Link to="/terms" target="_blank" style={{ color: '#FF6B4A', fontWeight: '700', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>Terms and Conditions</Link>
                                        </span>
                                    </div>
                                    <button disabled={loading || !agreedToTerms} type="submit" className="animate-fade-up" style={{
                                        marginTop: '1rem',
                                        width: '100%',
                                        padding: '1.25rem',
                                        background: agreedToTerms
                                            ? 'linear-gradient(135deg, #FF6B4A 0%, #FF8266 100%)'
                                            : 'rgba(255,107,74,0.1)',
                                        border: 'none',
                                        borderRadius: '16px',
                                        color: agreedToTerms ? '#0A0A0A' : 'rgba(245,230,211,0.2)',
                                        fontWeight: '800',
                                        fontSize: '1.1rem',
                                        boxShadow: agreedToTerms ? '0 15px 35px -10px rgba(255, 107, 74, 0.5)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        animationDelay: '0.7s',
                                        cursor: agreedToTerms ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {loading ? 'Initializing...' : 'Continue to Onboarding'}
                                        <Io.IoArrowForwardOutline size={18} />
                                    </button>
                                </form>
                                <div className="animate-fade-up" style={{ textAlign: 'center', marginTop: '2.5rem', color: 'rgba(245,230,211,0.5)', fontSize: '1rem', fontWeight: '500', animationDelay: '0.8s' }}>
                                    Acknowledged already? <Link to="/login" style={{ color: '#FF6B4A', fontWeight: '800' }}>Login</Link>
                                </div>

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
                                    animationDelay: '0.8s'
                                }}>
                                    <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                                    SOCIAL SYNC
                                    <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                                </div>

                                <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', marginBottom: '1rem', animationDelay: '0.9s' }}>
                                    <SocialButton onClick={handleGoogleSignup} icon={<Io.IoLogoGoogle size={22} color="#F5E6D3" />} />
                                    <SocialButton onClick={() => { }} icon={<Io.IoLogoApple size={22} color="#F5E6D3" />} />
                                </div>
                            </>
                        )}

                        {step === 1 && (
                            <OnboardingStep
                                title="The Alpha"
                                question="What's your primary struggle?"
                                options={[
                                    { id: 'forget', label: 'I forget homework', icon: <Io.IoListOutline /> },
                                    { id: 'late', label: 'I start too late', icon: <Io.IoAlarmOutline /> },
                                    { id: 'overwhelmed', label: 'I feel overwhelmed', icon: <Io.IoChatbubbleOutline /> },
                                    { id: 'grades', label: 'I want better grades', icon: <Io.IoStatsChartOutline /> },
                                    { id: 'routine', label: 'I want a better routine', icon: <Io.IoCalendarOutline /> }
                                ]}
                                onSelect={(id) => {
                                    setOnboardingData(prev => ({ ...prev, goal: id }));
                                    handleNextStep();
                                }}
                            />
                        )}

                        {step === 2 && (
                            <OnboardingStep
                                title="The Level"
                                question="What grade defines you?"
                                options={[
                                    { id: 'middle', label: 'Middle School', icon: <Io.IoRocketOutline /> },
                                    { id: 'high', label: 'High School', icon: <Io.IoSchoolOutline /> },
                                    { id: 'uni', label: 'University / College', icon: <Io.IoSchoolOutline /> },
                                    { id: 'other', label: 'Other', icon: <Io.IoListOutline /> }
                                ]}
                                onSelect={(id) => {
                                    setOnboardingData(prev => ({ ...prev, level: id }));
                                    handleNextStep();
                                }}
                            />
                        )}

                        {step === 3 && (
                            <OnboardingStep
                                title="The Rhythm"
                                question="When is your peak flow?"
                                options={[
                                    { id: 'morning', label: 'Morning Owl', icon: <Io.IoSunnyOutline /> },
                                    { id: 'afternoon', label: 'Afternoon Grind', icon: <Io.IoTimeOutline /> },
                                    { id: 'night', label: 'Night Wanderer', icon: <Io.IoMoonOutline /> },
                                    { id: 'random', label: 'Whenever', icon: <Io.IoShuffleOutline /> }
                                ]}
                                onSelect={(id) => handleCompleteOnboarding({ style: id })}
                            />
                        )}
                    </div>
                </div>

                {isDesktop && (
                    <div style={{
                        flex: 1,
                        background: '#141414',
                        padding: '3.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: '#F5E6D3',
                        position: 'relative',
                        overflow: 'hidden',
                        fontFamily: "'Outfit', sans-serif"
                    }}>
                        {/* Patterns */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `linear-gradient(rgba(255,107,74,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,74,0.02) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div className="animate-float" style={{
                                width: '120px', height: '120px', margin: '0 auto 2.5rem auto', filter: 'drop-shadow(0 20px 40px rgba(255,107,74,0.3))'
                            }}>
                                <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#FF6B4A', marginBottom: '1rem' }}>
                                {step === 0 ? 'Join the community' : `Step ${step} of 3`}
                            </p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '1.5rem', color: '#F5E6D3', letterSpacing: '-1px' }}>
                                Master your <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: '400', color: '#FFB74D' }}>syllabus.</span><br />
                                Sync your <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: '400', color: '#FFB74D' }}>schedule.</span>
                            </h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function OnboardingStep({ title, question, options, onSelect }) {
    return (
        <div className="animate-fade-up">
            <div style={{ marginBottom: '2.5rem' }}>
                <p className="animate-fade-up" style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', color: '#FF6B4A', marginBottom: '0.75rem', animationDelay: '0.1s' }}>{title}</p>
                <h2 className="animate-fade-up" style={{ fontSize: '3rem', fontWeight: '900', color: '#F5E6D3', fontFamily: "'DM Serif Display', serif", lineHeight: 1.1, fontStyle: 'italic', animationDelay: '0.2s' }}>{question}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {options.map((opt, idx) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        className="onboarding-option animate-fade-up"
                        style={{ animationDelay: `${(idx + 3) * 0.1}s` }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'rgba(255,107,74,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FF6B4A',
                            fontSize: '1.6rem',
                            border: '1px solid rgba(255,107,74,0.2)'
                        }}>
                            {opt.icon}
                        </div>
                        <span style={{ fontWeight: '700', fontSize: '1.15rem', letterSpacing: '0.5px' }}>{opt.label}</span>
                    </button>
                ))}
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
