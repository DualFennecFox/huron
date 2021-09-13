const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldGuild, newGuild) => {
    let client = newGuild.client
    Guild.findOne({ guildID: newGuild.id }).then(async doc => {
    if (!doc) return
    if (doc.log.guildUpdate == true) {
      if (!doc.LogChannel) return
      let Channel = newGuild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(newGuild.me).has("SEND_MESSAGES")) return
  
    let client = newGuild.client
    let name = false
    let region = false
    let icon = false
    let afk = false
    let afkTime = false
    let verification = false
    let owner = false
    let iconURL
  
    if (oldGuild.name != newGuild.name) {
        name = true
    }

    if (oldGuild.iconURL() != newGuild.iconURL()) {
        icon = true
    }
  
    if (oldGuild.afkChannel?.id != newGuild.afkChannel?.id) {
      afk = true
    }
    if (oldGuild.afkTimeout != newGuild.afkTimeout) {
        afkTime = true
    }

    if (oldGuild.verificationLevel != newGuild.verificationLevel) {
        verification = true
    }
    if (oldGuild.ownerId != newGuild.ownerId) {
        owner = true
    }
  
    if (icon == true) {
      iconURL = oldGuild.iconURL()
    } else {
      iconURL = newGuild.iconURL()
    }
  
    if (name == false && icon == false && afk == false && afkTime == false && verification == false && owner == false) return
  
    let verifLevels = {
        "NONE": "No Hay",
        "LOW": "Bajo",
        "MEDIUM": "Medio",
        "HIGH": "Alto",
        "VERY_HIGH": "Muy Alto"
    };

    const embed = new Discord.MessageEmbed()
    .setAuthor("Servidor Actualizado", iconURL)
    .setFooter(`${newGuild.name} | ${newGuild.id}`)
    .setColor("#FF0000")
    if (name == true) embed.addField("Nombre Antes | Después", `${oldGuild.name} | ${newGuild.name}`)
    if (icon == true) embed.addField("Icono Actualizado",`[Antes](${oldGuild.iconURL()}) | [Después](${newGuild.iconURL()})`)
    if (afk == true) embed.addField("Canal AFK Actualizado", `**De: ${oldGuild.name} | ${oldGuild.id}\n**A:** ${newGuild.name} | ${newGuild.id}`)
    if (afkTime == true) embed.addField("Tiempo AFK Actualizado", `**De:** ${oldGuild.afkTimeout}\n**A:** ${newGuild.afkTimeout}`)
    if (verification == true) embed.addField("Verificación Actualizada", `**De:** ${verifLevels[oldGuild.verificationLevel]}\n**A:** ${verifLevels[newGuild.verificationLevel]}`)
    if (owner == true) embed.addField("Nuevo Dueño", `**De:** <@!${oldGuild.ownerId}>\n**A:** <@!${newGuild.ownerId}>`)

    Channel.send({ embeds: [embed] })
  }
  }).catch(err => {
    console.error(err)
    })
}
