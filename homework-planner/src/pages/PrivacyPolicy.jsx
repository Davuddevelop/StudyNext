import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                color: 'var(--text)',
                fontWeight: '600'
            }}>
                <IoArrowBack size={20} /> Back
            </button>
            <h1 style={{ fontWeight: 900, marginBottom: '2rem', color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>Privacy Policy</h1>
            <div style={{
                background: 'var(--surface)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                lineHeight: 1.8
            }}>
                <p style={{ marginBottom: '1.5rem' }}><strong style={{ color: 'var(--text-muted)' }}>Last Updated: February 4, 2026</strong></p>
                <p style={{ marginBottom: '2rem' }}>Your privacy is important to us. This Privacy Policy explains how StudyNext collects, uses, and protects your information.</p>

                <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>1. Information We Collect</h2>
                <p style={{ marginBottom: '1.5rem' }}>We collect information you provide directly to us, such as when you create an account, including your name and email address.</p>

                <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>2. How We Use Information</h2>
                <p style={{ marginBottom: '1.5rem' }}>We use your information to provide, maintain, and improve our services, including syncing your tasks across devices.</p>

                <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>3. Data Deletion</h2>
                <p style={{ marginBottom: '1.5rem' }}>You may delete your account and all associated data at any time through the app settings.</p>

                <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>4. Contact Us</h2>
                <p>If you have questions, contact us at <a href="mailto:spprtstdnxt@gmail.com" style={{ color: 'var(--primary)', fontWeight: '600' }}>spprtstdnxt@gmail.com</a></p>
            </div>
        </div>
    );
}
