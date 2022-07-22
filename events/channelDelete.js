const { EmbedBuilder } = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays, perms } = require('../cmds/Moderacion/models/functions')

module.exports = async channel => {
    if (channel.type === "dm") return
  Guild.findOne({ guildID: channel.guild.id }).then(async doc => {
  if (!doc) return
  if (doc.log.channelDelete == true) {
    if (!doc.LogChannel) return
    let Channel = channel.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(channel.guild.members.me).has(perms.send_messages)) return

    let type = {
      "GUILD_CATEGORY": "Categoría",
      "GUILD_TEXT": "Texto",
      "GUILD_VOICE": "Voz",
      "GUILD_NEWS": "Noticias",
      "GUILD_STORE": "Tienda",
      "GUILD_STAGE_VOICE": "Escenario",
      "UNKNOWN": "Desconocido"
    }
    
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Canal Eliminado", iconURL: channel.guild.iconURL() })
      .setColor("#FF0000")
      .setDescription(`Se ha eliminado el canal **${channel.name}**`)
      .setFields([
        {
          name: "Creado", 
          value:checkDays(channel.createdAt)
        },
        {
          name: "Tipo de canal",
          value: type[channel.type]
        }
])
      .setFooter({ text: `${channel.name} | ${channel.id}`});

  Channel.send({ embeds: [embed] })
  }
  }).catch(err => {
    console.error(err)
  })
}