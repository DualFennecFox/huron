const { EmbedBuilder } = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldMessage, newMessage) => {
    let client = newMessage.client

    Guild.findOne({ guildID: newMessage.guild.id }).then(async doc => {
        if (!doc) return
        if (doc.log.messageUpdate == true) {
          if (!doc.LogChannel) return
          let Channel = newMessage.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(newMessage.guild.members.me).has("SEND_MESSAGES")) return
          if (newMessage.author.id === client.user.id) return

    let content = false

    if (oldMessage.content != newMessage.content) {
        content = true
    }

    if (content == false) return

    const embed = new EmbedBuilder()
    .setAuthor({ name: "Mensaje Editado", value: newMessage.author.displayAvatarURL({ format: "png", dynamic: true}) })
    .setColor("#FF0000")
    .setDescription(`**De:** <@!${newMessage.author.id}>\n\n**Antes:** ${oldMessage.content}\n**Después:** ${newMessage.content}`)
    .setFooter({ text: `${newMessage.author.tag} | ${newMessage.author.id}` })

    Channel.send({ embeds: [embed] })
}
}).catch(err => {
    console.error(err)
})
}