import * as path from "path";
import { fileURLToPath } from "url";
import { Document } from "@mikdash/data-storage";
import { promises as fs } from "fs";


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
        if (!data.entryId) return this.create(data)
        if (data.entryId) return this.update(data);
    }

    async generate(kadeshId, data) {
        console.log("data, ..",data)
        const filePath = this._filePath(kadeshId);
        const document = {
            id: crypto.randomUUID(),
            kadeshId,
            entries: [
                {
                    urchatz: data.urchatz,
                    entryId: crypto.randomUUID(),
                    direction: data.direction
                }
            ]
        }
        await fs.writeFile(filePath, JSON.stringify(document, null, 2), "utf-8");
        return document;
    }


    async create(data) {
        console.log("create...", data)
        const kadeshId = data.kadeshId;
        const existingFile = await this.read(kadeshId);
        if (!existingFile) return this.generate(kadeshId, data);
        const document = {
            ...existingFile,
            entries: [
                ...existingFile.entries,
                {
                    urchatz: data.urchatz,
                    entryId: crypto.randomUUID(),
                    direction: data.direction,
                    createdAt: new Date().toISOString()
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