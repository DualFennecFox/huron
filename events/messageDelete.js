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

        let msg = ""
        if (message.embeds) {
            message.embeds.forEach((embeds) => {
            if (embeds.description) msg = `**Descripción:** ${embeds.description}\n`
            if (embeds.field) {
               let field = embeds.fields.map(field => field.name).join("\n")
                msg + ` **Campos:** ${field}`
             }
             if (embeds.footer) msg + ` **Pie:** ${embeds.footer}`
             if (embeds.image) {
                 msg + ` **Imagen:** [URL](${embeds.image.url})`
             }
            })
        }
        else msg = message.content

        const embed = new Discord.MessageEmbed()
        .setAuthor("Mensaje Eliminado", message.guild.iconURL())
        .setColor("#FF0000")
        .setDescription(`**En:** <#${message.channel.id}>\n\n${msg}\n\n**Creado:**${checkDays(message.createdAt)}`)
        .setFooter(`De: ${message.author.tag} | ${message.author.id}`)

    Channel.send({ embed })
    }
}).catch(err => {
    console.error(err)
})
}