const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldMessage, newMessage) => {

    Guild.findOne({ guildID: newMessage.guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.messageUpdate == true) {
          if (!doc.LogChannel) return
          let Channel = newMessage.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(newMessage.guild.me).has("SEND_MESSAGES")) return

    let content = false

    if (oldMessage.content != newMessage.content) {
        content = true
    }

    if (content == false) return

    const embed = new Discord.MessageEmbed()
    .setAuthor("Mensaje Editado", newMessage.author.displayAvatarURL({ format: "png", dynamic: true}))
    .setColor("#FF0000")
    .setDescription(`**De:** <@!${newMessage.author.id}>\n\n**Antes:** ${oldMessage.content}\n**Después:** ${newMessage.content}`)
    .setFooter(`${newMessage.author.tag} | ${newMessage.author.id}`)

    Channel.send({ embed })
}
}).catch(err => {
    console.error(err)
})
}