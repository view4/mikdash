import * as path from "path";
import { fileURLToPath } from "url";
import { Document } from "@mikdash/data-storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Kadesh extends Document {
    constructor() {
        super({
            dir: path.join(__dirname, "../..", "data", "kadesh"),
            shape: {
                "kadesh": "string"
            }
        })
    }
}