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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IoCalendarOutline /> {format(currentDate, 'MMMM yyyy')}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', padding: '4px', borderRadius: '8px' }}><IoChevronBack /></button>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', padding: '4px', borderRadius: '8px' }}><IoChevronForward /></button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.8rem', marginBottom: 'auto', flex: 1 }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>{d}</div>
                ))}
                {days.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isDayToday = isToday(day);
                    const dayHasTask = hasTask(day);

                    return (
                        <div key={i} style={{
                            textAlign: 'center',
                            padding: '0.5rem 0',
                            fontSize: '0.9rem',
                            color: !isCurrentMonth ? 'var(--text-muted)' : isDayToday ? 'var(--primary)' : 'var(--text)',
                            fontWeight: isDayToday ? '900' : '500',
                            opacity: !isCurrentMonth ? 0.3 : 1,
                            position: 'relative',
                            cursor: 'pointer'
                        }} onClick={() => navigate('/calendar')}>
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

            <button
                onClick={() => navigate('/calendar')}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--border)',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '700',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                Open Full Calendar <IoArrowForward />
            </button>
        </div>
    );
}
