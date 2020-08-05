const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async message => {
    let client = message.first().client

    Guild.findOne({ guildID: message.first().guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.messageDeleteBulk == true) {
          if (!doc.LogChannel) return
          let Channel = message.first().guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(message.first().guild.me).has("SEND_MESSAGES")) return

    let messages = message.array().map(msg => msg.content).join("\n")

    const embed = new Discord.MessageEmbed()
    .setAuthor("Mensajes Eliminados", message.first().guild.iconURL())
    .setColor("#FF0000")
    .setFooter(`${message.first().guild.name} | ${message.first().guild.id}`)
    .setDescription(`**En:** <#${message.first().channel.id}>\n\n${messages}`)

    Channel.send({ embed })
    }
}).catch(err => {
    console.error(err)
})
}