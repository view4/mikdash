import { KeyRouteHandler } from "@mikdash/server";
import { KadeshUrchatz } from "./schema.js";

const store = new KadeshUrchatz();

export const kadeshUrchatzHandler = new KeyRouteHandler({
    resolvers: {
        write: async (payload) => {
            const res = await store.write(payload);
            return res;
        },
        read: async (payload) => {
            console.log("payload: ", payload);
            const entries = await store.list();
            const korech = entries?.find((entry) => entry.kadeshId === payload.kadeshId);
            return korech ?? null;
        }
    }
})