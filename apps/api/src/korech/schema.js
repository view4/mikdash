import * as path from "path";
import { fileURLToPath } from "url";
import { Document } from "@mikdash/data-storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Korech extends Document {
    constructor() {
        super({
            dir: path.join(__dirname, "../..", "data", "korech"),
            shape: {
                "kadeshId": "string",
                "altar": {
                    "content": "string",
                    "sides": {
                        "north": "string",
                        "east": "string",
                        "south": "string",
                        "west": "string"
                    }
                }
            }
        })
    }

    async write(payload) {
        if (!payload.id) return super.write(payload);
        return super.update(payload.id, payload);
    }
}