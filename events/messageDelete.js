const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async message => {
    let client = message.client
    Guild.findOne({ guildID: message.guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.messageDelete == true) {
          if (!doc.LogChannel) return
          let Channel = message.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return

        const embed = new Discord.MessageEmbed()
        .setAuthor("Mensaje Eliminado", message.guild.iconURL())
        .setColor("#FF0000")
        .setDescription(`**En:** <#${message.channel.id}>\n\n${message.content}\n\n**Creado:**${checkDays(message.createdAt)}`)
        .setFooter(`De: ${message.author.tag} | ${message.author.id}`)

    Channel.send({ embed })
    }
}).catch(err => {
    console.error(err)
})
}