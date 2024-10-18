/**
 * @file The entry point of the package, creates a simple server to handle requests
 */

const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

// Default port to 8080, or supply the number with, e.g., `node index.js 5000`
const port = process.argv[2] || 8080;

const server = (port) => {
    const app = express();
    const server = http.createServer(app).listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

    app.use(express.static(__dirname));
    app.use(cors({ credentials: true, origin: '*' }));
    app.use(bodyParser.json());

    openBrowser(`http://localhost:${port}/index.html`);
}

const openBrowser = (url) => {
    switch (process.platform) {
        case 'win32':
            exec(`start ${url}`, handleError);

        case 'darwin':
            exec(`open ${url}`, handleError);

        case 'linux':
            exec('command -v xdg-open', (xdgError) => {
                if (!xdgError) {
                    exec(`xdg-open ${url}`, handleError);
                } else {
                    exec('command -v wslview', (wsluError) => {
                        if (!wsluError) {
                            exec(`wslview ${url}`, handleError);
                        } else {
                            console.log(`No program installed to automatically open browser\n Open a browser and go to ${url}`)
                        }
                    })
                }
            });
    }

    const handleError = (error) => {
        if (error) {
            console.log(`Failed to automatically open web browser\n Open a browser and go to ${url}`);
        }
    }
}

server(port);