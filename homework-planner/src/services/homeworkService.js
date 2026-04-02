import { isFirebaseAvailable } from '../firebase';
import { FirebaseAdapter } from './adapters/FirebaseAdapter';
import { LocalStorageAdapter } from './adapters/LocalStorageAdapter';

const COLLECTION_NAME = 'homework';
const LOCAL_STORAGE_KEY = 'homework_local_data';

// Instantiate Adapters
const firebaseAdapter = new FirebaseAdapter(COLLECTION_NAME);
const localStorageAdapter = new LocalStorageAdapter(LOCAL_STORAGE_KEY);

const getAdapter = (isPremium) => {
    return (isPremium && isFirebaseAvailable) ? firebaseAdapter : localStorageAdapter;
};

export const homeworkService = {
    add: async (userId, homework, isPremium = false) => {
        const adapter = getAdapter(isPremium);

        if (!isPremium) {
            const activeCount = await adapter.getCount(userId);
            if (activeCount >= 10) {
                throw new Error('LIMIT_REACHED');
            }
        }

        return adapter.add(userId, homework);
    },

    getAll: async (userId, isPremium = false) => {
        const adapter = getAdapter(isPremium);
        return adapter.getAll(userId);
    },

    update: async (id, updates, isPremium = false) => {
        const adapter = getAdapter(isPremium);
        await adapter.update(id, updates);
    },

    delete: async (id, isPremium = false) => {
        const adapter = getAdapter(isPremium);
        await adapter.delete(id);
    },

    getCount: async (userId, isPremium = false) => {
        const adapter = getAdapter(isPremium);
        return adapter.getCount(userId);
    },

    moveToTomorrow: async (id, isPremium = false) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        await homeworkService.update(id, {
            dueDate: tomorrow.toISOString()
        }, isPremium);

        return tomorrow;
    },

    reschedule: async (id, newDate, isPremium = false) => {
        await homeworkService.update(id, {
            dueDate: newDate.toISOString()
        }, isPremium);

        return newDate;
    }
};
