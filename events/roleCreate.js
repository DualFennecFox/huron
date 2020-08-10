const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async role => {
    
    let client = role.client
    Guild.findOne({ guildID: role.guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.roleCreate == true) {
          if (!doc.LogChannel) return
          let Channel = role.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(role.guild.me).has("SEND_MESSAGES")) return
            
          let boolean = {
              "false": "No",
              "true": "Si"
          }
          const embed = new Discord.MessageEmbed()
          .setAuthor("Rol Creado", role.guild.iconURL())
          .setColor("#FF0000")
          .setFooter(`${role.name} | ${role.id}`)
          .setDescription(`<@&${role.id}> \n\n**Color:** ${role.hexColor}\n**Mencionable:** ${boolean[role.mentionable]}\n**Mostrar Separado:** ${boolean[role.hoist]}`)

          Channel.send({ embed })
        }
}).catch(err => {
    console.error(err)
})
    }