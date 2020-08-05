const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async channel => {
    let client = channel.client
    if (channel.type === "dm") return
  Guild.findOne({ guildID: channel.guild.id }).then(doc => {
  if (!doc) return
  if (doc.log.channelDelete == true) {
    if (!doc.LogChannel) return
    let Channel = channel.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return

    let type = {
      "category": "Categoría",
      "text": "Texto",
      "voice": "Voz",
      "news": "Noticias",
      "store": "Tienda",
      "unknown": "Desconocido"
    }
    
    const embed = new Discord.MessageEmbed()
      .setAuthor("Canal Eliminado", channel.guild.iconURL())
      .setColor("#FF0000")
      .setDescription(`Se ha eliminado el canal **${channel.name}**`)
      .addField("Creado", checkDays(channel.createdAt))
      .addField("Tipo de canal", type[channel.type])
      .setFooter(`${channel.name} | ${channel.id}`);

  Channel.send({ embed })
  }
  }).catch(err => {
    console.error(err)
  })
}