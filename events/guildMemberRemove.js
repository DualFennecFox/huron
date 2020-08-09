const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async member => {
    let client = member.client
    Guild.findOne({ guildID: member.guild.id }).then(doc => {
        if (!doc) return
        if (doc.LeaveBool == true) {
        if (!doc.LeaveMsg) return
        if (!doc.LeaveChannel) return
        let Channel = member.guild.channels.cache.get(doc.LeaveChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return
    
        let msg = doc.LeaveMsg.replaceAll(/{user}/g, member).replace(/{server}/g, member.guild.name).replace(/{username}/g, member.user.tag).replace(/{members}/g, member.guild.memberCount).replace(/{owner}/g, member.guild.owner.user.tag)
    
        Channel.send(msg)
        }
        if (doc.log.MemberRemove == true) {
          if (!doc.LogChannel) return
          let Channel = member.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return
    
          const embed = new Discord.MessageEmbed()
          .setAuthor(member.user.tag, member.user.displayAvatarURL())
          .setColor("#FF0000")
          .setDescription(`**${member.user.tag}** Ha dejado el servidor`)
          .addField("Creado", checkDays(member.user.createdAt))
          .addField("Miembro Desde", checkDays(member.joinedAt))
          .addField("Roles", member.roles.cache.filter(r => r.name !== "@everyone").map(r => `<@&${r.id}>`).join(", "))
          .setFooter(`${member.user.username} | ${member.user.id}`);
    
          Channel.send({ embed })
        }
      }).catch(err => {
        console.error(err)
      })
}