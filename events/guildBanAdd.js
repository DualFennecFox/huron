const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async (guild, user) => {
    let client = user.client
    Guild.findOne({ guildID: guild.id }).then(async doc => {
      if (!doc) return
      if (doc.log.banAdd == true) {
        if (!doc.LogChannel) return
        let Channel = guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return
  
        let log = await guild.fetchAuditLogs({ limit: 5, type: "MEMBER_BAN_ADD"})
        
        let ban = log.entries.first();

        let description = `<@!${user.id}> Ha sido baneado\n**ID:** ${user.id}`

        if (ban.target.id === user.id) description = `<@!${user.id}> Ha sido baneado\n**ID:** ${user.id}\n\n**Por:** <@!${ban.executor.id}>\n**ID:** ${ban.executor.id}`
        const embed = new Discord.MessageEmbed()
        .setAuthor("Usuario Baneado", user.displayAvatarURL({ format: "png", dynamic: true}))
        .setColor("#FF0000")
        .setDescription(description)
        .addField("Creado", checkDays(user.createdAt))
        .addField("Razón", ban.reason)
  
        Channel.send({ embed })
      }
    }).catch(err => {
      console.error(err)
    })
  }