import React, { useState, useEffect } from 'react';
import mascot from '../assets/fox_logo_sharp.svg';

const GREETINGS = {
    morning: [
        "Rise and shine! Ready to conquer today?",
        "Good morning! Fresh start, fresh goals.",
        "Morning! Let's make today count.",
        "New day, new opportunities!"
    ],
    afternoon: [
        "Hey there! Afternoon check-in time.",
        "Good afternoon! How's your day going?",
        "Halfway through the day - you're doing great!",
        "Afternoon hustle mode: ON"
    ],
    evening: [
        "Good evening! Wrapping up nicely?",
        "Evening check-in. You've got this!",
        "Almost done for today. Great work!",
        "Evening vibes. Let's finish strong."
    ],
    night: [
        "Burning the midnight oil? Take breaks!",
        "Late night study session? You're dedicated!",
        "Night owl mode. Remember to rest soon.",
        "Working late? Your future self thanks you."
    ]
};

const MOTIVATIONAL_EMOJIS = ['✨', '🚀', '💪', '🌟', '🎯', '📚', '🏆', '💡'];

export default function WelcomeSplash({ onComplete, userName }) {
    const [isVisible, setIsVisible] = useState(true);
    const [animationStage, setAnimationStage] = useState(0);
    const [greeting, setGreeting] = useState('');
    const [emoji, setEmoji] = useState('');

    useEffect(() => {
        // Determine time-based greeting
        const hour = new Date().getHours();
        let timeOfDay;
        if (hour >= 5 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
        else timeOfDay = 'night';

        const greetings = GREETINGS[timeOfDay];
        setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
        setEmoji(MOTIVATIONAL_EMOJIS[Math.floor(Math.random() * MOTIVATIONAL_EMOJIS.length)]);

        // Animation sequence
        const timers = [
            setTimeout(() => setAnimationStage(1), 100),   // Logo appears
            setTimeout(() => setAnimationStage(2), 600),   // Text appears
            setTimeout(() => setAnimationStage(3), 1200),  // Greeting appears
            setTimeout(() => setAnimationStage(4), 2200),  // Start fade out
            setTimeout(() => {
                setIsVisible(false);
                onComplete?.();
            }, 2700)
        ];

        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #0F0F0F 0%, #1a1a2e 50%, #0F0F0F 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: animationStage >= 4 ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            overflow: 'hidden'
        }}>
            {/* Background glow effect */}
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,107,74,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: animationStage >= 1 ? 'scale(1.5)' : 'scale(0)',
                transition: 'transform 1s ease-out',
                pointerEvents: 'none'
            }} />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        background: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
                        borderRadius: '50%',
                        opacity: animationStage >= 2 ? 0.6 : 0,
                        transform: `translate(${Math.cos(i * 60 * Math.PI / 180) * 120}px, ${Math.sin(i * 60 * Math.PI / 180) * 120}px)`,
                        animation: animationStage >= 2 ? `float-particle ${2 + i * 0.3}s ease-in-out infinite` : 'none',
                        transition: 'opacity 0.5s ease'
                    }}
                />
            ))}

            {/* Logo */}
            <div style={{
                transform: animationStage >= 1 ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(20px)',
                opacity: animationStage >= 1 ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    borderRadius: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px -15px rgba(255, 107, 74, 0.4)',
                    animation: animationStage >= 1 ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                }}>
                    <img
                        src={mascot}
                        alt="StudyNext"
                        style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'contain',
                            filter: 'brightness(0) invert(0.1)'
                        }}
                    />
                </div>
            </div>

            {/* App name */}
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                transform: animationStage >= 2 ? 'translateY(0)' : 'translateY(20px)',
                opacity: animationStage >= 2 ? 1 : 0,
                transition: 'all 0.5s ease-out',
                letterSpacing: '-0.02em'
            }}>
                StudyNext
            </h1>

            {/* Tagline */}
            <p style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
                margin: '0.5rem 0 0 0',
                transform: animationStage >= 2 ? 'translateY(0)' : 'translateY(20px)',
                opacity: animationStage >= 2 ? 1 : 0,
                transition: 'all 0.5s ease-out 0.1s',
                fontWeight: '500'
            }}>
                Your study companion {emoji}
            </p>

            {/* Personalized greeting */}
            <div style={{
                marginTop: '2.5rem',
                textAlign: 'center',
                transform: animationStage >= 3 ? 'translateY(0)' : 'translateY(30px)',
                opacity: animationStage >= 3 ? 1 : 0,
                transition: 'all 0.6s ease-out'
            }}>
                {userName && (
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--primary)',
                        fontWeight: '700',
                        margin: '0 0 0.5rem 0'
                    }}>
                        Hey, {userName}!
                    </p>
                )}
                <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                    margin: 0,
                    maxWidth: '280px',
                    lineHeight: 1.5
                }}>
                    {greeting}
                </p>
            </div>

            {/* Loading indicator */}
            <div style={{
                position: 'absolute',
                bottom: '80px',
                display: 'flex',
                gap: '8px',
                opacity: animationStage >= 2 && animationStage < 4 ? 1 : 0,
                transition: 'opacity 0.3s ease'
            }}>
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            animation: 'bounce-dot 1.4s ease-in-out infinite',
                            animationDelay: `${i * 0.16}s`
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 20px 60px -15px rgba(255, 107, 74, 0.4); }
                    50% { box-shadow: 0 25px 70px -10px rgba(255, 107, 74, 0.6); }
                }
                @keyframes float-particle {
                    0%, 100% { transform: translate(var(--tx), var(--ty)) translateY(0); }
                    50% { transform: translate(var(--tx), var(--ty)) translateY(-15px); }
                }
                @keyframes bounce-dot {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
