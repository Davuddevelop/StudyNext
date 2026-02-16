import React, { useState } from 'react';
import { IoSquareOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { format, parseISO } from 'date-fns';

export default function SwipeableTaskItem({ hw, status, onToggle }) {
    const [offsetX, setOffsetX] = useState(0);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const threshold = 100; // px to trigger completion

    const handleTouchStart = (e) => {
        setStartX(e.targetTouches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentX = e.targetTouches[0].clientX;
        const diff = currentX - startX;

        // Only allow swiping right for completion (positive diff)
        // Add resistance or limit?
        if (diff > 0) {
            setOffsetX(diff);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (offsetX > threshold) {
            // Trigger completion
            setIsCompleting(true);
            setOffsetX(1000); // Fly off screen
            setTimeout(() => {
                onToggle();
                setOffsetX(0);
                setIsCompleting(false);
            }, 300);
        } else {
            // Snap back
            setOffsetX(0);
        }
    };

    const priorityColor = hw.color || {
        high: 'var(--danger)',
        medium: 'var(--primary)',
        low: 'var(--success)'
    }[hw.priority] || '#cbd5e1';

    const statusLabel = {
        overdue: { text: 'Overdue', color: 'white', bg: 'var(--danger)' },
        today: { text: 'Today', color: 'white', bg: 'var(--primary)' },
        upcoming: { text: format(parseISO(hw.dueDate), 'MMM d'), color: 'var(--text-muted)', bg: '#f1f5f9' },
        completed: { text: 'Done', color: 'white', bg: 'var(--success)' }
    }[status] || { text: '', color: '', bg: '' };

    return (
        <div
            style={{
                position: 'relative',
                marginBottom: '0.75rem',
                overflow: 'hidden',
                borderRadius: '16px'
            }}
        >
            {/* Background for "Done" Action */}
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
                paddingLeft: '2rem',
                color: 'white',
                fontWeight: '800',
                fontSize: '1.2rem',
                borderRadius: '16px'
            }}>
                <IoCheckmarkCircle size={28} style={{ marginRight: '0.5rem' }} /> DONE
            </div>

            {/* Foreground Card */}
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="card-soft"
                style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: `4px solid ${priorityColor}`,
                    background: 'var(--surface)',
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
                    <div style={{ color: 'var(--text-muted)', display: 'flex' }}>
                        {status === 'completed' || isCompleting ? <IoCheckmarkCircle size={24} color="var(--success)" /> : <IoSquareOutline size={24} />}
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text)', textDecoration: (status === 'completed' || isCompleting) ? 'line-through' : 'none', opacity: (status === 'completed' || isCompleting) ? 0.6 : 1 }}>{hw.subject}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400' }}>{hw.title}</div>
                    </div>
                </div>
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '99px',
                    color: statusLabel.color,
                    background: statusLabel.bg
                }}>
                    {statusLabel.text}
                </div>
            </div>
        </div>
    );
}
