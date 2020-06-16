const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags"); 

module.exports.help = {
    name: "help",
    aliases: ['Help', 'HELP'],
    description: 'Te dice todos los comandos del bot o uno en específico',
    usage: '!help',
    run: async (client, message, args) => {
        getAll(client, message);
    }
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
        map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, categories) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}
 