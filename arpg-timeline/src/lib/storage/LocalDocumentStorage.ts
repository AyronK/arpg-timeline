import { DocumentStorage } from "./DocumentStorage";

export class LocalDocumentStorage extends DocumentStorage {
    constructor() {
        if (!localStorage) {
            throw new Error("Local storage is unavailable in current environment.");
        }
        super(window.localStorage);
    }
}
