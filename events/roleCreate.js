const { EmbedBuilder } = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async role => {
    
    Guild.findOne({ guildID: role.guild.id }).then(async doc => {
        if (!doc) return
        if (doc.log.roleCreate == true) {
          if (!doc.LogChannel) return
          let Channel = role.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(role.guild.members.me).has("SEND_MESSAGES")) return
            
          let boolean = {
              "false": "No",
              "true": "Si"
          }
          const embed = new EmbedBuilder()
          .setAuthor({ name: "Rol Creado", iconURL: role.guild.iconURL() })
          .setColor("#FF0000")
          .setFooter({ text: `${role.name} | ${role.id}` })
          .setDescription(`<@&${role.id}> \n\n**Color:** ${role.hexColor}\n**Mencionable:** ${boolean[role.mentionable]}\n**Mostrar Separado:** ${boolean[role.hoist]}`)

          Channel.send({ embeds: [embed] })
        }
}).catch(err => {
    console.error(err)
})
    }