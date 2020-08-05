const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldMember, newMember) => {
    let client = newMember.client
    Guild.findOne({ guildID: newMember.guild.id }).then(doc => {
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
  
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    for (const role of newMember.roles.cache.map(x => x.id)) {
      if (!oldMember.roles.cache.has(role)) {
          newRole = true
          getNewRole = newMember.guild.roles.cache.get(role)
      }
  }
    }
  
  if (newMember.roles.cache.size < oldMember.roles.cache.size) {
  for (const role of oldMember.roles.cache.map(x => x.id)) {
    if (!newMember.roles.cache.has(role)) {
        removeRole = true
        getRemovedRole = newMember.guild.roles.cache.get(role)
    }
  }
  }

  if (newMember.nickname !== oldMember.nickname) {
    nickname = true
  }
    if (avatar == true) {
      iconURL = oldMember.user.displayAvatarURL()
    } else {
      iconURL = newMember.user.displayAvatarURL()
    }
  
    if (newRole == false && removeRole == false && nickname == false) return
  
    const embed = new Discord.MessageEmbed()
    .setAuthor(newMember.user.tag, iconURL)
    .setThumbnail(newMember.user.displayAvatarURL())
    .setFooter(`${newMember.user.username} | ${newMember.user.id}`)
    .setColor("#FF0000")
    if (name == true) embed.addField("Nombre Antes | Después", `${oldMember.user.tag} | ${newMember.user.tag}`)
    if (newRole == true) embed.addField("Nuevo Rol", `<@&${getNewRole.id}>`)
    if (removeRole == true) embed.addField("Rol Removido",`<@&${getRemovedRole.id}>`)
    if (avatar == true) embed.addField("Avatar Actualizado", `[Antes](${oldMember.user.displayAvatarURL({ dynamic: true })}) | [Después](${newMember.user.displayAvatarURL({ dynamic: true })})`)
    if (nickname == true) embed.addField("Apodo Antes | Después", `${oldMember.displayName} | ${newMember.displayName}`)
  
    Channel.send({ embed })
  }
  }).catch(err => {
    console.error(err)
    })
  }