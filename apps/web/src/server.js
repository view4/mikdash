

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
// import { Server } from "@mikdash/server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;

export const createServer = (func) => {
    return http.createServer((req, res) => {
        func(req, res);
    });
};

// Get the workspace root (3 levels up from this file)
const workspaceRoot = path.resolve(__dirname, '../../..');

class Server {
    constructor({ port = 7000, routes, handler, ...props}){
        this.port = port;
        this.server = this.init(handler)
    }
    init(handler) {
        return createServer((req, res) => {
            handler(req, res)
        })
    }

    start () {
        this.server.listen(this.port, () => {
            console.log("listening on port, ", this.port)
        })
    }
}

const server =new Server({
    port: PORT,
    handler: (req, res) => {
        let filePath;
        
        // Default to index.html for root path
        if (req.url === '/') {
            filePath = path.join(__dirname, 'index.html');
        } 
        // Serve package files from workspace root
        else if (req.url.startsWith('/packages/')) {
            filePath = path.join(workspaceRoot, req.url);
        }
        // Serve app files from current directory
        else {
            filePath = path.join(__dirname, req.url);
        }

        // Security: prevent directory traversal
        const normalizedPath = path.normalize(filePath);
        if (!normalizedPath.startsWith(__dirname) && !normalizedPath.startsWith(path.join(workspaceRoot, 'packages'))) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }

        const extname = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
        };

        const contentType = contentTypes[extname] || 'text/plain';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end(`File not found: ${req.url}`);
                } else {
                    res.writeHead(500);
                    res.end('Server error: ' + err.code);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.start();
