/**
 * Base class for key-based route handlers. Each handler owns one route key
 * (e.g. 'members' or 'something.detail') and handles read, write, update, delete
 * via methods or optional resolvers. Extend and override methods, or pass
 * resolvers in the constructor.
 */
export class KeyRouteHandler {
    constructor(options = {}) {
        this.resolvers = options.resolvers ?? {};
    }

    async list(payload, context) {
        if (this.resolvers.list) return this.resolvers.list(payload, context);
        return null;
    }

    async read(payload, context) {
        console.log("read payload....", payload)
        if (this.resolvers.read) return this.resolvers.read(payload, context);
        return null;
    }

    async write(payload, context) {
        if (this.resolvers.write) return this.resolvers.write(payload, context);
        return null;
    }

    async update(payload, context) {
        if (this.resolvers.update) return this.resolvers.update(payload, context);
        return null;
    }

    async delete(payload, context) {
        if (this.resolvers.delete) return this.resolvers.delete(payload, context);
        return null;
    }
}
