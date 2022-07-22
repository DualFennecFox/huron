const { EmbedBuilder } = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async member => {

    Guild.findOne({ guildID: member.guild.id }).then(async doc => {
        if (!doc) return
        if (doc.LeaveBool == true) {
        if (!doc.LeaveMsg) return
        if (!doc.LeaveChannel) return
        let Channel = member.guild.channels.cache.get(doc.LeaveChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(member.guild.members.me).has("SEND_MESSAGES")) return
    
        let msg = doc.LeaveMsg.replace(/{user}/g, member)
        .replace(/{server}/g, member.guild.name)
        .replace(/{username}/g, member.user.tag)
        .replace(/{members}/g, member.guild.memberCount)
        .replace(/{owner}/g, member.client.users.cache.get(member.guild.ownerId).tag)
    
        Channel.send(msg)
        }
        if (doc.log.MemberRemove == true) {
          if (!doc.LogChannel) return
          let Channel = member.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(member.guild.members.me).has("SEND_MESSAGES")) return
    
          const embed = new EmbedBuilder()
          .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ format: "png", dynamic: true}) })
          .setColor("#FF0000")
          .setDescription(`**${member.user.tag}** Ha dejado el servidor`)
          .setFields([
            {
              name: "Creado",
              value: checkDays(member.user.createdAt)
            },
            {
              name: "Miembro Desde",
              value: checkDays(member.joinedAt)
            }
          ])
          .setFooter({ text: `${member.user.username} | ${member.user.id}` });
    
          Channel.send({ embeds: [embed] })
        }
      }).catch(err => {
        console.error(err)
      })
}