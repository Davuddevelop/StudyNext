import { StorageAdapter } from './StorageAdapter';

export class LocalStorageAdapter extends StorageAdapter {
    constructor(storageKey, freeTierDaysLimit = 30) {
        super();
        this.storageKey = storageKey;
        this.freeTierDaysLimit = freeTierDaysLimit;
    }

    async add(userId, item) {
        const currentData = await this._getData();
        const newItem = {
            id: Date.now().toString(),
            userId,
            ...item,
            createdAt: new Date().toISOString(),
            isCompleted: false
        };
        currentData.push(newItem);
        await this._saveData(currentData);
        return newItem.id;
    }

    async getAll(userId) {
        if (!userId) return [];
        let currentData = await this._getData();

        // Enforce history limit for FREE users in local storage
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - this.freeTierDaysLimit);

        return currentData
            .filter(item => {
                if (item.userId !== userId) return false;
                if (!item.isCompleted) return true;
                return new Date(item.createdAt) >= limitDate;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    async update(id, updates) {
        const currentData = await this._getData();
        const index = currentData.findIndex(item => item.id === id);
        if (index !== -1) {
            currentData[index] = { ...currentData[index], ...updates };
            await this._saveData(currentData);
        }
    }

    async delete(id) {
        const currentData = await this._getData();
        const filteredData = currentData.filter(item => item.id !== id);
        await this._saveData(filteredData);
    }

    async getCount(userId) {
        const all = await this.getAll(userId);
        return all.filter(h => !h.isCompleted).length;
    }

    async _getData() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    async _saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
}
