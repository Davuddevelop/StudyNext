import React, { useState, useEffect } from 'react';
import {
    IoTimerOutline,
    IoPlayOutline,
    IoPauseOutline,
    IoStopOutline,
    IoChevronDownOutline,
    IoChevronUpOutline,
    IoCloseOutline,
    IoCheckmarkCircle
} from 'react-icons/io5';
import { useFocusTimer } from '../hooks/useFocusTimer';

const DURATIONS = [5, 10, 15, 20, 25, 30, 45, 60];

export default function FocusTimer({ tasks = [], onComplete, earnXP, visible, onClose }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showTaskDropdown, setShowTaskDropdown] = useState(false);

    const timer = useFocusTimer(async (duration, linkedTaskId) => {
        // Timer completed - award XP
        if (earnXP) {
            try {
                const xpAmount = timer.XP_REWARDS[duration] || 100;
                await earnXP(xpAmount);
            } catch (err) {
                console.error('Failed to award XP:', err);
            }
        }
        if (onComplete) {
            onComplete(duration, linkedTaskId);
        }
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If timer is not active and panel not visible, show nothing
    if (!visible && !timer.isActive) return null;

    // Mini timer (collapsed state while active)
    if (timer.isActive && !timer.isExpanded) {
        return (
            <div
                className="focus-timer-mini animate-fade-up"
                style={{
                    position: 'fixed',
                    bottom: isMobile ? 'calc(80px + env(safe-area-inset-bottom))' : '2rem',
                    right: '1rem',
                    zIndex: 9999,
                    pointerEvents: 'auto',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    padding: '0.75rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                    cursor: 'pointer'
                }}
                onClick={timer.expand}
            >
                <IoTimerOutline size={20} color="var(--primary)" />
                <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: timer.isPaused ? 'var(--text-muted)' : 'var(--text)',
                    fontStyle: 'italic'
                }}>
                    {timer.formattedTime}
                </span>
                {timer.isPaused && (
                    <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Paused
                    </span>
                )}
                <IoChevronUpOutline size={16} color="var(--text-muted)" />
            </div>
        );
    }

    // Full panel
    return (
        <div
            className="focus-timer-panel"
            style={{
                position: 'fixed',
                top: isMobile ? 'auto' : '1rem',
                bottom: isMobile ? 0 : 'auto',
                right: isMobile ? 0 : '1rem',
                left: isMobile ? 0 : 'auto',
                width: isMobile ? '100%' : '380px',
                zIndex: 9999,
                pointerEvents: 'auto',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IoTimerOutline size={20} color="var(--primary)" />
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: 'var(--primary)'
                    }}>
                        Focus Session
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {timer.isActive && (
                        <button
                            onClick={timer.collapse}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '8px'
                            }}
                        >
                            <IoChevronDownOutline size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (timer.isActive) {
                                timer.stop();
                            }
                            if (onClose) onClose();
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '8px'
                        }}
                    >
                        <IoCloseOutline size={20} />
                    </button>
                </div>
            </div>

            {/* Timer Display */}
            <div style={{
                padding: '2rem 1.5rem',
                textAlign: 'center'
            }}>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: isMobile ? '4rem' : '5rem',
                    fontWeight: '400',
                    fontStyle: 'italic',
                    color: timer.isPaused ? 'var(--text-muted)' : 'var(--text)',
                    lineHeight: 1,
                    textShadow: timer.isActive && !timer.isPaused ? '0 0 40px rgba(255,107,74,0.2)' : 'none',
                    transition: 'all 0.3s ease'
                }}>
                    {timer.isActive ? timer.formattedTime : `${timer.selectedDuration}:00`}
                </div>
                {timer.isActive && (
                    <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        fontWeight: '600'
                    }}>
                        +{timer.xpReward} XP on completion
                    </div>
                )}
            </div>

            {/* Duration Selector (only when not active) */}
            {!timer.isActive && (
                <div style={{
                    padding: '0 1.5rem 1.5rem',
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    {DURATIONS.map(d => (
                        <button
                            key={d}
                            onClick={() => timer.setDuration(d)}
                            className={`duration-pill ${timer.selectedDuration === d ? 'active' : ''}`}
                            style={{
                                padding: '0.6rem 1rem',
                                borderRadius: '100px',
                                border: timer.selectedDuration === d
                                    ? '1px solid var(--primary)'
                                    : '1px solid var(--border)',
                                background: timer.selectedDuration === d
                                    ? 'var(--primary)'
                                    : 'var(--surface)',
                                color: timer.selectedDuration === d
                                    ? '#0F0F0F'
                                    : 'var(--text-secondary)',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {d} min
                        </button>
                    ))}
                </div>
            )}

            {/* Task Selector (only when not active) */}
            {!timer.isActive && tasks.length > 0 && (
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Link to task (optional)
                    </label>
                    <select
                        value={timer.linkedTaskId || ''}
                        onChange={(e) => {
                            const taskId = e.target.value;
                            const task = tasks.find(t => t.id === taskId);
                            timer.setLinkedTask(
                                taskId || null,
                                task ? `${task.subject} - ${task.title}` : null
                            );
                        }}
                        className="input"
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            color: 'var(--text)',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">No task linked</option>
                        {tasks.filter(t => !t.isCompleted).map(task => (
                            <option key={task.id} value={task.id}>
                                {task.subject} - {task.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Linked Task Display (when active) */}
            {timer.isActive && timer.linkedTaskName && (
                <div style={{
                    padding: '0 1.5rem 1rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'var(--primary-muted)',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--primary)'
                    }}>
                        <IoCheckmarkCircle size={14} />
                        {timer.linkedTaskName}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div style={{
                padding: '1rem 1.5rem 1.5rem',
                display: 'flex',
                gap: '0.75rem'
            }}>
                {!timer.isActive ? (
                    <button
                        onClick={() => timer.start(timer.selectedDuration, timer.linkedTaskId, timer.linkedTaskName)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'linear-gradient(135deg, var(--primary) 0%, #FF8266 100%)',
                            border: 'none',
                            borderRadius: '14px',
                            color: '#0F0F0F',
                            fontWeight: '800',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 10px 30px -10px rgba(255,107,74,0.5)'
                        }}
                    >
                        <IoPlayOutline size={20} />
                        Start Focus
                    </button>
                ) : (
                    <>
                        <button
                            onClick={timer.isPaused ? timer.resume : timer.pause}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: timer.isPaused
                                    ? 'linear-gradient(135deg, var(--primary) 0%, #FF8266 100%)'
                                    : 'var(--surface)',
                                border: timer.isPaused ? 'none' : '1px solid var(--border)',
                                borderRadius: '14px',
                                color: timer.isPaused ? '#0F0F0F' : 'var(--text)',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {timer.isPaused ? (
                                <>
                                    <IoPlayOutline size={18} />
                                    Resume
                                </>
                            ) : (
                                <>
                                    <IoPauseOutline size={18} />
                                    Pause
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                timer.stop();
                                if (onClose) onClose();
                            }}
                            style={{
                                padding: '1rem 1.25rem',
                                background: 'var(--danger-muted)',
                                border: '1px solid rgba(255,107,107,0.2)',
                                borderRadius: '14px',
                                color: 'var(--danger)',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <IoStopOutline size={18} />
                            Stop
                        </button>
                    </>
                )}
            </div>

            {/* XP Preview */}
            {!timer.isActive && (
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid var(--border)',
                    textAlign: 'center'
                }}>
                    <span style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        fontWeight: '600'
                    }}>
                        Complete to earn{' '}
                        <span style={{ color: 'var(--accent)', fontWeight: '800' }}>
                            +{timer.XP_REWARDS[timer.selectedDuration]} XP
                        </span>
                    </span>
                </div>
            )}
        </div>
    );
}
