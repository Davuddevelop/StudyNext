import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'studynext_focus_timer';

const XP_REWARDS = {
    5: 25,
    10: 50,
    15: 75,
    20: 100,
    25: 125,
    30: 150,
    45: 225,
    60: 300
};

export function useFocusTimer(onComplete) {
    // Determine initial state from localStorage if available
    const getInitialState = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const session = JSON.parse(saved);
                if (session.isActive && session.endTime) {
                    const now = Date.now();
                    const remaining = Math.max(0, Math.floor((session.endTime - now) / 1000));
                    if (remaining > 0) {
                        return {
                            isActive: true,
                            isPaused: session.isPaused || false,
                            isExpanded: session.isExpanded !== false,
                            selectedDuration: session.selectedDuration,
                            timeRemaining: session.isPaused ? session.timeRemaining : remaining,
                            linkedTaskId: session.linkedTaskId,
                            linkedTaskName: session.linkedTaskName
                        };
                    }
                }
            }
        } catch (e) {
            // Ignore error
        }
        return null;
    };

    const initialState = getInitialState();

    const [isActive, setIsActive] = useState(initialState?.isActive || false);
    const [isPaused, setIsPaused] = useState(initialState?.isPaused || false);
    const [isExpanded, setIsExpanded] = useState(initialState?.isExpanded ?? true);
    const [selectedDuration, setSelectedDuration] = useState(initialState?.selectedDuration || 25);
    const [timeRemaining, setTimeRemaining] = useState(initialState?.timeRemaining || 0);
    const [linkedTaskId, setLinkedTaskId] = useState(initialState?.linkedTaskId || null);
    const [linkedTaskName, setLinkedTaskName] = useState(initialState?.linkedTaskName || null);

    const intervalRef = useRef(null);
    const onCompleteRef = useRef(onComplete);

    // Keep onComplete ref updated
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    // Handle missed completions on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const session = JSON.parse(saved);
                if (session.isActive && session.endTime) {
                    const now = Date.now();
                    const remaining = Math.max(0, Math.floor((session.endTime - now) / 1000));

                    if (remaining <= 0 && !initialState) {
                        // Timer completed while away
                        localStorage.removeItem(STORAGE_KEY);
                        if (onCompleteRef.current) {
                            onCompleteRef.current(session.selectedDuration, session.linkedTaskId);
                        }
                    }
                }
            }
        } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Save to localStorage when state changes
    useEffect(() => {
        if (isActive) {
            const endTime = isPaused ? null : Date.now() + (timeRemaining * 1000);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                isActive,
                isPaused,
                isExpanded,
                selectedDuration,
                timeRemaining,
                linkedTaskId,
                linkedTaskName,
                endTime
            }));
        }
    }, [isActive, isPaused, isExpanded, selectedDuration, timeRemaining, linkedTaskId, linkedTaskName]);

    // Main countdown effect
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Don't start if not active or paused
        if (!isActive || isPaused) {
            return;
        }

        // Start counting down
        intervalRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    // Timer complete
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    localStorage.removeItem(STORAGE_KEY);

                    // Reset state
                    setIsActive(false);
                    setIsPaused(false);

                    // Call completion callback
                    if (onCompleteRef.current) {
                        onCompleteRef.current(selectedDuration, linkedTaskId);
                    }

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, isPaused, selectedDuration, linkedTaskId]);

    const start = useCallback((duration = 25, taskId = null, taskName = null) => {
        setSelectedDuration(duration);
        setTimeRemaining(duration * 60);
        setLinkedTaskId(taskId);
        setLinkedTaskName(taskName);
        setIsActive(true);
        setIsPaused(false);
        setIsExpanded(true);
    }, []);

    const pause = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPaused(true);
    }, []);

    const resume = useCallback(() => {
        setIsPaused(false);
    }, []);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        localStorage.removeItem(STORAGE_KEY);
        setIsActive(false);
        setIsPaused(false);
        setTimeRemaining(0);
        setLinkedTaskId(null);
        setLinkedTaskName(null);
    }, []);

    const collapse = useCallback(() => {
        setIsExpanded(false);
    }, []);

    const expand = useCallback(() => {
        setIsExpanded(true);
    }, []);

    const setDuration = useCallback((duration) => {
        if (!isActive) {
            setSelectedDuration(duration);
        }
    }, [isActive]);

    const setLinkedTask = useCallback((taskId, taskName) => {
        setLinkedTaskId(taskId);
        setLinkedTaskName(taskName);
    }, []);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        isActive,
        isPaused,
        isExpanded,
        selectedDuration,
        timeRemaining,
        linkedTaskId,
        linkedTaskName,
        formattedTime: formatTime(timeRemaining),
        xpReward: XP_REWARDS[selectedDuration] || 0,
        start,
        pause,
        resume,
        stop,
        collapse,
        expand,
        setDuration,
        setLinkedTask,
        XP_REWARDS
    };
}

export default useFocusTimer;
