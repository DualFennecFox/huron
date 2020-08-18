const { getAll, getCMD } = require('../Moderacion/models/functions')
    module.exports = {
    name: "help",
    category: "Info",
    description: 'Te dice todos los comandos del bot o uno en específico',
    usage: '!help [Comando]',
    examples: ["!help", "!help ping"],
    run: async (client, message, args, prefix) => {
    if (args[0]) {
        return getCMD(client, message, args[0]);
    } else {
    getAll(client, message, prefix);
}
    }
}