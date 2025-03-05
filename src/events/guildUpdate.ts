import { EmbedBuilder, Guild, GuildVerificationLevel, PermissionFlagsBits, TextChannel } from 'discord.js'
import GuildModel from '../cmds/Moderacion/models/Guild'

export default async function guildUpdate(oldGuild: Guild, newGuild: Guild) {
  const doc = await GuildModel.findOne({ guildID: newGuild.id })
  if (!doc) return
  if (doc.log?.guildUpdate == true) {
    if (!doc.LogChannel) return
    const Channel = newGuild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(newGuild.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

    let name = false
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

    const verifLevels = {
      [GuildVerificationLevel.None]: "No Hay",
      [GuildVerificationLevel.Low]: "Bajo",
      [GuildVerificationLevel.Medium]: "Medio",
      [GuildVerificationLevel.High]: "Alto",
      [GuildVerificationLevel.VeryHigh]: "Muy Alto"
    };

    const arr = []
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Servidor Actualizado", iconURL: iconURL ?? "" })
      .setFooter({ text: `${newGuild.name} | ${newGuild.id}` })
      .setColor("#FF0000")
    if (name == true) arr.push({ name: "Nombre Antes | Después", value: `${oldGuild.name} | ${newGuild.name}` })
    if (icon == true) arr.push({ name: "Icono Actualizado", value: `[Antes](${oldGuild.iconURL()}) | [Después](${newGuild.iconURL()})` })
    if (afk == true) arr.push({ name: "Canal AFK Actualizado", value: `**De: ${oldGuild.name} | ${oldGuild.id}\n**A:** ${newGuild.name} | ${newGuild.id}` })
    if (afkTime == true) arr.push({ name: "Tiempo AFK Actualizado", value: `**De:** ${oldGuild.afkTimeout}\n**A:** ${newGuild.afkTimeout}` })
    if (verification == true) arr.push({ name: "Verificación Actualizada", value: `**De:** ${verifLevels[oldGuild.verificationLevel]}\n**A:** ${verifLevels[newGuild.verificationLevel]}` })
    if (owner == true) arr.push({ name: "Nuevo Dueño", value: `**De:** <@!${oldGuild.ownerId}>\n**A:** <@!${newGuild.ownerId}>` })

    embed.setFields(arr)

    await (Channel as TextChannel).send({ embeds: [embed] })
  }
}
