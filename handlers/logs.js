const { readdirSync } = require("fs");

module.exports = (client) => {
        const commands = readdirSync(`./logs/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`../logs/${file}`);
    
            if (pull.name) {
                client.log.set(pull.name, pull);
            } else {
                continue;
            }
        }
    console.log("Se han cargado los logs");
}