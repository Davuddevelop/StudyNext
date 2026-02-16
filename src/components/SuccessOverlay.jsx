import React, { useEffect, useState } from 'react';
import { IoSparkles, IoFlame, IoFlashOutline } from 'react-icons/io5';

export default function SuccessOverlay({
    show,
    xpGained = 100,
    didLevelUp = false,
    streakExtended = false,
    newStreak = 0,
    onComplete
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const duration = didLevelUp ? 3500 : 2500;
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onComplete) onComplete();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete, didLevelUp]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            background: didLevelUp ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
            transition: 'background 0.5s'
        }}>
            <div className="card-soft" style={{
                background: '#0f172a',
                padding: '3rem 5rem',
                textAlign: 'center',
                animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                color: 'white',
                maxWidth: '90%',
                border: 'none',
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
            }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem', color: didLevelUp ? 'var(--accent)' : streakExtended ? '#FF6B4A' : '#FFB74D' }}>
                    {didLevelUp ? <IoSparkles /> : streakExtended ? <IoFlame /> : <IoFlashOutline />}
                </div>

                <h2 style={{
                    fontSize: didLevelUp ? '3.5rem' : '2.5rem',
                    fontWeight: '900',
                    color: 'var(--accent)',
                    margin: 0
                }}>
                    {didLevelUp ? 'Level Up!' : streakExtended ? 'Streak Extended!' : 'Task Complete!'}
                </h2>

                <div style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '1rem' }}>
                    +{xpGained} XP GAINED
                </div>

                {streakExtended && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '0.5rem 1rem',
                        background: '#ffbd2e',
                        color: '#0f172a',
                        fontWeight: '900',
                        borderRadius: '12px',
                        display: 'inline-block',
                        transform: 'rotate(-2deg)',
                        fontSize: '1.2rem'
                    }}>
                        {newStreak} DAY STREAK!
                    </div>
                )}
            </div>

            {/* Confetti Particles */}
            {[...Array(didLevelUp ? 40 : 20)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '12px',
                    height: '12px',
                    backgroundColor: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--accent)' : '#ffbd2e',
                    animation: `confetti ${1 + Math.random() * (didLevelUp ? 2 : 1)}s ease-out forwards`,
                    '--tx': `${(Math.random() - 0.5) * 800}px`,
                    '--ty': `${(Math.random() - 0.5) * 800}px`,
                    '--r': `${Math.random() * 720}deg`
                }} />
            ))}

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes confetti {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--r)) scale(1); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

