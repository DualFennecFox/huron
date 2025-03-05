import { EmbedBuilder, GuildMember, PermissionFlagsBits, TextChannel } from 'discord.js'
import GuildModel from '../cmds/Moderacion/models/Guild'
import { checkDays } from '../cmds/Moderacion/models/functions'

export default async function guildMemberRemove(member: GuildMember) {

  const doc = await GuildModel.findOne({ guildID: member.guild.id })
  if (!doc) return
  if (doc.LeaveBool == true) {
    if (!doc.LeaveMsg) return
    if (!doc.LeaveChannel) return
    const Channel = member.guild.channels.cache.get(doc.LeaveChannel) as TextChannel
    if (!Channel) return
    if (!Channel.permissionsFor(member.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return

    const msg = doc.LeaveMsg.replace(/{user}/g, member.nickname ?? "")
      .replace(/{server}/g, member.guild.name)
      .replace(/{username}/g, member.user.tag)
      .replace(/{members}/g, (member.guild?.memberCount ?? "").toString())
      .replace(/{owner}/g, member.client.users.cache.get(member.guild?.ownerId ?? "")?.tag ?? "")

    Channel.send(msg)
  }
  if (doc.log?.MemberRemove == true) {
    if (!doc.LogChannel) return
    const Channel = member.guild.channels.cache.get(doc.LogChannel) as TextChannel
    if (!Channel) return
    if (!Channel.permissionsFor(member.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return

    const embed = new EmbedBuilder()
      .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ extension: "png" }) })
      .setColor("#FF0000")
      .setDescription(`**${member.user.tag}** Ha dejado el servidor`)
      .setFields([
        {
          name: "Creado",
          value: checkDays(member.user.createdAt)
        },
        {
          name: "Miembro Desde",
          value: member.joinedAt != null ? checkDays(member.joinedAt) : ""
        }
      ])
      .setFooter({ text: `${member.user.username} | ${member.user.id}` });

    Channel.send({ embeds: [embed] })
  }
}