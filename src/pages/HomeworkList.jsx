import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { useNavigate } from 'react-router-dom';
import { IoTrashOutline, IoCheckmarkCircleOutline, IoArrowBack, IoSearchOutline, IoSparkles, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import EmptyState from '../components/EmptyState';
import { SkeletonTaskList } from '../components/SkeletonLoader';

export default function HomeworkList() {
    const { currentUser, userProfile } = useAuth();
    const isPremium = userProfile?.plan === 'premium';
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
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
        } finally {
            setLoading(false);
        }
    }

    async function toggleComplete(id, currentStatus) {
        setHomeworks(prev => prev.map(h => h.id === id ? { ...h, isCompleted: !currentStatus } : h));
        try {
            await homeworkService.update(id, { isCompleted: !currentStatus }, isPremium);
        } catch (err) {
            loadData();
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this assignment?")) return;
        try {
            await homeworkService.delete(id, isPremium);
            setHomeworks(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    const uniqueSubjects = ['all', ...new Set(homeworks.map(h => h.subject).filter(s => s && s.trim() !== ''))];

    const filteredHomeworks = homeworks.filter(h => {
        const matchesStatus = filter === 'all' || (filter === 'active' ? !h.isCompleted : h.isCompleted);
        const matchesSubject = subjectFilter === 'all' || h.subject === subjectFilter;
        const matchesSearch = searchQuery.trim() === '' ||
            (h.title && h.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (h.subject && h.subject.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSubject && matchesSearch;
    });

    const totalPages = Math.ceil(filteredHomeworks.length / itemsPerPage);
    const paginatedHomeworks = filteredHomeworks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, subjectFilter, searchQuery]);

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: '0.75rem',
                    borderRadius: '12px'
                }}>
                    <IoArrowBack size={20} />
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>Assignments</h1>
            </div>

            {/* Search */}
            <div className="animate-fade-up animate-delay-1" style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <IoSearchOutline
                    size={20}
                    style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }}
                />
                <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    style={{ paddingLeft: '2.75rem' }}
                />
            </div>

            {/* Status Filter Tabs */}
            <div className="animate-fade-up animate-delay-2" style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
                overflowX: 'auto',
                paddingBottom: '5px'
            }}>
                {['all', 'active', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: '10px',
                            border: filter === f ? 'none' : '1px solid var(--border)',
                            backgroundColor: filter === f ? 'var(--primary)' : 'var(--surface)',
                            color: filter === f ? '#0F0F0F' : 'var(--text-muted)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            textTransform: 'capitalize',
                            boxShadow: filter === f ? '0 4px 12px -4px rgba(255, 107, 74, 0.4)' : 'none',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Subject Filter (Pro) */}
            {isPremium && homeworks.length > 0 && (
                <div className="animate-fade-up animate-delay-2" style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    overflowX: 'auto',
                    paddingBottom: '8px'
                }}>
                    {uniqueSubjects.map(s => (
                        <button
                            key={s}
                            onClick={() => setSubjectFilter(s)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                backgroundColor: subjectFilter === s ? 'var(--accent-muted)' : 'var(--surface)',
                                color: subjectFilter === s ? 'var(--accent)' : 'var(--text-secondary)',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                textTransform: 'capitalize',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {!isPremium && (
                <div className="animate-fade-up animate-delay-2" style={{
                    marginBottom: '1.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <IoSparkles color="var(--accent)" size={14} /> PRO: Filter by subject
                </div>
            )}

            {/* Task List */}
            {loading ? <SkeletonTaskList count={5} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredHomeworks.length === 0 ? (
                        <EmptyState
                            icon={<IoSearchOutline size={48} />}
                            title="Nothing found"
                            message={searchQuery ? `No results for "${searchQuery}".` : `No ${filter} assignments.`}
                            actionLabel="Add Assignment"
                            actionTo="/add"
                        />
                    ) : (
                        <>
                            <div className="animate-fade-up animate-delay-3" style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                fontWeight: '500',
                                marginBottom: '0.5rem'
                            }}>
                                Showing {paginatedHomeworks.length} of {filteredHomeworks.length} assignments
                            </div>

                            {paginatedHomeworks.map((hw, index) => (
                                <div
                                    key={hw.id}
                                    className="animate-fade-up"
                                    style={{
                                        animationDelay: `${0.05 * (index + 1)}s`,
                                        background: 'var(--surface)',
                                        padding: '1rem 1.25rem',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderLeft: `4px solid ${hw.isCompleted ? 'var(--border)' : (hw.color || 'var(--primary)')}`,
                                        opacity: hw.isCompleted ? 0.6 : 1,
                                        border: '1px solid var(--border)',
                                        borderLeftWidth: '4px',
                                        borderLeftColor: hw.isCompleted ? 'var(--border)' : (hw.color || 'var(--primary)')
                                    }}
                                >
                                    <div
                                        onClick={() => toggleComplete(hw.id, hw.isCompleted)}
                                        style={{ marginRight: '1rem', cursor: 'pointer', display: 'flex' }}
                                    >
                                        {hw.isCompleted ?
                                            <IoCheckmarkCircleOutline size={24} color="var(--success)" /> :
                                            <div style={{
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '50%',
                                                border: '2px solid var(--border-heavy)'
                                            }} />
                                        }
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            color: 'var(--text)',
                                            textDecoration: hw.isCompleted ? 'line-through' : 'none'
                                        }}>
                                            {hw.subject}: {hw.title}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            Due {hw.dueDate}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(hw.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <IoTrashOutline size={20} />
                                    </button>
                                </div>
                            ))}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginTop: '2rem'
                                }}>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--surface)',
                                            color: 'var(--text)',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            opacity: currentPage === 1 ? 0.5 : 1
                                        }}
                                    >
                                        <IoChevronBack size={20} />
                                    </button>

                                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text)' }}>
                                        Page {currentPage} of {totalPages}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--surface)',
                                            color: 'var(--text)',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            opacity: currentPage === totalPages ? 0.5 : 1
                                        }}
                                    >
                                        <IoChevronForward size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
