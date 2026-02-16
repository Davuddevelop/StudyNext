import React, { useState, useEffect, useCallback } from 'react';
import { IoCloseCircleOutline, IoRocketOutline, IoSparklesOutline, IoHeartOutline, IoFitnessOutline, IoBrainOutline } from 'react-icons/io5';

const MOTIVATIONAL_MESSAGES = [
    "Just 10 minutes. You've got this.",
    "Small steps lead to massive results.",
    "Don't think, just start.",
    "Slay the procrastination dragon.",
    "Future you will thank you.",
    "Focus is a superpower.",
    "Momentum is your best friend.",
    "Excellence is a habit, not an act."
];

export default function StartMode({ onComplete, onCancel }) {
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [messageIndex, setMessageIndex] = useState(0);
    const [isActive, setIsActive] = useState(true);

    // Rotate messages every 45 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
        }, 45000);
        return () => clearInterval(interval);
    }, []);

    // Countdown logic
    useEffect(() => {
        let timer;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            onComplete();
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft, onComplete]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        }
    }, []);

    useEffect(() => {
        handleFullscreen();
    }, [handleFullscreen]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#050505',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F5E6D3',
            fontFamily: "'Outfit', sans-serif"
        }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255,107,74,0.15) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                zIndex: -1
            }} />

            {/* Close / Cancel Button */}
            <button
                onClick={onCancel}
                style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(245,230,211,0.3)',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#FF6B4A'}
                onMouseOut={(e) => e.target.style.color = 'rgba(245,230,211,0.3)'}
            >
                <IoCloseCircleOutline size={32} />
            </button>

            {/* Focus Content */}
            <div className="animate-fade-up" style={{ textAlign: 'center' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                }}>
                    <IoBrainOutline className="animate-float" style={{ color: '#FF6B4A', fontSize: '2.5rem' }} />
                    <span style={{
                        textTransform: 'uppercase',
                        letterSpacing: '5px',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        color: '#FF6B4A'
                    }}>Focus Session</span>
                </div>

                <h1 style={{
                    fontSize: '8rem',
                    fontWeight: '900',
                    margin: '0',
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: 'italic',
                    color: '#F5E6D3',
                    textShadow: '0 0 50px rgba(255,107,74,0.2)'
                }}>
                    {formatTime(timeLeft)}
                </h1>

                <div style={{ marginTop: '2rem', minHeight: '3rem' }}>
                    <p className="animate-fade-up" key={messageIndex} style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'rgba(245,230,211,0.7)',
                        fontStyle: 'italic'
                    }}>
                        "{MOTIVATIONAL_MESSAGES[messageIndex]}"
                    </p>
                </div>

                <div style={{
                    marginTop: '4rem',
                    display: 'flex',
                    gap: '1.5rem',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={onComplete}
                        style={{
                            padding: '1rem 2.5rem',
                            background: 'linear-gradient(135deg, #FF6B4A 0%, #FF8266 100%)',
                            border: 'none',
                            borderRadius: '16px',
                            color: '#0A0A0A',
                            fontWeight: '800',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(255,107,74,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        I'm Done <IoRocketOutline />
                    </button>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        style={{
                            padding: '1rem 2rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            color: '#F5E6D3',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        {isActive ? 'Pause' : 'Resume'}
                    </button>
                </div>
            </div>

            {/* Bottom Decoration */}
            <div style={{
                position: 'absolute',
                bottom: '3rem',
                left: '0',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                opacity: 0.1
            }}>
                <IoSparklesOutline size={20} />
                <IoHeartOutline size={20} />
                <IoFitnessOutline size={20} />
            </div>
        </div>
    );
}
