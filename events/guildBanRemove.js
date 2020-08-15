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
  
        let log = guild.fetchAuditLogs({ limit: 5, user: user.id, type: "MEMBER_BAN_ADD"})
        
        let ban = log.entries.first();

        let description = `<@!${user.id}> Ha sido desbaneado\n**ID:** ${user.id}`

        if (ban.target.id === user.id) description = `<@!${user.id}> Ha sido desbaneado\n**ID:** ${user.id}\n**Por:** <@!${ban.executor.id}>\n**ID:** ${ban.executor.id}`

        const embed = new Discord.MessageEmbed()
        .setAuthor("Usuario Desbaneado", user.displayAvatarURL({ format: "png", dynamic: true}))
        .setColor("#FF0000")
        .setDescription(description)
        .addField("Creado", checkDays(user.createdAt))
  
        Channel.send({ embed })
  }
    }).catch(err => {
      console.error(err)
    })
  }