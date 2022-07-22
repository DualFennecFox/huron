const { EmbedBuilder } = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays, changeRole } = require('../cmds/Moderacion/models/functions')

module.exports = async role => {
    let perms = []

    Guild.findOne({ guildID: role.guild.id }).then(async doc => {
        if (!doc) return
        if (doc.log.roleDelete == true) {
          if (!doc.LogChannel) return
          let Channel = role.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(role.guild.members.me).has("SEND_MESSAGES")) return

          for (const perm of role.permissions.toArray()) {
                if (changeRole[perm]) {
                let rol = changeRole[perm]
                perms.push(rol)
                }
            }

          const embed = new EmbedBuilder()
          .setAuthor({ name: "Rol Eliminado", iconURL: role.guild.iconURL() })
          .setColor("#FF0000")
          .setFooter({ text: `${role.name} | ${role.id}` })
          .setDescription(`${role.name} \n\n**Posición:** ${role.rawPosition}\n**Creado: **${checkDays(role.createdAt)}\n**Permisos:** ${perms.join(", ")}`)
          
          Channel.send({ embeds: [embed] })
        }
}).catch(err => {
    console.error(err)
})
    }
