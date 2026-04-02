import React, { useState, useEffect } from 'react';
import { homeworkService } from '../services/homeworkService';
import {
    format, startOfWeek, endOfWeek, eachDayOfInterval,
    startOfMonth, endOfMonth, isSameMonth, isSameDay,
    addMonths, subMonths, isToday, parseISO
} from 'date-fns';
import { IoChevronBack, IoChevronForward, IoCalendarOutline, IoArrowBack, IoStar } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';

export default function CalendarView() {
    const navigate = useNavigate();
    const { currentUser, isPremium } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'agenda'
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

    // Disable premium views if not premium
    function handleViewChange(mode) {
        if (!isPremium && mode !== 'month') {
            alert("Week and Agenda views are Premium features! 🌟");
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

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} style={{
                        background: 'var(--border)',
                        border: 'none',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}>
                        <IoArrowBack size={20} />
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.5px' }}>Calendar</h1>
                </div>

                <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                    {['month', 'week', 'agenda'].map(m => (
                        <button
                            key={m}
                            onClick={() => handleViewChange(m)}
                            style={{
                                padding: '0.6rem 1.25rem',
                                border: 'none',
                                background: viewMode === m ? 'var(--primary)' : 'transparent',
                                color: viewMode === m ? 'white' : 'var(--text-muted)',
                                fontWeight: '700',
                                textTransform: 'capitalize',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            {m} {!isPremium && m !== 'month' && <IoStar size={12} color="#f59e0b" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            {viewMode !== 'agenda' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'var(--surface)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <button onClick={() => setCurrentDate(viewMode === 'month' ? subMonths(currentDate, 1) : new Date(currentDate.setDate(currentDate.getDate() - 7)))} style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', padding: '0.5rem', borderRadius: '10px' }}><IoChevronBack size={20} /></button>
                    <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text)' }}>
                        {viewMode === 'month' ? format(currentDate, 'MMMM yyyy') : `Week of ${format(days[0] || new Date(), 'MMM d')}`}
                    </div>
                    <button onClick={() => setCurrentDate(viewMode === 'month' ? addMonths(currentDate, 1) : new Date(currentDate.setDate(currentDate.getDate() + 7)))} style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', padding: '0.5rem', borderRadius: '10px' }}><IoChevronForward size={20} /></button>
                </div>
            )}

            {/* Grid / Content */}
            {viewMode === 'agenda' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {homeworks.filter(h => !h.isCompleted).length === 0 ? (
                        <EmptyState icon={<IoCalendarOutline size={50} />} title="No tasks" message="Your agenda is clear!" actionLabel="Add Task" actionTo="/add" />
                    ) : (
                        homeworks.filter(h => !h.isCompleted).map(hw => (
                            <div key={hw.id} style={{
                                padding: '1.5rem',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{hw.subject}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>{hw.title}</div>
                                </div>
                                <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
                                    {format(parseISO(hw.dueDate), 'MMM d')}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '0.75rem'
                }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ textAlign: 'center', fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            {d}
                        </div>
                    ))}

                    {days.map(day => {
                        const tasks = getTasksForDay(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        return (
                            <div key={day.toString()} style={{
                                minHeight: '100px',
                                background: !isCurrentMonth ? 'transparent' : 'white',
                                borderRadius: '16px',
                                border: !isCurrentMonth ? 'none' : isToday(day) ? '2px solid var(--primary)' : '1px solid var(--border)',
                                padding: '0.75rem',
                                opacity: !isCurrentMonth ? 0.3 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                ':hover': { transform: 'scale(1.02)' }
                            }}>
                                <div style={{
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    marginBottom: '0.25rem',
                                    color: isToday(day) ? 'var(--primary)' : 'var(--text)'
                                }}>
                                    {format(day, 'd')}
                                </div>

                                {tasks.map(t => (
                                    <div key={t.id} style={{
                                        fontSize: '0.7rem',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        background: t.isCompleted ? '#f1f5f9' : 'var(--primary)',
                                        color: t.isCompleted ? 'var(--text-muted)' : 'white',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontWeight: '600'
                                    }}>
                                        {t.subject}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
