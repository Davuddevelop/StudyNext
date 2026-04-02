import { Capacitor } from '@capacitor/core';

// Storage key for crash logs
const CRASH_LOGS_KEY = 'studynext_crash_logs';
const MAX_STORED_LOGS = 50;

export const crashReportingService = {
    // Initialize crash reporting
    initialize() {
        // Global error handler
        window.onerror = (message, source, lineno, colno, error) => {
            this.logError({
                type: 'uncaught_error',
                message: message?.toString() || 'Unknown error',
                source,
                line: lineno,
                column: colno,
                stack: error?.stack
            });
            return false; // Don't prevent default handling
        };

        // Unhandled promise rejection handler
        window.onunhandledrejection = (event) => {
            this.logError({
                type: 'unhandled_rejection',
                message: event.reason?.message || event.reason?.toString() || 'Unknown rejection',
                stack: event.reason?.stack
            });
        };

        // Log app start
        this.logEvent('app_start', {
            platform: Capacitor.getPlatform(),
            timestamp: new Date().toISOString()
        });

        console.log('Crash reporting initialized');
    },

    // Log an error
    logError(errorData) {
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            platform: Capacitor.getPlatform(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...errorData
        };

        console.error('Error logged:', logEntry);

        // Store locally
        this.storeLog('error', logEntry);

        // In production, you would send to Firebase Crashlytics or custom endpoint
        // this.sendToServer(logEntry);
    },

    // Log a custom event
    logEvent(eventName, data = {}) {
        const logEntry = {
            id: Date.now(),
            event: eventName,
            timestamp: new Date().toISOString(),
            ...data
        };

        this.storeLog('event', logEntry);
    },

    // Log a breadcrumb (user action trail)
    logBreadcrumb(action, data = {}) {
        const breadcrumb = {
            action,
            timestamp: new Date().toISOString(),
            ...data
        };

        // Store last 20 breadcrumbs in memory
        if (!window.__crashBreadcrumbs) {
            window.__crashBreadcrumbs = [];
        }

        window.__crashBreadcrumbs.push(breadcrumb);
        if (window.__crashBreadcrumbs.length > 20) {
            window.__crashBreadcrumbs.shift();
        }
    },

    // Store log locally
    storeLog(type, entry) {
        try {
            const logs = this.getLogs();
            logs.push({ type, ...entry });

            // Keep only recent logs
            while (logs.length > MAX_STORED_LOGS) {
                logs.shift();
            }

            localStorage.setItem(CRASH_LOGS_KEY, JSON.stringify(logs));
        } catch (e) {
            // Storage might be full
            console.warn('Failed to store crash log:', e);
        }
    },

    // Get stored logs
    getLogs() {
        try {
            const stored = localStorage.getItem(CRASH_LOGS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    },

    // Clear stored logs
    clearLogs() {
        localStorage.removeItem(CRASH_LOGS_KEY);
    },

    // Get breadcrumbs for error context
    getBreadcrumbs() {
        return window.__crashBreadcrumbs || [];
    },

    // Create error report for support
    generateErrorReport() {
        return {
            logs: this.getLogs(),
            breadcrumbs: this.getBreadcrumbs(),
            device: {
                platform: Capacitor.getPlatform(),
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenSize: `${window.screen.width}x${window.screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                online: navigator.onLine
            },
            app: {
                url: window.location.href,
                timestamp: new Date().toISOString()
            }
        };
    },

    // Manual error reporting (for try-catch blocks)
    captureException(error, context = {}) {
        this.logError({
            type: 'captured_exception',
            message: error.message,
            name: error.name,
            stack: error.stack,
            context,
            breadcrumbs: this.getBreadcrumbs()
        });
    },

    // Set user context for error reports
    setUser(user) {
        window.__crashUserContext = user ? {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
        } : null;
    }
};

// Auto-initialize on import
crashReportingService.initialize();
