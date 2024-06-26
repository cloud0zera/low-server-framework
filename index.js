const fs = require('fs');
const path = require('path');
const express = require('express');
const { parseLowToHTML } = require('low-controllers/lowController');
const { executeLowJS } = require('low-controllers/lowJSController');
const { getServerConfig } = require('./serverConfig');

const app = express();
const configPath = path.join(__dirname, 'low.server');

if (!fs.existsSync(configPath)) {
    throw new Error('Configuration file low.server not found');
}

const serverConfig = getServerConfig(configPath);
const PORT = serverConfig.port;

// Middleware para processar arquivos .low e .lowjs
app.use((req, res, next) => {
    if (req.url.endsWith('.low')) {
        const lowFilePath = path.join(__dirname, 'src', 'view', 'lowPages', req.url);
        const outputFilePath = path.join(__dirname, 'src', 'view', 'output', req.url.replace('.low', '.html'));

        const htmlContent = parseLowToHTML(lowFilePath);

        fs.writeFile(outputFilePath, htmlContent, (err) => {
            if (err) {
                res.status(500).send('Error processing file');
                return;
            }

            res.sendFile(outputFilePath);
        });
    } else if (req.url.endsWith('.lowjs')) {
        const lowJSFilePath = path.join(__dirname, 'lowBack', req.url);
        executeLowJS(lowJSFilePath);
        res.send('LowJS executed');
    } else {
        next();
    }
});

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Inicia o servidor
app.listen(PORT, () => {
    console.log(serverConfig.message_server_on.replace('@port', PORT));
});
