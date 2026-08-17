import { KeyRouteHandler } from "@mikdash/server";
import { Kadesh } from "./schema.js";

const store = new Kadesh();

export const kadeshHandler = new KeyRouteHandler({
    resolvers: {
        write: (payload) => store.write(payload),
        read: async () => {
            // to accept args for searching here....
            const res = await store.list();
            return res ;
        }
    }
})