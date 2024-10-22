/**
 * @file A very light weight server to handle content delivery
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const query = require('./query.js');


// Default port to 8080, or supply the number with, e.g., `node index.js 5000`
const port = process.argv[2] || 8080;

const server = (port) => {
    const app = express();
    const server = http.createServer(app).listen(port, () => {
        console.log(`Server listening on port ${port}\n`);
    });

    app.use(express.static(__dirname));
    app.use(cors({ credentials: true, origin: '*' }));
    app.use(bodyParser.json());

    openBrowser(`http://localhost:${port}/index.html`);

    app.get('/index', async (req, res) => {
        console.log('Received request, querying blockchain...');

        try {
            const protocol = req.query.protocol;
            const address = req.query.address;

            const queryData = await query(protocol, address);
    
            console.log('Received blockchain data, delivering data to user...\n');
            
            res.json(queryData);
        } catch (error) {
            console.error(error);
            next(error);
        }
    });

    return server;
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