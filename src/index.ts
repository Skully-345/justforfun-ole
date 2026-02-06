// This is the entry point of the TypeScript application. 
// You can add your main logic or functionality here.

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const PORT = 3000;

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, '../public/index.html');
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});