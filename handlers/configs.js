const { readdirSync } = require("fs");

module.exports = (client) => {
        const commands = readdirSync("./configs/").filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`../configs/${file}`);
    
            if (pull.name) {
                client.configs.set(pull.name, pull);
            } else {
                continue;
            }
        }
    console.log("Se han cargado las configuraciones");
}