import { KeyRouteHandler } from "@mikdash/server";
import { Kadesh } from "./schema.js";

const store = new Kadesh();

export const kadeshHandler = new KeyRouteHandler({
    resolvers: {
        write: (payload) => store.write(payload),
        read: async (payload) => {
            const res = await store.list({
                search: payload.search
            });
            return res ;
        }
    }
})