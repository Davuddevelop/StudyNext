import { db, isFirebaseAvailable } from '../firebase';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    query,
    orderBy,
    limit,
    getDocs,
    collection,
    writeBatch
} from 'firebase/firestore';
import { differenceInCalendarDays } from 'date-fns';


const COLLECTION = 'users';

export const userService = {
    // Get user profile or create default if not exists
    getProfile: async (user) => {
        if (!user) return null;

        // Local Fallback
        if (!isFirebaseAvailable) {
            const localProfile = localStorage.getItem(`user_profile_${user.uid}`);
            if (localProfile) return JSON.parse(localProfile);

            const defaultProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Student',
                photoURL: '',
                plan: 'free',
                xp: 0,
                level: 1,
                streak: 0,
                lastActive: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
            localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(defaultProfile));
            return defaultProfile;
        }

        // Firebase Logic
        try {
            const docRef = doc(db, COLLECTION, user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                // Create new profile for new user
                const newProfile = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || 'Student',
                    photoURL: '',
                    plan: 'free',
                    xp: 0,
                    level: 1,
                    streak: 0,
                    lastActive: new Date().toISOString(),
                    createdAt: serverTimestamp()
                };
                await setDoc(docRef, newProfile);
                return newProfile;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Fallback to free on error to prevent blocking
            return { uid: user.uid, plan: 'free', xp: 0, level: 1 };
        }
    },

    // Award XP and handle leveling & streaks
    awardXP: async (uid, amount) => {
        const XP_PER_LEVEL = 1000;
        const now = new Date();

        // Local
        if (!isFirebaseAvailable) {
            const key = `user_profile_${uid}`;
            const profile = JSON.parse(localStorage.getItem(key) || '{}');

            // Streak Logic
            let newStreak = profile.streak || 0;
            const lastActive = profile.lastActive ? new Date(profile.lastActive) : null;

            if (!lastActive) {
                newStreak = 1;
            } else {
                const diffDays = differenceInCalendarDays(now, lastActive);
                if (diffDays === 1) {
                    newStreak += 1;
                } else if (diffDays > 1) {
                    newStreak = 1;
                }
                // if diffDays === 0, keep same streak (already active today)
            }

            const newXP = (profile.xp || 0) + amount;
            const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
            const didLevelUp = newLevel > (profile.level || 1);
            const streakExtended = newStreak > (profile.streak || 0);

            const updatedProfile = {
                ...profile,
                xp: newXP,
                level: newLevel,
                streak: newStreak,
                lastActive: now.toISOString()
            };
            localStorage.setItem(key, JSON.stringify(updatedProfile));
            return { didLevelUp, newLevel, streakExtended, newStreak };
        }

        // Firebase
        try {
            const docRef = doc(db, COLLECTION, uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // Fallback or create if missing during XP award
                return { didLevelUp: false, newLevel: 1, streakExtended: true, newStreak: 1 };
            }

            const profile = docSnap.data();

            // Streak Logic
            let newStreak = profile.streak || 0;
            const lastActive = profile.lastActive ?
                (profile.lastActive.toDate ? profile.lastActive.toDate() : new Date(profile.lastActive))
                : null;

            if (!lastActive) {
                newStreak = 1;
            } else {
                const diffDays = differenceInCalendarDays(now, lastActive);
                if (diffDays === 1) {
                    newStreak += 1;
                } else if (diffDays > 1) {
                    newStreak = 1;
                }
            }

            const newXP = (profile.xp || 0) + amount;
            const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
            const didLevelUp = newLevel > (profile.level || 1);
            const streakExtended = newStreak > (profile.streak || 0);

            await updateDoc(docRef, {
                xp: newXP,
                level: newLevel,
                streak: newStreak,
                lastActive: serverTimestamp()
            });

            return { didLevelUp, newLevel, streakExtended, newStreak };
        } catch (error) {
            console.error("Error awarding XP:", error);
            throw error;
        }
    },

    // Upgrade user plan
    updatePlan: async (uid, newPlan) => {
        // Local
        if (!isFirebaseAvailable) {
            const key = `user_profile_${uid}`;
            const profile = JSON.parse(localStorage.getItem(key) || '{}');
            profile.plan = newPlan;
            localStorage.setItem(key, JSON.stringify(profile));
            return true;
        }

        // Firebase
        try {
            const docRef = doc(db, COLLECTION, uid);
            await updateDoc(docRef, {
                plan: newPlan,
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error updating plan:", error);
            throw error;
        }
    },

    // Update profile fields
    updateProfile: async (uid, updates) => {
        // Local
        if (!isFirebaseAvailable) {
            const key = `user_profile_${uid}`;
            const profile = JSON.parse(localStorage.getItem(key) || '{}');
            const newProfile = { ...profile, ...updates };
            localStorage.setItem(key, JSON.stringify(newProfile));
            return true;
        }

        // Firebase
        try {
            const docRef = doc(db, COLLECTION, uid);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    },

    // Get Leaderboard (Top 50 by XP)
    getLeaderboard: async (limitCount = 50) => {
        // Local Fallback (Mock Data for Demo)
        if (!isFirebaseAvailable) {
            const currentUserKey = Object.keys(localStorage).find(k => k.startsWith('user_profile_'));
            let currentUser = currentUserKey ? JSON.parse(localStorage.getItem(currentUserKey)) : null;

            // Create some fake users for demo competition
            const mockUsers = Array.from({ length: 15 }, (_, i) => ({
                uid: `mock_${i}`,
                displayName: `Student ${i + 1}`,
                photoURL: '',
                xp: Math.floor(Math.random() * 5000),
                level: Math.floor(Math.random() * 10) + 1,
                streak: Math.floor(Math.random() * 20),
                plan: i % 5 === 0 ? 'premium' : 'free'
            }));

            // Add current user if exists
            if (currentUser) {
                mockUsers.push(currentUser);
            }

            // Sort by XP desc
            return mockUsers.sort((a, b) => b.xp - a.xp).slice(0, limitCount);
        }

        // Firebase
        try {
            const q = query(
                collection(db, COLLECTION),
                orderBy("xp", "desc"),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            // Return empty array on permission error or other failure
            return [];
        }
    },

    // Delete all user data (Mandatory for Store Approval)
    deleteUserData: async (uid) => {
        // Local
        if (!isFirebaseAvailable) {
            localStorage.removeItem(`user_profile_${uid}`);
            const currentData = JSON.parse(localStorage.getItem('homework_local_data') || '[]');
            const filteredData = currentData.filter(item => item.userId !== uid);
            localStorage.setItem('homework_local_data', JSON.stringify(filteredData));
            return true;
        }

        // Firebase
        try {
            const batch = writeBatch(db);

            // 1. Delete user profile
            batch.delete(doc(db, COLLECTION, uid));

            // 2. Delete tasks
            const q = query(collection(db, 'homework'), where("userId", "==", uid));
            const snapshot = await getDocs(q);
            snapshot.forEach((d) => {
                batch.delete(d.ref);
            });

            await batch.commit();
            return true;
        } catch (error) {
            console.error("Error deleting user data:", error);
            throw error;
        }
    }
};
