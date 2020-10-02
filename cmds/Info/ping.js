const Discord = require("discord.js")

  module.exports = {
    name : 'ping',
    category: "Info",
    description : 'Un comando básico que sirve para probar el bot, si escribes "!ping" este dira "Pong"',
    usage: '!ping',
   run: async (client, message, args) => {

    const embed = new Discord.MessageEmbed()
    .setAuthor("Pong!", message.author.displayAvatarURL({ size: 2048, format: "png", dynamic: true }))
    .setColor("#FF0000")
    .addField("Ping de mensajes", `${Date.now() - message.createdTimestamp}ms`, true)
    .addField("Ping de DiscordAPI", `${Math.round(client.ws.ping)}ms`, true)

    message.channel.send(embed)
}
}