import React, { useState, useEffect } from 'react';
import { homeworkService } from '../services/homeworkService';
import {
    format, startOfWeek, endOfWeek, eachDayOfInterval,
    startOfMonth, endOfMonth, isSameMonth, isSameDay,
    addMonths, subMonths, isToday, parseISO
} from 'date-fns';
import { IoChevronBack, IoChevronForward, IoCalendarOutline, IoArrowBack, IoSparkles } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';

export default function CalendarView() {
    const navigate = useNavigate();
    const { currentUser, isPremium } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month');
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (currentUser) {
                try {
                    const data = await homeworkService.getAll(currentUser.uid, isPremium);
                    setHomeworks(data);
                } catch (error) {
                    console.error("Failed to load homeworks", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [currentUser, isPremium]);

    function handleViewChange(mode) {
        if (!isPremium && mode !== 'month') {
            alert("Week and Agenda views are Premium features!");
            return;
        }
        setViewMode(mode);
    }

    const days = viewMode === 'month'
        ? eachDayOfInterval({
            start: startOfWeek(startOfMonth(currentDate)),
            end: endOfWeek(endOfMonth(currentDate))
        })
        : eachDayOfInterval({
            start: startOfWeek(currentDate),
            end: endOfWeek(currentDate)
        });

    function getTasksForDay(day) {
        return homeworks.filter(h => isSameDay(parseISO(h.dueDate), day));
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="spinner" style={{ width: '32px', height: '32px' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        display: 'flex'
                    }}>
                        <IoArrowBack size={20} />
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>Calendar</h1>
                </div>

                {/* View Toggle */}
                <div style={{
                    display: 'flex',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    padding: '4px',
                    borderRadius: '12px'
                }}>
                    {['month', 'week', 'agenda'].map(m => (
                        <button
                            key={m}
                            onClick={() => handleViewChange(m)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                background: viewMode === m ? 'var(--primary)' : 'transparent',
                                color: viewMode === m ? '#0F0F0F' : 'var(--text-muted)',
                                fontWeight: '600',
                                textTransform: 'capitalize',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {m} {!isPremium && m !== 'month' && <IoSparkles size={12} color="var(--accent)" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            {viewMode !== 'agenda' && (
                <div className="animate-fade-up animate-delay-1" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    background: 'var(--surface)',
                    padding: '1rem 1.25rem',
                    borderRadius: '14px',
                    border: '1px solid var(--border)'
                }}>
                    <button
                        onClick={() => setCurrentDate(viewMode === 'month' ? subMonths(currentDate, 1) : new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                        style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            color: 'var(--text)',
                            display: 'flex',
                            padding: '0.5rem',
                            borderRadius: '10px'
                        }}
                    >
                        <IoChevronBack size={20} />
                    </button>
                    <div style={{ fontWeight: '700', fontSize: '1.15rem', color: 'var(--text)' }}>
                        {viewMode === 'month' ? format(currentDate, 'MMMM yyyy') : `Week of ${format(days[0] || new Date(), 'MMM d')}`}
                    </div>
                    <button
                        onClick={() => setCurrentDate(viewMode === 'month' ? addMonths(currentDate, 1) : new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                        style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            color: 'var(--text)',
                            display: 'flex',
                            padding: '0.5rem',
                            borderRadius: '10px'
                        }}
                    >
                        <IoChevronForward size={20} />
                    </button>
                </div>
            )}

            {/* Content */}
            {viewMode === 'agenda' ? (
                <div className="animate-fade-up animate-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {homeworks.filter(h => !h.isCompleted).length === 0 ? (
                        <EmptyState
                            icon={<IoCalendarOutline size={48} />}
                            title="No tasks"
                            message="Your agenda is clear!"
                            actionLabel="Add Task"
                            actionTo="/add"
                        />
                    ) : (
                        homeworks.filter(h => !h.isCompleted).map((hw, index) => (
                            <div
                                key={hw.id}
                                className="animate-fade-up"
                                style={{
                                    animationDelay: `${0.05 * (index + 1)}s`,
                                    padding: '1.25rem',
                                    background: 'var(--surface)',
                                    borderRadius: '14px',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text)' }}>{hw.subject}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{hw.title}</div>
                                </div>
                                <div style={{
                                    fontWeight: '600',
                                    color: 'var(--primary)',
                                    fontSize: '0.9rem',
                                    padding: '6px 12px',
                                    background: 'var(--primary-muted)',
                                    borderRadius: '8px'
                                }}>
                                    {format(parseISO(hw.dueDate), 'MMM d')}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="animate-fade-up animate-delay-2" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '0.5rem'
                }}>
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{
                            textAlign: 'center',
                            fontWeight: '600',
                            color: 'var(--text-muted)',
                            fontSize: '0.8rem',
                            marginBottom: '0.5rem'
                        }}>
                            {d}
                        </div>
                    ))}

                    {/* Calendar Days */}
                    {days.map(day => {
                        const tasks = getTasksForDay(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        return (
                            <div key={day.toString()} style={{
                                minHeight: '90px',
                                background: !isCurrentMonth ? 'transparent' : 'var(--surface)',
                                borderRadius: '12px',
                                border: !isCurrentMonth ? 'none' : isToday(day) ? '2px solid var(--primary)' : '1px solid var(--border)',
                                padding: '0.625rem',
                                opacity: !isCurrentMonth ? 0.3 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                                transition: 'all 0.2s'
                            }}>
                                <div style={{
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    marginBottom: '0.25rem',
                                    color: isToday(day) ? 'var(--primary)' : 'var(--text)'
                                }}>
                                    {format(day, 'd')}
                                </div>

                                {tasks.slice(0, 2).map(t => (
                                    <div key={t.id} style={{
                                        fontSize: '0.65rem',
                                        padding: '3px 6px',
                                        borderRadius: '5px',
                                        background: t.isCompleted ? 'var(--border)' : (t.color || 'var(--primary)'),
                                        color: t.isCompleted ? 'var(--text-muted)' : '#0F0F0F',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontWeight: '600'
                                    }}>
                                        {t.subject}
                                    </div>
                                ))}
                                {tasks.length > 2 && (
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        +{tasks.length - 2} more
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
