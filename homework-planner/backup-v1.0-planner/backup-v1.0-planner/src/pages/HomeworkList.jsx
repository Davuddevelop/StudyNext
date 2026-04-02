import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { useNavigate } from 'react-router-dom';
import { IoTrashOutline, IoCheckmarkCircleOutline, IoArrowBack, IoSearchOutline, IoStar, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import EmptyState from '../components/EmptyState';
import { SkeletonTaskList } from '../components/SkeletonLoader';

export default function HomeworkList() {
    const { currentUser, userProfile } = useAuth();
    const isPremium = userProfile?.plan === 'premium';
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
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

    // Filter by status, subject, and search query
    const filteredHomeworks = homeworks.filter(h => {
        const matchesStatus = filter === 'all' || (filter === 'active' ? !h.isCompleted : h.isCompleted);
        const matchesSubject = subjectFilter === 'all' || h.subject === subjectFilter;
        const matchesSearch = searchQuery.trim() === '' ||
            (h.title && h.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (h.subject && h.subject.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSubject && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredHomeworks.length / itemsPerPage);
    const paginatedHomeworks = filteredHomeworks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, subjectFilter, searchQuery]);

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{
                    background: '#f1f5f9',
                    border: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    transition: 'all 0.2s'
                }}>
                    <IoArrowBack size={20} />
                </button>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.5px' }}>Assignments</h1>
            </div>

            {/* Search Bar */}
            <div style={{
                position: 'relative',
                marginBottom: '1.5rem'
            }}>
                <IoSearchOutline
                    size={20}
                    style={{
                        position: 'absolute',
                        left: '16px',
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
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        fontSize: '1rem',
                        borderRadius: '16px',
                        border: '2px solid var(--border)',
                        background: 'var(--surface)',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                        outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
            </div>

            {/* Status Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '5px', WebkitOverflowScrolling: 'touch' }}>
                {['all', 'active', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: '12px',
                            border: filter === f ? 'none' : '1px solid var(--border)',
                            backgroundColor: filter === f ? 'var(--primary)' : 'white',
                            color: filter === f ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            textTransform: 'capitalize',
                            boxShadow: filter === f ? '0 4px 12px -4px rgba(139, 92, 246, 0.4)' : 'none',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Subject Filter (Pro Feature) */}
            {isPremium && homeworks.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                    {uniqueSubjects.map(s => (
                        <button
                            key={s}
                            onClick={() => setSubjectFilter(s)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                backgroundColor: subjectFilter === s ? 'var(--accent)' : 'white',
                                color: 'var(--text)',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                textTransform: 'capitalize',
                                boxShadow: subjectFilter === s ? '0 4px 10px -2px rgba(34, 211, 238, 0.3)' : 'none',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {!isPremium && (
                <div style={{ marginBottom: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IoStar color="#f59e0b" /> PRO: Filter & Color by Subject
                </div>
            )}

            {loading ? <SkeletonTaskList count={5} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredHomeworks.length === 0 ? (
                        <EmptyState
                            icon={<IoSearchOutline size={50} />}
                            title="Nothing found"
                            message={searchQuery ? `No results for "${searchQuery}".` : `No ${filter} assignments.`}
                            actionLabel="Add Assignment"
                            actionTo="/add"
                        />
                    ) : (
                        <>
                            {/* Results count */}
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem' }}>
                                Showing {paginatedHomeworks.length} of {filteredHomeworks.length} assignments
                            </div>

                            {paginatedHomeworks.map(hw => (
                                <div key={hw.id} className="card-soft" style={{
                                    padding: '1rem 1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderLeft: `6px solid ${hw.isCompleted ? '#e2e8f0' : (hw.color || 'var(--primary)')}`,
                                    opacity: hw.isCompleted ? 0.7 : 1,
                                }}>
                                    <div
                                        onClick={() => toggleComplete(hw.id, hw.isCompleted)}
                                        style={{ marginRight: '1rem', cursor: 'pointer', display: 'flex' }}
                                    >
                                        {hw.isCompleted ?
                                            <IoCheckmarkCircleOutline size={24} color="var(--success)" /> :
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--border)' }}></div>
                                        }
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text)', textDecoration: hw.isCompleted ? 'line-through' : 'none' }}>
                                            {hw.subject}: {hw.title}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            Due {hw.dueDate}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(hw.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0.5rem', cursor: 'pointer' }}
                                    >
                                        <IoTrashOutline size={20} />
                                    </button>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginTop: '2rem',
                                    paddingBottom: '1rem'
                                }}>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0.75rem',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--surface)',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            opacity: currentPage === 1 ? 0.5 : 1
                                        }}
                                    >
                                        <IoChevronBack size={20} />
                                    </button>

                                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>
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
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--surface)',
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
