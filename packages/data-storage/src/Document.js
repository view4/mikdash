import { promises as fs } from "fs";
import * as path from "path";

/**
 * Base class for document-based JSON storage.
 * One file per entity (e.g. {id}.json). Extend and set `dir` and optional `shape`.
 */
export class Document {
  constructor(options = {}) {
    this.dir = options.dir ?? path.join(process.cwd(), "data");
    this.shape = options.shape ?? null;
  }

  async _ensureDir() {
    await fs.mkdir(this.dir, { recursive: true });
  }

  _filePath(id) {
    return path.join(this.dir, `${id}.json`);
  }

  async read(id) {
    await this._ensureDir();
    const filePath = this._filePath(id);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      if (err.code === "ENOENT") return null;
      throw err;
    }
  }

  async write(data) {
    await this._ensureDir();
    const id = data.id ?? crypto.randomUUID();
    const now = new Date().toISOString();
    const doc = {
      ...data,
      id,
      createdAt: data.createdAt ?? now,
      updatedAt: data.updatedAt ?? now,
    };
    const filePath = this._filePath(id);
    await fs.writeFile(filePath, JSON.stringify(doc, null, 2), "utf-8");
    return doc;
  }

  async update(id, data) {
    const existing = await this.read(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const doc = {
      ...existing,
      ...data,
      id,
      updatedAt: now,
    };
    const filePath = this._filePath(id);
    await fs.writeFile(filePath, JSON.stringify(doc, null, 2), "utf-8");
    return doc;
  }

  async delete(id) {
    const filePath = this._filePath(id);
    try {
      await fs.unlink(filePath);
      return true;
    } catch (err) {
      if (err.code === "ENOENT") return false;
      throw err;
    }
  }

  async listIds() {
    await this._ensureDir();
    const entries = await fs.readdir(this.dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => e.name.replace(/\.json$/, ""));
  }

  async list() {
    const ids = await this.listIds();
    // return all not just ids, return full entities... 
    return Promise.all(ids.map((id) => this.read(id)));
  }
}
