import React from 'react';

// Skeleton shimmer animation via CSS - dark theme
const shimmerStyle = {
    background: 'linear-gradient(90deg, var(--surface) 25%, var(--bg-elevated) 50%, var(--surface) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
};

// Card skeleton for stat cards
export function SkeletonCard({ width = '100%', height = '120px' }) {
    return (
        <div style={{
            width,
            height,
            borderRadius: '24px',
            ...shimmerStyle
        }} />
    );
}

// Text line skeleton
export function SkeletonText({ width = '100%', height = '20px', style = {} }) {
    return (
        <div style={{
            width,
            height,
            borderRadius: '8px',
            ...shimmerStyle,
            ...style
        }} />
    );
}

// Task item skeleton
export function SkeletonTaskItem() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--surface)',
            borderRadius: '16px',
            marginBottom: '0.75rem'
        }}>
            <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                ...shimmerStyle
            }} />
            <div style={{ flex: 1 }}>
                <SkeletonText width="60%" height="16px" style={{ marginBottom: '8px' }} />
                <SkeletonText width="40%" height="12px" />
            </div>
            <SkeletonText width="80px" height="24px" />
        </div>
    );
}

// Stat card skeleton
export function SkeletonStatCard() {
    return (
        <div style={{
            background: 'var(--surface)',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <SkeletonText width="40%" height="14px" style={{ marginBottom: '12px' }} />
            <SkeletonText width="60%" height="32px" />
        </div>
    );
}

// List of task skeletons
export function SkeletonTaskList({ count = 5 }) {
    return (
        <div>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonTaskItem key={i} />
            ))}
        </div>
    );
}

// Add shimmer animation to document
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    if (!document.getElementById('skeleton-styles')) {
        style.id = 'skeleton-styles';
        document.head.appendChild(style);
    }
}

export default { SkeletonCard, SkeletonText, SkeletonTaskItem, SkeletonStatCard, SkeletonTaskList };
