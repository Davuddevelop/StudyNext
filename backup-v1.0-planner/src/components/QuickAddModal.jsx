import React, { useRef, useState } from 'react';
import { homeworkService } from '../services/homeworkService';
import { useAuth } from '../contexts/AuthContext';
import { IoClose, IoArrowUpCircle } from 'react-icons/io5';

export default function QuickAddModal({ isOpen, onClose, onAdded }) {
    const subjectRef = useRef();
    const dateRef = useRef();
    const { currentUser, isPremium } = useAuth();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await homeworkService.add(currentUser.uid || 'guest', {
                subject: subjectRef.current.value,
                title: "Quick Task", // Default title if simplified
                dueDate: dateRef.current.value,
                priority: 'medium', // Default
                isCompleted: false,
                createdAt: new Date().toISOString()
            }, isPremium);

            onAdded();
            onClose();
        } catch (err) {
            alert('Failed to add. ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end', // Bottom sheet style
            justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                background: 'var(--surface)',
                width: '100%',
                maxWidth: '600px',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '2rem',
                animation: 'slideUp 0.3s ease-out'
            }} onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Quick Add</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <IoClose size={24} color="var(--text-muted)" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Subject</label>
                        <input
                            ref={subjectRef}
                            type="text"
                            className="input"
                            placeholder="Math, History..."
                            required
                            autoFocus
                            style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Due Date</label>
                        <input
                            ref={dateRef}
                            type="date"
                            className="input"
                            required
                            style={{ width: '100%', padding: '1rem' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-brand"
                        style={{
                            marginTop: '1rem',
                            padding: '1.25rem',
                            fontSize: '1.1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <IoArrowUpCircle size={24} /> {loading ? 'Adding...' : 'Add Task'}
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
