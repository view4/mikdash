import * as path from "path";
import { fileURLToPath } from "url";
import { Document } from "@mikdash/data-storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Example: extend Document with a custom dir and entity shape.
 * Writes to apps/api/data.
 */
export class ExampleDocument extends Document {
  constructor() {
    super({
      dir: path.join(__dirname, "..", "data"),
      shape: {
        title: "string",
        done: "boolean",
      },
    });
  }
}
