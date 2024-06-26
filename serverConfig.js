const fs = require('fs');

function getServerConfig(configPath) {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent.replace(/low\./g, ''));
    
    if (!config.port) {
        throw new Error('Server port not specified in the configuration file');
    }

    return config;
}

module.exports = {
    getServerConfig
};
