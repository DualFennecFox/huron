const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async invite => {
    let client = invite.client
    Guild.findOne({ guildID: invite.guild.id }).then(doc => {
    if (!doc) return
    if (doc.log.inviteDelete == true) {
      if (!doc.LogChannel) return
      let Channel = invite.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(invite.guild.me).has("SEND_MESSAGES")) return

    const embed = new Discord.MessageEmbed()
    .setAuthor("Invitación Eliminada", invite.guild.iconURL())
    .setFooter(`${invite.guild.name} | ${invite.guild.id}`)
    .setColor("#FF0000")
    .setDescription(`**URL:** <${invite.url}>\n**Creado Por:** <@!${invite.inviter.id}>\n**Creado:**${checkDays(invite.createdAt)}`)
  
    Channel.send({ embed })
  }
  }).catch(err => {
    console.error(err)
    })
}