const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays, changeRole } = require('../cmds/Moderacion/models/functions')

module.exports = async role => {
    let perms = []
    let client = role.client
    Guild.findOne({ guildID: role.guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.roleDelete == true) {
          if (!doc.LogChannel) return
          let Channel = role.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(role.guild.me).has("SEND_MESSAGES")) return

          for (const role of role.permissions.toArray()) {
                let rol = changeRole[role]
                perms.push(rol)
            }

          const embed = new Discord.MessageEmbed()
          .setAuthor("Rol Eliminado", role.guild.iconURL())
          .setColor("#FF0000")
          .setFooter(`${role.name} | ${role.id}`)
          .setDescription(`${role.name} \n\n**Posición:** ${role.position}\n**Creado:**${checkDays(role.createdAt)}\n**Permisos:** ${perms.map(r => r).join(", ")}`)
          
          Channel.send({ embed })
        }
}).catch(err => {
    console.error(err)
})
    }