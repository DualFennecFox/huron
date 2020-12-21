const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async (guild, u) => {
    let client = user.client
    Guild.findOne({ guildID: guild.id }).then(async doc => {
      if (!doc) return
      if (doc.log.banAdd == true) {
        if (!doc.LogChannel) return
        let Channel = guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return

        let description = `<@!${u.id}> Ha sido baneado\n**ID:** ${u.id}`

        let log = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD"})
        let ban = log.entries.first();

        if (ban.target.id === u.id) description = `<@!${u.id}> Ha sido baneado\n**ID:** ${u.id}\n\n**Por:** <@!${ban.executor.id}>\n**ID:** ${ban.executor.id}`
        const embed = new Discord.MessageEmbed()
        .setAuthor("Usuario Baneado", u.displayAvatarURL({ format: "png", dynamic: true}))
        .setColor("#FF0000")
        .setDescription(description)
        .addField("Creado", checkDays(u.createdAt))
        .addField("Razón", ban.reason || "No se ha proporcionado una Razón")
  
        Channel.send({ embed })
      }
    }).catch(err => {
      console.error(err)
    })
  }