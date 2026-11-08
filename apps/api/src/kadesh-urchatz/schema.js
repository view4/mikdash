import * as path from "path";
import { fileURLToPath } from "url";
import { Document } from "@mikdash/data-storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class KadeshUrchatz extends Document {
    constructor() {
        super({
            dir: path.join(__dirname, "../..", "data", "kadesh-urchatz"),
            shape: {
                "kadeshId": "string",
                "entries": [
                    {
                        "direction": "string",
                        "urchatz"/* aka intention */: "string",
                        "karpas": ["string"],
                        "yachatz": ["string"],
                        "maggid": "string",
                        "rachtzah": "string",
                        "id": "string"
                    }
                ]
            }
        })
    }

    async write(data) {
        const kadeshId = data.kadeshId;
        const id = data.id ?? crypto.randomUUID();
        const now = new Date().toISOString();
        const doc = {
            ...data,
            id,
            createdAt: data.createdAt ?? now,
            updatedAt: data.updatedAt ?? now,
        };
        const filePath = this._filePath(kadeshId);
        await fs.writeFile(filePath, JSON.stringify(doc, null, 2), "utf-8");
        return doc;
    }

    async generate(kadeshId, data) {
        const filePath = this._filePath(kadeshId);
        const document = {
            id: crypto.randomUUID(),
            kadeshId,
            entries: [
                {
                    urchatz: data.urchatz,
                    entryId: crypto.randomUUID(),
                    direction: data.directon
                }
            ]
        }
        await fs.writeFile(filePath, JSON.stringify(document, null, 2), "utf-8");
        return document;
    }


    async create(data) {
        const kadeshId = data.kadeshId;
        const existingFile = await this.read(kadeshId);
        if (!existingFile) return generate(kadeshId, data);
        const document = {
            ...existingFile, 
            entries: [
                ...existingFile.entries,
                {
                    urchatz: data.urchatz,
                    entryId: crypto.randomUUID(),
                    direction: data.directon
                }
            ]
        };
        const filePath = this._filePath(kadeshId);
        await fs.writeFile(filePath, JSON.stringify(document, null, 2), "utf-8");

        return document;
    };

    async update(data) {
        // data includes - kadeshId, partial data of entry, entryId, and optionally the direction too
    }
}