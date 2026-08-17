import { KeyRouteHandler } from "@mikdash/server";
import { Korech } from "./schema.js";

const store = new Korech();

export const korechHandler = new KeyRouteHandler({
    resolvers: {
        write: (payload) => store.write(payload),
        read: async (payload) => {
            const entries = await store.list();
            const korech = entries?.find((entry) => entry.kadeshId === payload.kadeshId);
            return korech ?? null;
        }
    }
})