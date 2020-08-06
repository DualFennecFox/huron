const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async invite => {
    let client = invite.client
    Guild.findOne({ guildID: invite.guild.id }).then(doc => {
    if (!doc) return
    if (doc.log.inviteCreate == true) {
      if (!doc.LogChannel) return
      let Channel = invite.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(invite.guild.me).has("SEND_MESSAGES")) return

      let now = new Date();
      let diff = now.getTime() - invite.expiresAt.getTime();
      let days = Math.floor(diff / 86400000);
      let expiresAt = `En ${days} ${days == 1 ? "día" : "días"}`;
      let inv
      if (invite.maxUses === 0) {
        inv = "Infinito"
      }
      else inv = invite.maxUses

    const embed = new Discord.MessageEmbed()
    .setAuthor("Invitación Creada", invite.guild.iconURL())
    .setFooter(`${invite.guild.name} | ${invite.guild.id}`)
    .setColor("#FF0000")
    .setDescription(`**Para el Canal:** ${invite.channel.name}\n[URL](${invite.url})\n**Usos Máximos:** ${inv}\n**Expira En:** ${expiresAt}\n**Creado Por:** <@!${invite.inviter.id}>`)
  
    Channel.send({ embed })
  }
  }).catch(err => {
    console.error(err)
    })
}