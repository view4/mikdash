// IMPROVEMENT: Use node: protocol for built-in imports (Node 14.18+) for explicitness and consistency with utils/server.js.
import http from "node:http";
import url from "node:url";
import { StringDecoder } from "node:string_decoder";
import { getIn } from "./utils/object.js";

const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PATCH",
    "Access-Control-Max-Age": 2592000,
    "Access-Control-Allow-Headers": "*",
};

class Server {
    constructor({ headers = defaultHeaders, port = 7000, ...props }) {
        this.routes = props.routes ?? {};
        this.headers = headers;
        this.port = port;
        this.onLoad = props.onLoad;
        this.rootPath = props.rootPath ?? [];
        this.init();
    }

    httpServer = http.createServer(async (req, res) => {
        const { route, paths } = await this.processRequest(req, res);

        if (!route) return;

        const decoder = new StringDecoder("utf-8");
        let buffer = "";

        req.on("data", (data) => {
            buffer += decoder.write(data);
        });

        req.on("end", () => {
            buffer += decoder.end();
            route(
                {
                    paths,
                    headers: req.headers,
                    method: req.method,
                    url: req.url,
                    query: req.query,
                    body: buffer,
                },
                res
            );
        });
    });

    processors = [];

    handleProcessors = async (req, res) => {
        await Promise.all(
            this.processors.map(async (func) => {
                await func(req, res);
            })
        );
    };

    parseFallbackRoute = (_paths, method) => {
        const paths = _paths.slice();
        paths.pop();
        const route = getIn(this.routes, [...paths, "*", method]);
        if (!route && !!paths.length) return this.parseFallbackRoute(paths, method);
        if (route) return route;
        return null;
    };

    getRoute = (paths, method) => {
        return getIn(this.routes, [...paths, method]) || this.parseFallbackRoute(paths, method);
    };

    parseRoute = (pathname, method) => {
        const paths = pathname
            .split("/")
            .filter((path) => !!path.length && !this.rootPath.includes(path));
        const route = this.getRoute(paths, method);
        return { route, paths };
    };

    init = () => {
        this.httpServer.listen(this.port, () => {
            console.log("this server is listening on ", this.port);
            // IMPROVEMENT: Only call onLoad when provided, avoiding TypeError when onLoad is undefined.
            if (this.onLoad) this.onLoad(this);
        });
    };

    processRequest = async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        req.query = parsedUrl.query;
        const pathname = parsedUrl.pathname;
        const method = req.method.toLowerCase();
        const { route, paths } = this.parseRoute(pathname, method);

        if (!route) {
            // IMPROVEMENT: Send 404 and apply CORS headers when no route matches, so clients get a proper response instead of an empty 200.
            res.statusCode = 404;
            Object.entries(this.headers).forEach(([key, val]) => res.setHeader(key, val));
            res.end();
            return { route: null, paths };
        }

        this.setRes(res);
        await this.handleProcessors(req, res);
        return { route, paths };
    };

    setRes = (res) => {
        res.statusCode = 200;
        Object.entries(this.headers).forEach(([key, val]) => res.setHeader(key, val));
    };

    utilise = (func) => {
        this.processors.push(func);
    };

    registerRoutes = (routes) => (this.routes = { ...this.routes, ...routes });
}

export { Server };
export default Server;

export { KeyRouteHandler } from "./handlers/KeyRouteHandler.js";
export { getHandlerByKey, createKeyRouteDispatcher } from "./utils/keyRoute.js";
