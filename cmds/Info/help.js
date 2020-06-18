const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

    module.exports = {
    name: "help",
    aliases: ['Help', 'HELP'],
    category: "Info",
    description: 'Te dice todos los comandos del bot o uno en específico',
    usage: '!help',
    examples: ["!help", "!help ping"],
    run: async (client, message, args) => {
    if (args[0]) {
        return getCMD(client, message, args[0]);
    } else {
    getAll(client, message);
}


function getAll(client, message) {
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        
const commands = (category) => {
    return client.commands
        .filter(cmd => cmd.category === category)
        .map(cmd => `- \`${cmd.name}\``)
        .join("\n");
} 

const info = client.categories
            .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
            .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}
 
function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    // Get the cmd by the name or alias
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `No hay información para el comando **${input.toLowerCase()}**`;

    // If no cmd is found, send not found embed
    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    // Add all cmd info to the embed
    if (cmd.name) info = `**Nombre del comando**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Descripción**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Uso**: ${cmd.usage}`;
    if (cmd.examples) info += `\n**Ejemplos**: ${cmd.examples.map(a => `\`${a}\``).join(", ")}`;
    }

    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}
    }
}