import type { IDocumentStorage } from "./DocumentStorage.types";

export class DocumentStorage implements IDocumentStorage {
    constructor(private storage: Storage) {}

    get<T>(key: string): T | null {
        const value = this.storage.get(key);
        return value ? (JSON.parse(value) as T) : null;
    }
    key<T>(index: number): T | null {
        const value = this.storage.key(index);
        return value ? (JSON.parse(value) as T) : null;
    }
    delete(key: string): void {
        this.storage.removeItem(key);
    }
    set<T>(key: string, value: T): void {
        this.storage.setItem(key, JSON.stringify(value));
    }
}
