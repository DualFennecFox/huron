import { Role, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js"
import GuildModel from '../cmds/Moderacion/models/Guild'
import { checkDays, changeRole } from '../cmds/Moderacion/models/functions'

export default async function roleDelete(role: Role) {
  const perms = []

  const doc = await GuildModel.findOne({ guildID: role.guild.id })
  if (!doc) return
  if (doc.log?.roleDelete == true) {
    if (!doc.LogChannel) return
    const Channel = role.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(role.guild.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

    for (const perm of role.permissions.toArray()) {
      if (changeRole[perm]) {
        const rol = changeRole[perm]
        perms.push(rol)
      }
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Rol Eliminado", iconURL: role.guild.iconURL() ?? "" })
      .setColor("#FF0000")
      .setFooter({ text: `${role.name} | ${role.id}` })
      .setDescription(`${role.name} \n\n**Posición:** ${role.rawPosition}\n**Creado: **${checkDays(role.createdAt)}\n**Permisos:** ${perms.join(", ")}`)

    await (Channel as TextChannel).send({ embeds: [embed] })
  }
}
