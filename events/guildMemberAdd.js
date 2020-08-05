const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async member => {
    let client = member.client
    Guild.findOne({ guildID: member.guild.id }).then(doc => {
        if (!doc) return
        if (doc.JoinBool == true) {
        if (!doc.JoinMsg) return
        if (!doc.WelcomeChannel) return
        let Channel = member.guild.channels.cache.get(doc.WelcomeChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return
        
        let msg = doc.JoinMsg.replace("{user}", member).replace("{server}", member.guild.name).replace("{username}", member.user.tag).replace("{members}", member.guild.memberCount).replace("{owner}", member.guild.owner.user.tag)
       
       Channel.send(msg)
        }
       if (doc.log.MemberAdd == true) {
        if (!doc.LogChannel) return
        let Channel = member.guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return
      
        const embed = new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
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