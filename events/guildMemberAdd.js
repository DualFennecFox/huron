const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async member => {
    let client = member.client
    Guild.findOne({ guildID: member.guild.id }).then(async doc => {
        if (!doc) return
        if (doc.muteUsers) {
          if (doc.muteUsers.includes(member.id) && member.guild.me.hasPermission("MANAGE_ROLES")) {
            
            let role = member.guild.roles.cache.get(doc.muterole)
            if (role) {
            member.roles.add(role.id)
            }
          }
        }
        if (doc.JoinBool == true) {
        if (!doc.JoinMsg) return
        if (!doc.WelcomeChannel) return
        let Channel = member.guild.channels.cache.get(doc.WelcomeChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return
        
        let msg = doc.JoinMsg.replace(/{user}/g, member).replace(/{server}/g, member.guild.name).replace(/{username}/g, member.user.tag).replace(/{members}/g, member.guild.memberCount).replace(/{owner}/g, member.guild.owner.user.tag)
       
       Channel.send(msg)
        }
       if (doc.log.MemberAdd == true) {
        if (!doc.LogChannel) return
        let Channel = member.guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return
      
        const embed = new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png", dynamic: true}))
        .setColor("#FF0000")
        .setDescription(`<@!${member.user.id}> Se ha unido a el servidor`)
        .addField("Creado", checkDays(member.user.createdAt))
        .setFooter(`${member.user.username} | ${member.user.id}`);
      
        Channel.send({ embed })
      }
      }).catch(err => {
        console.error(err)
      })
}