export interface IDocumentStorage {
    get<T>(key: string): T | null;
    key<T>(index: number): T | null;
    delete(key: string): void;
    set<T>(key: string, value: T): void;
}
