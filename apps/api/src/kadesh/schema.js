import * as path from "path";
import { fileURLToPath } from "url";
import { Document } from "@mikdash/data-storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Kadesh extends Document {
    constructor() {
        super({
            dir: path.join(__dirname, "../..", "data", "kadesh"),
            shape: {
                "kadesh": "string",
                "metadata": {
                    "serviceStatus": "string",
                    "lastServiceAt": "string"
                }
            }
        })
    }

    async list(payload) {
        const { search } = payload;
        const res = await super.list();
        if (search?.trim()?.length) return res.filter(entity => entity.kadesh.toLowerCase().includes(search.toLowerCase()))
        return res
    }

    async updateMetadata(id, payload) {
        const kadesh = await this.get(id);
        if (!kadesh) throw new Error("Kadesh not found");
        return this.update(id, {
            metadata: {
                ...kadesh.metadata,
                ...payload
            }
        });
    }
}