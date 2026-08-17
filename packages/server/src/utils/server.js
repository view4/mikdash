import http from "node:http";

export const createServer = (func) => {
    return http.createServer((req, res) => {
        func(req, res);
    });
};