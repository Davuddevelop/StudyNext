import React, { useState } from 'react';
import { IoSquareOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { format, parseISO } from 'date-fns';

export default function SwipeableTaskItem({ hw, status, onToggle }) {
    const [offsetX, setOffsetX] = useState(0);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const threshold = 100;

    const handleTouchStart = (e) => {
        setStartX(e.targetTouches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentX = e.targetTouches[0].clientX;
        const diff = currentX - startX;
        if (diff > 0) {
            setOffsetX(diff);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (offsetX > threshold) {
            setIsCompleting(true);
            setOffsetX(1000);
            setTimeout(() => {
                onToggle();
                setOffsetX(0);
                setIsCompleting(false);
            }, 300);
        } else {
            setOffsetX(0);
        }
    };

    const priorityColor = hw.color || {
        high: 'var(--danger)',
        medium: 'var(--primary)',
        low: 'var(--success)'
    }[hw.priority] || 'var(--border-heavy)';

    const statusLabel = {
        overdue: { text: 'Overdue', color: '#0F0F0F', bg: 'var(--danger)' },
        today: { text: 'Today', color: '#0F0F0F', bg: 'var(--primary)' },
        upcoming: { text: format(parseISO(hw.dueDate), 'MMM d'), color: 'var(--text-secondary)', bg: 'var(--bg-elevated)' },
        completed: { text: 'Done', color: '#0F0F0F', bg: 'var(--success)' }
    }[status] || { text: '', color: '', bg: '' };

    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '14px'
        }}>
            {/* Background "Done" Action */}
            <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '1.5rem',
                color: '#0F0F0F',
                fontWeight: '700',
                fontSize: '1rem',
                borderRadius: '14px'
            }}>
                <IoCheckmarkCircle size={24} style={{ marginRight: '0.5rem' }} /> DONE
            </div>

            {/* Foreground Card */}
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderLeftWidth: '4px',
                    borderLeftColor: priorityColor,
                    borderRadius: '14px',
                    position: 'relative',
                    transform: `translateX(${offsetX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                    zIndex: 10
                }}
            >
                <div
                    onClick={onToggle}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex' }}>
                        {status === 'completed' || isCompleting ? (
                            <IoCheckmarkCircle size={24} color="var(--success)" />
                        ) : (
                            <IoSquareOutline size={24} color="var(--text-muted)" />
                        )}
                    </div>
                    <div>
                        <div style={{
                            fontWeight: '600',
                            fontSize: '1rem',
                            color: 'var(--text)',
                            textDecoration: (status === 'completed' || isCompleting) ? 'line-through' : 'none',
                            opacity: (status === 'completed' || isCompleting) ? 0.5 : 1
                        }}>
                            {hw.subject}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                            {hw.title}
                        </div>
                    </div>
                </div>
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    color: statusLabel.color,
                    background: statusLabel.bg
                }}>
                    {statusLabel.text}
                </div>
            </div>
        </div>
    );
}
