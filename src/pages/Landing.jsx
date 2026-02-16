import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as Io from 'react-icons/io5';
import mascot from '../assets/fox_logo_sharp.svg';
import useSEO from '../hooks/useSEO';

function FeatureCard({ icon, title, desc, delay }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="animate-fade-up"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '3rem 2rem',
                backgroundColor: isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: isHovered ? '1px solid rgba(255,107,74,0.2)' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '32px',
                textAlign: 'left',
                backdropFilter: 'blur(10px)',
                animationDelay: delay,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                cursor: 'default'
            }}>
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '18px',
                backgroundColor: isHovered ? 'rgba(255,107,74,0.15)' : 'rgba(255,107,74,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF6B4A',
                fontSize: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(255,107,74,0.2)',
                transition: 'all 0.3s ease'
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#F5E6D3', marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'rgba(245,230,211,0.65)', fontSize: '1rem', lineHeight: 1.6, fontWeight: '500' }}>{desc}</p>
        </div>
    );
}

function AudienceCard({ icon, title, desc }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="animate-fade-up"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '2.5rem 2rem',
                backgroundColor: isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: isHovered ? '1px solid rgba(255,183,77,0.2)' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                cursor: 'default'
            }}>
            <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: isHovered ? 'rgba(255,183,77,0.15)' : 'rgba(255,183,77,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFB74D',
                fontSize: '2rem',
                margin: '0 auto 1.5rem',
                border: '1px solid rgba(255,183,77,0.2)',
                transition: 'all 0.3s ease'
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#F5E6D3', marginBottom: '0.75rem' }}>{title}</h3>
            <p style={{ color: 'rgba(245,230,211,0.65)', fontSize: '0.95rem', lineHeight: 1.5, fontWeight: '500' }}>{desc}</p>
        </div>
    );
}

function DifferentiatorCard({ number, title, desc }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="animate-fade-up"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '2.5rem',
                backgroundColor: isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: isHovered ? '1px solid rgba(255,107,74,0.15)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                cursor: 'default'
            }}>
            <div style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: isHovered ? 'rgba(255,107,74,0.5)' : 'rgba(255,107,74,0.35)',
                fontFamily: "'DM Serif Display', serif",
                lineHeight: 1,
                transition: 'all 0.3s ease'
            }}>{number}</div>
            <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#F5E6D3', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'rgba(245,230,211,0.65)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: '500' }}>{desc}</p>
            </div>
        </div>
    );
}

