const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldMember, newMember) => {

    Guild.findOne({ guildID: newMember.guild.id }).then(async doc => {
    if (!doc) return
    if (doc.log.MemberUpdate == true) {
      if (!doc.LogChannel) return
      let Channel = newMember.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(newMember.guild.me).has("SEND_MESSAGES")) return

    let newRole = false
    let getNewRole;
    let removeRole = false
    let getRemovedRole;
    let nickname = false
  
    for (const role of newMember.roles.cache.map(x => x?.id)) {
      if (!oldMember.roles.cache.has(role)) {
          newRole = true
          getNewRole = newMember.guild.roles.cache.get(role)
      }
  }
  
  for (const role of oldMember.roles.cache.map(x => x?.id)) {
    if (!newMember.roles.cache.has(role)) {
        removeRole = true
        getRemovedRole = newMember.guild.roles.cache.get(role)
    }
  }

  if (newMember.nickname !== oldMember.nickname) {
    nickname = true
  }
  
    if (newRole == false && removeRole == false && nickname == false) return
  
    const embed = new Discord.MessageEmbed()
    .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ format: "png", dynamic: true}))
    .setFooter(`${newMember.user.username} | ${newMember.user.id}`)
    .setColor("#FF0000")
    if (newRole == true) embed.addField("Nuevo Rol", `<@&${getNewRole.id}>`)
    if (removeRole == true) embed.addField("Rol Removido",`<@&${getRemovedRole.id}>`)
    if (nickname == true) embed.addField("Apodo Antes | Después", `${oldMember.displayName} | ${newMember.displayName}`)
  
    Channel.send({ embeds: [embed] })
  }
  }).catch(err => {
    console.error(err)
    })
  }