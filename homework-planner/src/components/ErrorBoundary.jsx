import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    fontFamily: 'var(--font-main)',
                    color: 'var(--danger)',
                    background: 'var(--bg-color)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Something went wrong.</h1>
                    <details style={{
                        whiteSpace: 'pre-wrap',
                        marginTop: '1rem',
                        background: 'var(--surface)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        fontSize: '0.85rem'
                    }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-brand"
                        style={{ marginTop: '1.5rem', padding: '1rem 2rem' }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
