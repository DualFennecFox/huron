import { EmbedBuilder, GuildMember, PermissionFlagsBits, TextChannel } from 'discord.js'
import GuildModel from '../cmds/Moderacion/models/Guild'
import { checkDays } from '../cmds/Moderacion/models/functions'

export default async function guildMemberAdd(member: GuildMember) {

  const doc = await GuildModel.findOne({ guildID: member.guild.id })
  if (!doc) return
  if (doc.muteUsers?.includes(member.id) && member.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) {

    const role = member.guild.roles.cache.get(doc.muterole)
    if (role) {
      member.roles.add(role?.id)
    }
  }
  if (doc.JoinBool == true) {
    if (!doc.JoinMsg) return
    if (!doc.WelcomeChannel) return
    const Channel = member.guild.channels.cache.get(doc.WelcomeChannel) as TextChannel
    if (!Channel) return
    if (!Channel.permissionsFor(member.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return

    const msg = doc.JoinMsg.replace(/{user}/g, member.nickname ?? "").replace(/{server}/g, member.guild.name).replace(/{username}/g, member.user.tag).replace(/{members}/g, (member.guild.memberCount ?? 0).toString()).replace(/{owner}/g, member.client.users.cache.get(member.guild.ownerId)?.tag ?? '')

    Channel.send(msg)
  }
  if (doc.log?.MemberAdd == true) {
    if (!doc.LogChannel) return
    const Channel = member.guild.channels.cache.get(doc.LogChannel) as TextChannel
    if (!Channel) return
    if (!Channel.permissionsFor(member.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return

    const embed = new EmbedBuilder()
      .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ extension: "png" }) })
      .setColor("#FF0000")
      .setDescription(`<@!${member.user.id}> Se ha unido a el servidor`)
      .setFields([
        {
          name: "Creado",
          value: checkDays(member.user.createdAt)
        }
      ])
      .setFooter({ text: `${member.user.username} | ${member.user.id}` });

    Channel.send({ embeds: [embed] })
  }
}