export default function Landing() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

    useSEO({
        title: 'Your AI Homework Planner',
        description: 'StudyNext is the ultimate AI homework planner and school organizer. Track tasks, sync your syllabus, and manage your class schedule with a premium student dashboard.',
        keywords: 'homework planner, student planner, school planner, study planner, homework organizer'
    });

    // Removed automatic redirect to dashboard for Landing Page

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: '#F5E6D3',
        fontFamily: "'Outfit', sans-serif",
        overflowX: 'hidden',
        position: 'relative'
    };

    return (
        <div style={pageStyle}>
            <div className="grain-overlay" />
            <div className="mesh-gradient-premium" style={{ position: 'fixed', inset: 0, opacity: 0.4, zIndex: 0 }} />

            {/* Header / Nav */}
            <header style={{
                padding: isDesktop ? '1.25rem 4rem' : '1rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(5,5,5,0.8)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px' }}>
                        <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px', color: '#F5E6D3' }}>StudyNext</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        color: 'rgba(245,230,211,0.7)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        transition: 'all 0.2s ease',
                        borderRadius: '10px'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#F5E6D3'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(245,230,211,0.7)'}
                    >Sign In</Link>
                    <Link to="/signup" style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#FF6B4A',
                        color: '#0A0A0A',
                        borderRadius: '12px',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 10px 20px -5px rgba(255,107,74,0.3)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 14px 28px -5px rgba(255,107,74,0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 10px 20px -5px rgba(255,107,74,0.3)';
                    }}
                    >Get Started</Link>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{
                padding: isDesktop ? '8rem 4rem' : '4rem 1.5rem',
                textAlign: 'center',
                position: 'relative',
                zIndex: 10,
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div className="animate-fade-up animate-delay-1" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(255,107,74,0.08)',
                    border: '1px solid rgba(255,107,74,0.2)',
                    padding: '8px 20px',
                    borderRadius: '100px',
                    marginBottom: '2rem',
                    color: '#FF6B4A',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}>
                    <Io.IoSparkles size={16} />
                    The Future of Academic Evolution
                </div>

                <h1 className="animate-fade-up animate-delay-2" style={{
                    fontSize: isDesktop ? '5.5rem' : '3.2rem',
                    fontWeight: '950',
                    lineHeight: 0.95,
                    color: '#F5E6D3',
                    letterSpacing: '-3px',
                    marginBottom: '2.5rem'
                }}>
                    Your classes, tasks <br /> & exams <span style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontStyle: 'italic',
                        fontWeight: '400',
                        color: '#FFB74D'
                    }}>unified.</span>
                </h1>

                <p className="animate-fade-up animate-delay-3" style={{
                    fontSize: isDesktop ? '1.4rem' : '1.1rem',
                    color: 'rgba(245,230,211,0.7)',
                    maxWidth: '700px',
                    margin: '0 auto 4rem',
                    lineHeight: 1.6,
                    fontWeight: '500'
                }}>
                    The intelligent workspace designed for students who demand more from their routine. Master your syllabus with Baku's leading study companion.
                </p>

                <div className="animate-fade-up animate-delay-4" style={{
                    display: 'flex',
                    flexDirection: isDesktop ? 'row' : 'column',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    alignItems: 'center'
                }}>
                    <Link to="/signup" style={{
                        padding: '1.5rem 3rem',
                        backgroundColor: '#FF6B4A',
                        color: '#0A0A0A',
                        borderRadius: '20px',
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 20px 40px -10px rgba(255,107,74,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 28px 50px -10px rgba(255,107,74,0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(255,107,74,0.5)';
                    }}>
                        Get Started Free <Io.IoArrowForwardOutline size={22} />
                    </Link>
                    <p style={{ color: 'rgba(245,230,211,0.5)', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                        No credit card required · Free forever plan
                    </p>
                </div>

                {/* Features Grid Overlay */}
                <div style={{
                    marginTop: '8rem',
                    display: 'grid',
                    gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr',
                    gap: '2rem'
                }}>
                    <FeatureCard
                        icon={<Io.IoFlashOutline />}
                        title="Intelligent Tracking"
                        desc="AI-powered task prioritization that learns your study flow and predicts exam stress."
                        delay="0.5s"
                    />
                    <FeatureCard
                        icon={<Io.IoShieldCheckmarkOutline />}
                        title="Syllabus Sync"
                        desc="Baku's first automated timetable sync with real-time grade tracking and GPA predictors."
                        delay="0.6s"
                    />
                    <FeatureCard
                        icon={<Io.IoLeafOutline />}
                        title="Offline Workspace"
                        desc="Never lose sync. Our local-first architecture ensures your planner works anywhere, anytime."
                        delay="0.7s"
                    />
                </div>
            </main>

            {/* What It Does Section */}
            <section style={{
                padding: isDesktop ? '6rem 4rem' : '4rem 1.5rem',
                position: 'relative',
                zIndex: 10,
                background: 'linear-gradient(180deg, transparent 0%, rgba(255,107,74,0.03) 100%)'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <p className="animate-fade-up" style={{
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        color: '#FF6B4A',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem'
                    }}>What It Does</p>
                    <h2 className="animate-fade-up animate-delay-1" style={{
                        fontSize: isDesktop ? '2.75rem' : '1.75rem',
                        fontWeight: '800',
                        color: '#F5E6D3',
                        lineHeight: 1.3,
                        marginBottom: '1.5rem'
                    }}>
                        StudyNext transforms your chaotic academic schedule into a{' '}
                        <span style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontStyle: 'italic',
                            color: '#FFB74D'
                        }}>calm, focused workflow</span>{' '}
                        — one task at a time.
                    </h2>
                </div>
            </section>

            {/* Who It's For Section */}
            <section style={{
                padding: isDesktop ? '6rem 4rem' : '4rem 1.5rem',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <p className="animate-fade-up" style={{
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            color: '#FF6B4A',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem'
                        }}>Who It's For</p>
                        <h2 className="animate-fade-up animate-delay-1" style={{
                            fontSize: isDesktop ? '2.75rem' : '1.75rem',
                            fontWeight: '800',
                            color: '#F5E6D3'
                        }}>
                            Built for students who{' '}
                            <span style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontStyle: 'italic',
                                color: '#FFB74D'
                            }}>care</span>
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr',
                        gap: '1.5rem'
                    }}>
                        <AudienceCard
                            icon={<Io.IoSchoolOutline />}
                            title="High School Students"
                            desc="Managing multiple subjects, exams, and extracurriculars without losing your mind."
                        />
                        <AudienceCard
                            icon={<Io.IoLibraryOutline />}
                            title="University Students"
                            desc="Balancing lectures, assignments, projects, and deadlines across complex semesters."
                        />
                        <AudienceCard
                            icon={<Io.IoRocketOutline />}
                            title="Ambitious Self-Learners"
                            desc="Anyone committed to personal growth through structured, intentional learning."
                        />
                    </div>
                </div>
            </section>

            {/* Why It's Different Section */}
            <section style={{
                padding: isDesktop ? '6rem 4rem' : '4rem 1.5rem',
                position: 'relative',
                zIndex: 10,
                background: '#0A0A0A'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <p className="animate-fade-up" style={{
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            color: '#FF6B4A',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem'
                        }}>Why It's Different</p>
                        <h2 className="animate-fade-up animate-delay-1" style={{
                            fontSize: isDesktop ? '2.75rem' : '1.75rem',
                            fontWeight: '800',
                            color: '#F5E6D3'
                        }}>
                            Not another{' '}
                            <span style={{ textDecoration: 'line-through', color: 'rgba(245,230,211,0.3)' }}>boring todo app</span>
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
                        gap: '2rem'
                    }}>
                        <DifferentiatorCard
                            number="01"
                            title="Designed for Academic Life"
                            desc="Built specifically for students — not retrofitted from corporate tools. We understand syllabus stress, exam prep, and semester rhythms."
                        />
                        <DifferentiatorCard
                            number="02"
                            title="Calm, Not Chaotic"
                            desc="No overwhelming dashboards or notification spam. We help you focus on one thing at a time with supportive, gentle reminders."
                        />
                        <DifferentiatorCard
                            number="03"
                            title="Progress You Can Feel"
                            desc="XP, levels, and streaks that celebrate your consistency — not just productivity. Small wins matter here."
                        />
                        <DifferentiatorCard
                            number="04"
                            title="Local-First, Cloud-Ready"
                            desc="Your data works offline. Sync when you want. No internet anxiety during study sessions."
                        />
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section style={{
                padding: isDesktop ? '8rem 4rem' : '5rem 1.5rem',
                position: 'relative',
                zIndex: 10,
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="animate-float" style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto 2rem',
                        filter: 'drop-shadow(0 20px 40px rgba(255,107,74,0.4))'
                    }}>
                        <img src={mascot} alt="StudyNext" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>

                    <p className="animate-fade-up" style={{
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        color: '#FF6B4A',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem'
                    }}>Get The App</p>

                    <h2 className="animate-fade-up animate-delay-1" style={{
                        fontSize: isDesktop ? '3rem' : '2rem',
                        fontWeight: '900',
                        color: '#F5E6D3',
                        marginBottom: '1rem'
                    }}>
                        Start your journey{' '}
                        <span style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontStyle: 'italic',
                            color: '#FFB74D'
                        }}>today</span>
                    </h2>

                    <p className="animate-fade-up animate-delay-2" style={{
                        fontSize: '1.1rem',
                        color: 'rgba(245,230,211,0.65)',
                        marginBottom: '3rem'
                    }}>
                        Available on web. Mobile apps coming soon.
                    </p>

                    {/* Download Buttons */}
                    <div className="animate-fade-up animate-delay-3" style={{
                        display: 'flex',
                        flexDirection: isDesktop ? 'row' : 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <Link to="/signup" style={{
                            padding: '1.25rem 2.5rem',
                            background: 'linear-gradient(135deg, #FF6B4A 0%, #FF8266 100%)',
                            color: '#0A0A0A',
                            borderRadius: '16px',
                            fontWeight: '800',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 15px 40px -10px rgba(255,107,74,0.5)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 20px 50px -10px rgba(255,107,74,0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 15px 40px -10px rgba(255,107,74,0.5)';
                        }}>
                            <Io.IoGlobeOutline size={22} />
                            Open Web App
                        </Link>

                        {/* Coming Soon Buttons - styled as badges */}
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            flexDirection: isDesktop ? 'row' : 'column'
                        }}>
                            <div style={{
                                padding: '0.875rem 1.5rem',
                                background: 'transparent',
                                border: '1px dashed rgba(255,255,255,0.15)',
                                borderRadius: '12px',
                                color: 'rgba(245,230,211,0.35)',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                opacity: 0.7
                            }}>
                                <Io.IoLogoApple size={20} />
                                iOS Soon
                            </div>

                            <div style={{
                                padding: '0.875rem 1.5rem',
                                background: 'transparent',
                                border: '1px dashed rgba(255,255,255,0.15)',
                                borderRadius: '12px',
                                color: 'rgba(245,230,211,0.35)',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                opacity: 0.7
                            }}>
                                <Io.IoLogoGoogle size={20} />
                                Android Soon
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: isDesktop ? '3rem 4rem' : '2rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: '#050505',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: isDesktop ? 'row' : 'column',
                    justifyContent: 'space-between',
                    alignItems: isDesktop ? 'center' : 'flex-start',
                    gap: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={mascot} alt="StudyNext" style={{ width: '32px', height: '32px' }} />
                        <span style={{ fontWeight: '700', color: '#F5E6D3' }}>StudyNext</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <Link
                            to="/privacy"
                            style={{ color: 'rgba(245,230,211,0.5)', fontWeight: '500', fontSize: '0.9rem', transition: 'color 0.2s ease' }}
                            onMouseEnter={(e) => e.target.style.color = '#F5E6D3'}
                            onMouseLeave={(e) => e.target.style.color = 'rgba(245,230,211,0.5)'}
                        >Privacy</Link>
                        <Link
                            to="/terms"
                            style={{ color: 'rgba(245,230,211,0.5)', fontWeight: '500', fontSize: '0.9rem', transition: 'color 0.2s ease' }}
                            onMouseEnter={(e) => e.target.style.color = '#F5E6D3'}
                            onMouseLeave={(e) => e.target.style.color = 'rgba(245,230,211,0.5)'}
                        >Terms</Link>
                    </div>
                    <p style={{ color: 'rgba(245,230,211,0.4)', fontSize: '0.85rem' }}>
                        © {new Date().getFullYear()} StudyNext. Made in Baku.
                    </p>
                </div>
            </footer>

            {/* Visual Orb - subtle ambient glow */}
            <div style={{
                position: 'fixed',
                bottom: '-30%',
                right: '-15%',
                width: '50vw',
                height: '50vw',
                background: 'radial-gradient(circle, rgba(255,107,74,0.08) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />
        </div>
    );
}
