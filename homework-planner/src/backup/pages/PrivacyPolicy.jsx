import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IoArrowBack size={24} /> Back
            </button>
            <h1 style={{ fontWeight: 900, marginBottom: '2rem' }}>Privacy Policy</h1>
            <p><strong>Last Updated: February 4, 2026</strong></p>
            <p>Your privacy is important to us. This Privacy Policy explains how StudyNext collects, uses, and protects your information.</p>

            <h2 style={{ marginTop: '2rem' }}>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, including your name and email address.</p>

            <h2 style={{ marginTop: '2rem' }}>2. How We Use Information</h2>
            <p>We use your information to provide, maintain, and improve our services, including syncing your tasks across devices.</p>

            <h2 style={{ marginTop: '2rem' }}>3. Data Deletion</h2>
            <p>You may delete your account and all associated data at any time through the app settings.</p>

            <h2 style={{ marginTop: '2rem' }}>4. Contact Us</h2>
            <p>If you have questions, contact us at support@studynext.app</p>
        </div>
    );
}
