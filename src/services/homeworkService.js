import { db, isFirebaseAvailable } from '../firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

const COLLECTION_NAME = 'homework';
const LOCAL_STORAGE_KEY = 'homework_local_data';

export const homeworkService = {
    // Feature: Unlimited Tasks Protection (StudyNext Pro)
    add: async (userId, homework, isPremium = false) => {
        // Enforce limit for Free users
        if (!isPremium) {
            const activeCount = await homeworkService.getCount(userId, false);
            if (activeCount >= 10) {
                throw new Error('LIMIT_REACHED');
            }
        }

        const useCloud = isPremium && isFirebaseAvailable;

        if (useCloud) {
            try {
                const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                    userId,
                    ...homework,
                    createdAt: serverTimestamp(),
                    isCompleted: false
                });
                return docRef.id;
            } catch (error) {
                console.error("Error adding homework to Firebase: ", error);
                throw error;
            }
        } else {
            // Local Storage (Free tier or Firebase down)
            const currentData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
            const newItem = {
                id: Date.now().toString(),
                userId,
                ...homework,
                createdAt: new Date().toISOString(),
                isCompleted: false
            };
            currentData.push(newItem);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
            return newItem.id;
        }
    },

    // Get all homework for a user
    getAll: async (userId, isPremium = false) => {
        if (!userId) return [];
        const useCloud = isPremium && isFirebaseAvailable;

        if (useCloud) {
            try {
                const q = query(
                    collection(db, COLLECTION_NAME),
                    where("userId", "==", userId)
                );

                const querySnapshot = await getDocs(q);
                const results = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                return results.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            } catch (error) {
                console.error("Error getting homework from Firebase: ", error);
                throw new Error("SERVER_ERROR: " + error.message);
            }
        } else {
            // Local Storage (Free tier)
            let currentData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

            // Enforce 30-day history limit for FREE users
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            return currentData
                .filter(item => {
                    const isUserTask = item.userId === userId;
                    if (!isUserTask) return false;

                    // Keep active tasks, but hide completed tasks older than 30 days
                    if (!item.isCompleted) return true;
                    return new Date(item.createdAt) >= thirtyDaysAgo;
                })
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
    },

    // Update homework
    update: async (id, updates, isPremium = false) => {
        const useCloud = isPremium && isFirebaseAvailable;

        if (useCloud) {
            try {
                const docRef = doc(db, COLLECTION_NAME, id);
                await updateDoc(docRef, updates);
            } catch (error) {
                console.error("Error updating homework: ", error);
                throw error;
            }
        } else {
            const currentData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
            const index = currentData.findIndex(item => item.id === id);
            if (index !== -1) {
                currentData[index] = { ...currentData[index], ...updates };
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
            }
        }
    },

    // Delete homework
    delete: async (id, isPremium = false) => {
        const useCloud = isPremium && isFirebaseAvailable;

        if (useCloud) {
            try {
                await deleteDoc(doc(db, COLLECTION_NAME, id));
            } catch (error) {
                console.error("Error deleting homework: ", error);
                throw error;
            }
        } else {
            const currentData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
            const filteredData = currentData.filter(item => item.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredData));
        }
    },

    // Get active count for limits
    getCount: async (userId, isPremium = false) => {
        const all = await homeworkService.getAll(userId, isPremium);
        return all.filter(h => !h.isCompleted).length;
    }
};
