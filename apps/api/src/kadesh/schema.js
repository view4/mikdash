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
        // check contains and logic for string search
        if (search?.trim()?.length) return res.filter(entity => entity.kadesh.toLowerCase().includes(search.toLowerCase()))
        return res
    }
}