import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircle, IoArrowUndo } from 'react-icons/io5';

export default function UndoToast({ message, onUndo, duration = 5000, onExpire }) {
    const [progress, setProgress] = useState(100);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                setIsVisible(false);
                if (onExpire) onExpire();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onExpire]);

    function handleUndo() {
        setIsVisible(false);
        if (onUndo) onUndo();
    }

    if (!isVisible) return null;

    return (
        <div
            className="animate-fade-up"
            style={{
                position: 'fixed',
                bottom: 'calc(100px + env(safe-area-inset-bottom))',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2000,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '0.875rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                minWidth: '280px',
                maxWidth: '90vw'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <IoCheckmarkCircle size={20} color="var(--success)" />
                <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--text)'
                }}>
                    {message}
                </span>
            </div>

            <button
                onClick={handleUndo}
                style={{
                    background: 'var(--primary-muted)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.5rem 1rem',
                    color: 'var(--primary)',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                }}
            >
                <IoArrowUndo size={16} />
                Undo
            </button>

            {/* Progress bar */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'var(--border)',
                borderRadius: '0 0 14px 14px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--primary)',
                    transition: 'width 0.05s linear'
                }} />
            </div>
        </div>
    );
}
