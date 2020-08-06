const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { changeRole } = require('../cmds/Moderacion/models/functions')

module.exports = async channel => {
  let client = channel.client
  if (channel.type === "dm") return
  Guild.findOne({ guildID: channel.guild.id }).then(doc => {
    if (!doc) return
    if (doc.log.channelCreate == true) {
      if (!doc.LogChannel) return
      let Channel = channel.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return

      let perm = false
      let overwritesAllowedUser = []
      let user = false 
      let overwritesDenyUser = []
      let overwritesAllowedRole = []
      let role = false
      let overwritesDenyRole = []

      let type = {
        "category": "Categoría",
        "text": "Texto",
        "voice": "Voz",
        "news": "Noticias",
        "store": "Tienda",
        "unknown": "Desconocido"
      }
      if (channel.permissionOverwrites) {
        perm = true
        for (const perm of channel.permissionOverwrites.values()) {
          console.log(perm)
          if (perm[0].type === "member") {
            user = true
          overwritesAllowedUser.push(`<@!${perm[0].id}>: ${changeRole[perm[0].allow.toArray()]}`)
          overwritesDenyUser.push(`<@!${perm[0].id}>: ${changeRole[perm[0].deny.toArray()]}`)

          }
          if (perm[0].type === "role") {
            role = true
            overwritesAllowedRole.push(`<@&${perm[0].id}>: ${changeRole[perm[0].allow.toArray()]}`)
            overwritesDenyRole.push(`<@&${perm[0].id}>: ${changeRole[perm[0].deny.toArray()]}`)
          }
        }
      }
      const embed = new Discord.MessageEmbed()
      .setAuthor("Canal Creado", channel.guild.iconURL())
      .setColor("#FF0000")
      .setDescription(`Se ha creado el canal **${channel.name}**`)
      .addField("Tipo de canal", type[channel.type])
      if (perm == true && user == true) embed.addField("Permisos Por Usuario", `**Permitidos:** ${overwritesAllowedUser.map(r => r).join("\n")}\n\n**Denegados:** ${overwritesDenyUser.map(r => r).join("\n")}`)
      if (perm == true && role == true) embed.addField("Permisos Por Rol", `**Permitidos:** ${overwritesAllowedRole.map(r => r).join("\n")}\n\n**Denegados:** ${overwritesDenyRole.map(r => r).join("\n")}`)
      .setFooter(`${channel.name} | ${channel.id}`);

  Channel.send({ embed })
    } 
  }).catch(err => {
    console.error(err)
  })
}