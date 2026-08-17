import { getIn } from "./object.js";

const ACTIONS = ["read", "write", "update", "delete"];

/**
 * Resolve a handler from the tree by route key (e.g. 'members' or 'something.detail').
 * Keys are split by '.' and traversed into the tree.
 * @param {object} handlerTree - Nested map of key segments to handler instances
 * @param {string} routeKey - Dot-separated key, e.g. 'something.detail'
 * @returns {object|null} Handler instance or null
 */
export function getHandlerByKey(handlerTree, routeKey) {
    if (!routeKey || typeof routeKey !== "string") return null;
    const path = routeKey.split(".").filter(Boolean);
    const handler = getIn(handlerTree, path);
    return handler && typeof handler.read === "function" ? handler : null;
}

/**
 * Returns a route function for the Server that dispatches to the handler tree.
 * Expects request body (JSON): { route: string, action: 'read'|'write'|'update'|'delete', payload?: object }.
 * Sends JSON responses and sets Content-Type: application/json.
 * @param {object} handlerTree - Tree of KeyRouteHandler instances keyed by route key segments
 * @param {object} options - Optional: { bodyKey: 'payload' } etc.
 * @returns {(ctx: object, res: import('http').ServerResponse) => Promise<void>}
 */
export function createKeyRouteDispatcher(handlerTree, options = {}) {
    return async (ctx, res) => {
        let body = {};
        try {
            body = typeof ctx.body === "string" ? JSON.parse(ctx.body || "{}") : ctx.body ?? {};
        } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid JSON body" }));
            return;
        }

        const { route: routeKey, action, payload = {} } = body;

        if (!routeKey) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Missing route key" }));
            return;
        }

        if (!ACTIONS.includes(action)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid action", allowed: ACTIONS }));
            return;
        }

        const handler = getHandlerByKey(handlerTree, routeKey);
        
        if (!handler) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "No handler for route", route: routeKey }));
            return;
        }

        const context = {
            headers: ctx.headers,
            method: ctx.method,
            url: ctx.url,
            query: ctx.query,
        };

        try {
            const result = await handler[action](payload, context);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result ?? { ok: true }));
        } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err.message ?? "Internal error" }));
        }
    };
}
