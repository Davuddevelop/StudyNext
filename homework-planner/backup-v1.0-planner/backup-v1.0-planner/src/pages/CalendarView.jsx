import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';
import { IoChevronBack, IoChevronForward, IoArrowBack, IoCalendarOutline, IoStar } from 'react-icons/io5';
import EmptyState from '../components/EmptyState';

function SectionHeader({ title }) {
    return (
        <div style={{ marginBottom: '1.25rem', display: 'inline-block' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.3px' }}>{title}</h3>
        </div>
    );
}

export default function CalendarView() {
    const { currentUser, userProfile } = useAuth();
    const isPremium = userProfile?.plan === 'premium';
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [homeworks, setHomeworks] = useState([]);
    const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'agenda'
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [currentUser, userProfile]);

    async function loadData() {
        try {
            const data = await homeworkService.getAll(currentUser?.uid || 'guest', isPremium);
            setHomeworks(data);
        } catch (error) {
            console.error(error);
        }
    }

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Day calculation based on view mode
    let days = [];
    if (viewMode === 'month') {
        days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    } else if (viewMode === 'week') {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    }

    const hasHomework = (day) => {
        return homeworks.some(hw => isSameDay(parseISO(hw.dueDate), day) && !hw.isCompleted);
    };

    const selectedHomeworks = homeworks.filter(hw => isSameDay(parseISO(hw.dueDate), selectedDate));

    const handleViewChange = (newMode) => {
        if (!isPremium && newMode !== 'month') {
            navigate('/premium');
            return;
        }
        setViewMode(newMode);
    };

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} style={{
                        background: 'var(--border)',
                        border: 'none',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '0.75rem',
                        borderRadius: '12px'
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
                            <div key={hw.id} className="card-soft" style={{
                                padding: '1.25rem',
                                borderLeft: `6px solid ${hw.color || 'var(--primary)'}`
                            }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{format(parseISO(hw.dueDate), 'EEEE, MMMM do')}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>{hw.subject}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>{hw.title}</div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--grid-gap)', marginBottom: '2rem' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '900' }}>{d}</div>
                    ))}

                    {days.map(day => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isToday = isSameDay(day, new Date());
                        const hasHw = hasHomework(day);
                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                style={{
                                    aspectRatio: viewMode === 'week' ? '1/1.5' : '1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isSelected ? 'var(--primary)' : 'white',
                                    color: isSelected ? 'white' : 'var(--text)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    boxShadow: isSelected ? '0 4px 12px -2px rgba(139, 92, 246, 0.4)' : 'none',
                                    border: isToday && !isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div>{format(day, 'd')}</div>
                                {hasHw && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '6px',
                                        width: '6px',
                                        height: '6px',
                                        background: isSelected ? 'white' : 'var(--danger)',
                                        borderRadius: '50%'
                                    }}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Selected Day List (Only for non-agenda) */}
            {viewMode !== 'agenda' && (
                <div style={{ marginTop: '3rem' }}>
                    <SectionHeader title={format(selectedDate, 'EEEE, MMMM do')} />
                    {selectedHomeworks.length === 0 ? (
                        <EmptyState
                            icon={<IoCalendarOutline size={50} />}
                            title="No tasks"
                            message="Enjoy your free day!"
                            actionLabel="Add Task"
                            actionTo="/add"
                        />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedHomeworks.map(hw => (
                                <div key={hw.id} className="card-soft" style={{
                                    padding: '1rem 1.25rem',
                                    borderLeft: hw.isCompleted ? '6px solid #e2e8f0' : `6px solid ${hw.color || 'var(--primary)'}`,
                                    opacity: hw.isCompleted ? 0.7 : 1
                                }}>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{hw.subject}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '400' }}>{hw.title}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
