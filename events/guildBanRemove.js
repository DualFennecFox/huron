const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async (guild, user) => {
    Guild.findOne({ guildID: guild.id }).then(doc => {
      if (!doc) return
      if (doc.log.banRemove == true) {
        if (!doc.LogChannel) return
        let Channel = guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return
  
        const embed = new Discord.MessageEmbed()
        .setAuthor("Usuario Desbaneado", user.displayAvatarURL())
        .setColor("#FF0000")
        .setDescription(`<@!${user.id}> Ha sido Desbaneado\n**ID:** ${user.id}`)
        .addField("Creado", checkDays(user.createdAt))
  
        Channel.send({ embed })
  }
    }).catch(err => {
      console.error(err)
    })
  }