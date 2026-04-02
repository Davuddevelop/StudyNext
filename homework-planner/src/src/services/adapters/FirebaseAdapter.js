import { db } from '../../firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { StorageAdapter } from './StorageAdapter';

export class FirebaseAdapter extends StorageAdapter {
    constructor(collectionName) {
        super();
        this.collectionName = collectionName;
    }

    async add(userId, item) {
        const docRef = await addDoc(collection(db, this.collectionName), {
            userId,
            ...item,
            createdAt: serverTimestamp(),
            isCompleted: false
        });
        return docRef.id;
    }

    async getAll(userId) {
        if (!userId) return [];
        const q = query(
            collection(db, this.collectionName),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return results.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    async update(id, updates) {
        const docRef = doc(db, this.collectionName, id);
        await updateDoc(docRef, updates);
    }

    async delete(id) {
        await deleteDoc(doc(db, this.collectionName, id));
    }

    async getCount(userId) {
        const all = await this.getAll(userId);
        return all.filter(h => !h.isCompleted).length;
    }
}
