const { EmbedBuilder } = require('discord.js')
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

    let arr = []
    const embed = new EmbedBuilder()
    .setAuthor({ name: "Servidor Actualizado", iconURL: iconURL })
    .setFooter({ text: `${newGuild.name} | ${newGuild.id}` })
    .setColor("#FF0000")
    if (name == true) arr.push({ name: "Nombre Antes | Después", value: `${oldGuild.name} | ${newGuild.name}` })
    if (icon == true) arr.push({ name: "Icono Actualizado", value: `[Antes](${oldGuild.iconURL()}) | [Después](${newGuild.iconURL()})` })
    if (afk == true) arr.push({ name: "Canal AFK Actualizado", value: `**De: ${oldGuild.name} | ${oldGuild.id}\n**A:** ${newGuild.name} | ${newGuild.id}`})
    if (afkTime == true) arr.push({ name: "Tiempo AFK Actualizado", value: `**De:** ${oldGuild.afkTimeout}\n**A:** ${newGuild.afkTimeout}`})
    if (verification == true) arr.push({ name: "Verificación Actualizada", value: `**De:** ${verifLevels[oldGuild.verificationLevel]}\n**A:** ${verifLevels[newGuild.verificationLevel]}`})
    if (owner == true) arr.push({ name: "Nuevo Dueño", value: `**De:** <@!${oldGuild.ownerId}>\n**A:** <@!${newGuild.ownerId}>`})
    
    embed.setFields(arr)

    Channel.send({ embeds: [embed] })
  }
  }).catch(err => {
    console.error(err)
    })
}
