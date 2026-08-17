import { KeyRouteHandler } from "@mikdash/server";
import { ExampleDocument } from "./example-store.js";

const store = new ExampleDocument();

/**
 * Handler for route key 'example'. Resolvers delegate to ExampleDocument (apps/api/data).
 * Payloads: read/delete { id }, write { title?, done? }, update { id, ...fields }.
 */
export const exampleHandler = new KeyRouteHandler({
    resolvers: {
        read: async (payload) => {
            if (payload?.id) return store.read(payload.id);
            const ids = await store.list(payload);
            const items = await Promise.all(ids.map((id) => store.read(id)));
            return { items };
        },
        write: async (payload) => store.write(payload),
        update: async (payload) => {
            const { id, ...data } = payload;
            if (!id) throw new Error("update requires payload.id");
            return store.update(id, data);
        },
        delete: async (payload) => {
            if (!payload?.id) throw new Error("delete requires payload.id");
            const ok = await store.delete(payload.id);
            return { deleted: ok };
        },
    },
});
