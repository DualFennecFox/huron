const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async role => {

    let client = role.client
    Guild.findOne({ guildID: role.guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.roleDelete == true) {
          if (!doc.LogChannel) return
          let Channel = role.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(role.guild.me).has("SEND_MESSAGES")) return

          const embed = new Discord.MessageEmbed()
          .setAuthor("Rol Eliminado", role.guild.iconURL())
          .setColor("#FF0000")
          .setFooter(`${role.name} | ${role.id}`)
          .setDescription(`${role.name} \n\n**Posición:** ${role.position}\n**Creado:**${checkDays(role.createdAt)}`)
          
          Channel.send({ embed })
        }
}).catch(err => {
    console.error(err)
})
    }