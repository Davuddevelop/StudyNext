import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { differenceInHours, differenceInDays, parseISO } from 'date-fns';

export function useReminders() {
    const { currentUser, isPremium } = useAuth();

    useEffect(() => {
        if (!currentUser || !isPremium) return;

        // Request permission if not granted
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const checkReminders = async () => {
            if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

            try {
                // Fetch active tasks
                const tasks = await homeworkService.getAll(currentUser.uid, true);
                const activeTasks = tasks.filter(t => !t.isCompleted);

                const now = new Date();
                const notifiedKey = `notified_tasks_${currentUser.uid}`;
                const notifiedMap = JSON.parse(localStorage.getItem(notifiedKey) || '{}');
                let updated = false;

                activeTasks.forEach(task => {
                    const dueDate = parseISO(task.dueDate);
                    const hoursDiff = differenceInHours(dueDate, now);
                    const daysDiff = differenceInDays(dueDate, now);

                    // 1 Day Before Reminder (approx 24h)
                    // Check if due tomorrow (e.g. between 23 and 25 hours away to be specific? 
                    // Or simply 'daysDiff === 1' logic which might be midnight based depending on date-fns)
                    // Let's use hours > 20 && hours < 28 for "1 day before"ish

                    // Logic: 24 Hours Alert
                    if (hoursDiff >= 23 && hoursDiff <= 25 && !notifiedMap[task.id]?.dayBefore) {
                        sendNotification(`Upcoming Task: ${task.subject}`, `"${task.title}" is due tomorrow!`);
                        notifiedMap[task.id] = { ...notifiedMap[task.id], dayBefore: true };
                        updated = true;
                    }

                    // 2 Hours Alert
                    if (hoursDiff >= 0 && hoursDiff <= 2 && !notifiedMap[task.id]?.twoHours) {
                        sendNotification(`Hurry! Assignments Due`, `"${task.title}" is due in less than 2 hours!`);
                        notifiedMap[task.id] = { ...notifiedMap[task.id], twoHours: true };
                        updated = true;
                    }
                });

                if (updated) {
                    localStorage.setItem(notifiedKey, JSON.stringify(notifiedMap));
                }

            } catch (error) {
                console.error("Error checking reminders:", error);
            }
        };

        // Check immediately and then every 15 minutes
        checkReminders();
        const interval = setInterval(checkReminders, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, [currentUser, isPremium]);

    function sendNotification(title, body) {
        new Notification("StudyNext Reminders", {
            body: `${title}\n${body}`,
            icon: '/mascot.png',
            badge: '/mascot.png'
        });
    }
}
