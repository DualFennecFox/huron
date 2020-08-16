const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldGuild, newGuild) => {
    let client = newGuild.client
    Guild.findOne({ guildID: newGuild.id }).then(doc => {
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
    let system = false
    let iconURL
  
    if (oldGuild.name != newGuild.name) {
        name = true
    }

    if (oldGuild.region != newGuild.region) {
        region = true
    }
    if (oldGuild.iconURL() != newGuild.iconURL()) {
        icon = true
    }
  
    if (oldGuild.afkChannel.id != newGuild.afkChannel.id) {
      afk = true
    }
    if (oldGuild.afkTimeout != newGuild.afkTimeout) {
        afkTime = true
    }

    if (oldGuild.verificationLevel != newGuild.verificationLevel) {
        verification = true
    }
    if (oldGuild.ownerID != newGuild.ownerID) {
        owner = true
    }
    if (oldGuild.systemChannel.id != newGuild.systemChannel.id) {
        system = true
    }
  
    if (icon == true) {
      iconURL = oldGuild.iconURL()
    } else {
      iconURL = newGuild.iconURL()
    }
  
    if (name == false && region == false && icon == false && afk == false && afkTime == false && verification == false && owner == false && system == false) return
  
    let regionChange = {
        "brazil": ":flag_br: Brazil",
        "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    };
    let verifLevels = {
        "NONE": "No Hay",
        "LOW": "Bajo",
        "MEDIUM": "Medio",
        "HIGH": "(╯°□°）╯︵  ┻━┻",
        "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
    };

    const embed = new Discord.MessageEmbed()
    .setAuthor("Servidor Actualizado", iconURL)
    .setThumbnail(newGuild.iconURL())
    .setFooter(`${newGuild.name} | ${newGuild.id}`)
    .setColor("#FF0000")
    if (name == true) embed.addField("Nombre Antes | Después", `${oldGuild.name} | ${newGuild.name}`)
    if (region == true) embed.addField("Región Actualizada", `**De:** ${region[oldGuild.region]}\n**A:** ${regionChange[newGuild.region]}`)
    if (icon == true) embed.addField("Icono Actualizado",`[Antes](${oldGuild.iconURL()}) | [Después](${newGuild.iconURL()})`)
    if (afk == true) embed.addField("Canal AFK Actualizado", `**De: ${oldGuild.name} | ${oldGuild.id}\n**A:** ${newGuild.name} | ${newGuild.id}`)
    if (afkTime == true) embed.addField("Tiempo AFK Actualizado", `**De:** ${oldGuild.afkTimeout}\n**A:** ${newGuild.afkTimeout}`)
    if (verification == true) embed.addField("Verificación Actualizada", `**De:** ${verifLevels[oldGuild.verificationLevel]}\n**A:** ${verifLevels[newGuild.verificationLevel]}`)
    if (owner == true) embed.addField("Nuevo Dueño", `**De:** <@!${oldGuild.ownerID}>\n**A:** <@!${newGuild.ownerID}>`)
    if (system = true) embed.addField("Canal de Sistema Actualizado", `**De:** ${oldGuild.systemChannel.name}\n**A:** ${newGuild.systemChannel.name}`)

    Channel.send({ embed })
  }
  }).catch(err => {
    console.error(err)
    })
}