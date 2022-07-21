const { EmbedBuilder } = require("discord.js")

  module.exports = {
    name : 'ping',
    category: "Info",
    description : 'Un comando básico que sirve para probar el bot, si escribes "!ping" este dira "Pong"',
    usage: '!ping',
   run: async (client, message, args) => {

    const embed = new EmbedBuilder()
    .setAuthor({name: "Pong!", iconURL: message.author.displayAvatarURL({ size: 2048, format: "png", dynamic: true })})
    .setColor("#FF0000")
    .setFields([
      {
      name: "Ping de mensajes", 
      value: `${Date.now() - message.createdTimestamp}ms`,
      inline: true
      },
      {
        name: "Ping de API",
        value: `${Math.round(client.ws.ping)}ms`,
        inline: true
      }
    ])

  message.channel.send({ embeds: [embed]})
}
}