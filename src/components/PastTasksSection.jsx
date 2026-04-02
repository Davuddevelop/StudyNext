import React, { useState } from 'react';
import SwipeableTaskItem from './SwipeableTaskItem';

export default function PastTasksSection({ tasks, onToggle, onMoveToTomorrow }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="animate-fade-up task-section" style={{ opacity: 0.85 }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: isExpanded ? '0.75rem' : 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                        background: 'var(--surface)',
                        color: 'var(--text-muted)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: '1px solid var(--border)'
                    }}>Past Tasks</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · No pressure
                    </span>
                </div>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: '600'
                }}>
                    {isExpanded ? 'Hide' : 'Show'}
                </span>
            </button>

            {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tasks.map((h, index) => (
                        <div key={h.id} className="animate-fade-up" style={{ animationDelay: `${0.05 * index}s`, opacity: 0.7 }}>
                            <SwipeableTaskItem
                                hw={h}
                                status="past"
                                onToggle={() => onToggle(h.id, h.isCompleted)}
                                onMoveToTomorrow={onMoveToTomorrow}
                            />
                        </div>
                    ))}
                    <div style={{
                        textAlign: 'center',
                        padding: '0.75rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic'
                    }}>
                        Reschedule when it works for you
                    </div>
                </div>
            )}
        </div>
    );
}
