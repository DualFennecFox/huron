const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async (guild, user) => {
    let client = user.client
    Guild.findOne({ guildID: guild.id }).then(doc => {
      if (!doc) return
      if (doc.log.banAdd == true) {
        if (!doc.LogChannel) return
        let Channel = guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return
  
        guild.fetchBan(user.id).then(Ban => {
        let reason = Ban.reason
        if (!reason) reason = "No se ha proporcionado una razón"
        
        const embed = new Discord.MessageEmbed()
        .setAuthor("Usuario Baneado", user.displayAvatarURL())
        .setColor("#FF0000")
        .setDescription(`<@!${user.id}> Ha sido baneado\n**ID:** ${user.id}`)
        .addField("Creado", checkDays(user.createdAt))
        .addField("Razón", reason)
  
        Channel.send({ embed })
      
    }).catch(err => {
      console.error(err)
    })
  }
    }).catch(err => {
      console.error(err)
    })
  }