import { KeyRouteHandler } from "@mikdash/server";
import { Korech } from "./schema.js";
import { Kadesh } from "../kadesh/schema.js";
import { calculateServiceStatus } from "./utilities.js";

const store = new Korech();
const kadeshStore = new Kadesh();

export const korechHandler = new KeyRouteHandler({
    resolvers: {
        write: async (payload) => {
            let res;
            if (!payload.id) res = await store.write(payload);
            res = await store.update(payload.id, payload);
            const serviceStatus = calculateServiceStatus(payload)
            kadeshStore.update(payload.kadeshId, {
                metadata: {
                    serviceStatus: serviceStatus.serviceStatus,
                    lastServiceAt: serviceStatus.lastServiceAt
                }
            })
            return res;
        },
        read: async (payload) => {
            const entries = await store.list();
            const korech = entries?.find((entry) => entry.kadeshId === payload.kadeshId);
            return korech ?? null;
        }
    }
})