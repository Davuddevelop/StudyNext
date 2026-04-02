import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoSparkles } from 'react-icons/io5';
import UpgradeModal from '../components/UpgradeModal';

const SUBJECTS_STORAGE_KEY = 'studynext_recent_subjects';

export default function AddHomework() {
    const subjectRef = useRef();
    const titleRef = useRef();
    const dateRef = useRef();
    const priorityRef = useRef();
    const notesRef = useRef();
    const reminderRef = useRef();
    const reminderTimeRef = useRef();
    const { currentUser, isPremium } = useAuth();
    const [reminderType, setReminderType] = useState('');
    const [subjectColor, setSubjectColor] = useState('#FF6B4A');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [modalReason, setModalReason] = useState('');
    const [recentSubjects, setRecentSubjects] = useState([]);
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
    const navigate = useNavigate();

    // Load recent subjects and auto-focus
    useEffect(() => {
        // Auto-focus subject input
        if (subjectRef.current) {
            subjectRef.current.focus();
        }

        // Load recent subjects from localStorage
        try {
            const saved = localStorage.getItem(SUBJECTS_STORAGE_KEY);
            if (saved) {
                setRecentSubjects(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load recent subjects');
        }
    }, []);

    // Save subject to recent list
    function saveSubjectToRecent(subject) {
        if (!subject.trim()) return;

        const updated = [subject, ...recentSubjects.filter(s => s.toLowerCase() !== subject.toLowerCase())].slice(0, 10);
        setRecentSubjects(updated);
        localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(updated));
    }

    function selectSubject(subject) {
        if (subjectRef.current) {
            subjectRef.current.value = subject;
        }
        setShowSubjectDropdown(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);

            const subjectValue = subjectRef.current.value.trim();

            await homeworkService.add(currentUser.uid || 'guest', {
                subject: subjectValue,
                title: titleRef.current.value,
                dueDate: dateRef.current.value,
                priority: priorityRef.current.value,
                notes: notesRef.current.value,
                reminder: reminderType,
                reminderCustomTime: reminderType === 'custom' ? reminderTimeRef.current.value : null,
                color: isPremium ? subjectColor : null,
                isCompleted: false,
                createdAt: new Date().toISOString()
            }, isPremium);

            // Save subject to recent list
            saveSubjectToRecent(subjectValue);

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.message === 'LIMIT_REACHED') {
                setModalReason("You've reached the limit of 30 active tasks.");
                setShowUpgradeModal(true);
            } else {
                setError('Failed to add homework.');
            }
        }
        setLoading(false);
    }

    function handleReminderChange(e) {
        const val = e.target.value;
        const isPremiumOption = val !== '' && val !== 'sameday';

        if (!isPremium && isPremiumOption) {
            setModalReason("Smart reminders (1h, 2h, 1d) are available in the Pro version.");
            setShowUpgradeModal(true);
            setReminderType('');
        } else {
            setReminderType(val);
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                message={modalReason}
            />

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
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>Add New Assignment</h1>
            </div>

            {/* Form Card */}
            <div className="animate-fade-up animate-delay-1" style={{
                background: 'var(--surface)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid var(--border)'
            }}>
                {error && (
                    <div style={{
                        backgroundColor: 'var(--danger-muted)',
                        color: 'var(--danger)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid rgba(255, 107, 107, 0.3)'
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Subject with Quick-Select */}
                    <div style={{ position: 'relative' }}>
                        <label>Subject</label>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    ref={subjectRef}
                                    className="input"
                                    required
                                    placeholder="Math, History..."
                                    onFocus={() => recentSubjects.length > 0 && setShowSubjectDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowSubjectDropdown(false), 150)}
                                    autoComplete="off"
                                />
                                {/* Recent Subjects Dropdown */}
                                {showSubjectDropdown && recentSubjects.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '4px',
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        zIndex: 100,
                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4)'
                                    }}>
                                        <div style={{
                                            padding: '0.5rem 0.75rem',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            color: 'var(--text-muted)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            borderBottom: '1px solid var(--border)'
                                        }}>
                                            Recent Subjects
                                        </div>
                                        {recentSubjects.map((subject, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => selectSubject(subject)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    borderBottom: idx < recentSubjects.length - 1 ? '1px solid var(--border)' : 'none',
                                                    color: 'var(--text)',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.15s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {isPremium && (
                                <div style={{ width: '52px' }}>
                                    <input
                                        type="color"
                                        value={subjectColor}
                                        onChange={(e) => setSubjectColor(e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '52px',
                                            padding: '4px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--bg-elevated)',
                                            cursor: 'pointer'
                                        }}
                                        title="Choose subject color"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assignment Title */}
                    <div>
                        <label>Assignment</label>
                        <input type="text" ref={titleRef} className="input" required placeholder="Page 32, Read Chapter 4..." />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label>Due Date</label>
                        <input type="date" ref={dateRef} className="input" required />
                    </div>

                    {/* Reminder */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ marginBottom: 0 }}>Set Reminder</label>
                            {!isPremium && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <IoSparkles size={14} /> PRO
                                </span>
                            )}
                        </div>
                        <select value={reminderType} onChange={handleReminderChange} className="input">
                            <option value="">None</option>
                            <option value="sameday">Same Day (Free)</option>
                            <option value="2h">2 Hours Before (Pro)</option>
                            <option value="1d">1 Day Before (Pro)</option>
                            <option value="custom">Custom Time (Pro)</option>
                        </select>

                        {reminderType === 'custom' && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <input type="time" ref={reminderTimeRef} className="input" />
                            </div>
                        )}
                    </div>

                    {/* Priority */}
                    <div>
                        <label>Priority</label>
                        <select ref={priorityRef} className="input" defaultValue="medium">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label>Notes (Optional)</label>
                        <textarea
                            ref={notesRef}
                            className="input"
                            rows="4"
                            placeholder="Additional details..."
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>

                    {/* Submit (Fixed Mobile / Desktop form bottom) */}
                    <div style={{
                        marginTop: '1.5rem',
                        position: 'sticky',
                        bottom: '20px',
                        zIndex: 10
                    }}>
                        <button disabled={loading} className="btn-brand" type="submit" style={{
                            width: '100%',
                            padding: '1.25rem',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            boxShadow: '0 10px 30px -10px rgba(255, 107, 74, 0.4)'
                        }}>
                            {loading ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
