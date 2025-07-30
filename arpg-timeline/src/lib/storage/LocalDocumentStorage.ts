import { DocumentStorage } from "./DocumentStorage";


export class LocalDocumentStorage extends DocumentStorage {
    constructor() {
        if (typeof localStorage === "undefined" || !localStorage) {
            throw new Error("Local storage is unavailable in current environment.");
        }
        super(localStorage);
    }
}
