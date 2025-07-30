import { DocumentStorage } from "./DocumentStorage";

export class SessionDocumentStorage extends DocumentStorage {
    constructor() {
        if (typeof sessionStorage === "undefined" || !sessionStorage) {
            throw new Error("Session storage is unavailable in current environment.");
        }
        super(sessionStorage);
    }
}
