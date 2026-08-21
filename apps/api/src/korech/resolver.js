import { KeyRouteHandler } from "@mikdash/server";
import { Korech } from "./schema.js";
import { Kadesh } from "../kadesh/schema.js";
import { calculateServiceStatus } from "./utilities.js";

const store = new Korech();
const kadeshStore = new Kadesh();

export const korechHandler = new KeyRouteHandler({
    resolvers: {
        write: async (payload) => {
            const res = await store.write(payload);
            await kadeshStore.updateMetadata(payload.kadeshId, calculateServiceStatus(payload));
            return res;
        },
        read: async (payload) => {
            const entries = await store.list();
            const korech = entries?.find((entry) => entry.kadeshId === payload.kadeshId);
            return korech ?? null;
        }
    }
})