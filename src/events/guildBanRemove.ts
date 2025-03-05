import { AuditLogEvent, EmbedBuilder, Guild, PermissionFlagsBits, TextChannel, User } from 'discord.js'
import GuildModel from '../cmds/Moderacion/models/Guild'
import { checkDays } from '../cmds/Moderacion/models/functions'

export default async function guildBanRemove(guild: Guild, user: User) {
  const doc = await GuildModel.findOne({ guildID: guild.id })
  if (!doc) return
  if (doc.log?.banRemove == true) {
    if (!doc.LogChannel) return
    const Channel = guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(guild.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

    const log = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanRemove })
    const ban = log.entries.first();

    let description = `<@!${user.id}> Ha sido desbaneado\n**ID:** ${user.id}`

    if (ban?.targetId === user.id) description = `<@!${user.id}> Ha sido desbaneado\n**ID:** ${user.id}\n\n**Por:** <@!${ban.executor?.id}>\n**ID:** ${ban.executor?.id}`

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Usuario Desbaneado", iconURL: user.displayAvatarURL({ extension: "png" }) })
      .setColor("#FF0000")
      .setDescription(description)
      .setFields([
        {
          name: "Creado",
          value: checkDays(user.createdAt)
        },
        {
          name: "Razón",
          value: ban?.reason ?? "No se ha proporcionado una Razón"
        }
      ])

    await (Channel as TextChannel).send({ embeds: [embed] })
  }
}