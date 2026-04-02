import React, { useState } from 'react';
import {
    format, startOfWeek, endOfWeek, eachDayOfInterval,
    startOfMonth, endOfMonth, isSameMonth, isSameDay,
    addMonths, subMonths, isToday, parseISO
} from 'date-fns';
import { IoChevronBack, IoChevronForward, IoCalendarOutline, IoArrowForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function CalendarWidget({ homeworks = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigate = useNavigate();

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentDate)),
        end: endOfWeek(endOfMonth(currentDate))
    });

    const hasTask = (day) => {
        return homeworks.some(h => isSameDay(parseISO(h.dueDate), day) && !h.isCompleted);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                    fontWeight: '700',
                    fontSize: '1rem',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <IoCalendarOutline color="var(--primary)" /> {format(currentDate, 'MMMM yyyy')}
                </div>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button
                        onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                        style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            color: 'var(--text)',
                            display: 'flex',
                            padding: '6px',
                            borderRadius: '8px'
                        }}
                    >
                        <IoChevronBack size={16} />
                    </button>
                    <button
                        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                        style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            color: 'var(--text)',
                            display: 'flex',
                            padding: '6px',
                            borderRadius: '8px'
                        }}
                    >
                        <IoChevronForward size={16} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1rem', flex: 1 }}>
                {/* Day Headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} style={{
                        textAlign: 'center',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: 'var(--text-muted)'
                    }}>
                        {d}
                    </div>
                ))}

                {/* Days */}
                {days.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isDayToday = isToday(day);
                    const dayHasTask = hasTask(day);

                    return (
                        <div
                            key={i}
                            onClick={() => navigate('/calendar')}
                            style={{
                                textAlign: 'center',
                                padding: '0.375rem 0',
                                fontSize: '0.85rem',
                                color: !isCurrentMonth ? 'var(--text-subtle)' : isDayToday ? 'var(--primary)' : 'var(--text)',
                                fontWeight: isDayToday ? '700' : '500',
                                opacity: !isCurrentMonth ? 0.4 : 1,
                                position: 'relative',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                background: isDayToday ? 'var(--primary-muted)' : 'transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            {format(day, 'd')}
                            {dayHasTask && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)'
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* View Full Calendar Button */}
            <button
                onClick={() => navigate('/calendar')}
                style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                }}
            >
                Open Full Calendar <IoArrowForward size={16} />
            </button>
        </div>
    );
}
