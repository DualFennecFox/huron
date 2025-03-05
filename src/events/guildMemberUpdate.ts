import { EmbedBuilder, GuildMember, PermissionFlagsBits, TextChannel } from 'discord.js'
import GuildModel from '../cmds/Moderacion/models/Guild'

export default async function guildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {

  const doc = await GuildModel.findOne({ guildID: newMember.guild.id })
  if (!doc) return
  if (doc.log?.MemberUpdate == true) {
    if (!doc.LogChannel) return
    const Channel = newMember.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(newMember.guild.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

    let newRole = false
    let getNewRole;
    let removeRole = false
    let getRemovedRole;
    let nickname = false

    for (const role of newMember.roles.cache.map(x => x?.id)) {
      if (!oldMember.roles.cache.has(role)) {
        newRole = true
        getNewRole = newMember.guild.roles.cache.get(role)
      }
    }

    for (const role of oldMember.roles.cache.map(x => x?.id)) {
      if (!newMember.roles.cache.has(role)) {
        removeRole = true
        getRemovedRole = newMember.guild.roles.cache.get(role)
      }
    }

    if (newMember.nickname !== oldMember.nickname) {
      nickname = true
    }

    if (newRole == false && removeRole == false && nickname == false) return

    const embed = new EmbedBuilder()
      .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ extension: "png" }) })
      .setFooter({ text: `${newMember.user.username} | ${newMember.user.id}` })
      .setColor("#FF0000")
    if (newRole == true) embed.addFields([{ name: "Nuevo Rol", value: `<@&${getNewRole?.id}>` }])
    if (removeRole == true) embed.addFields([{ name: "Rol Removido", value: `<@&${getRemovedRole?.id}>` }])
    if (nickname == true) embed.addFields([{ name: "Apodo Antes | Después", value: `${oldMember.displayName} | ${newMember.displayName}` }])

    await (Channel as TextChannel).send({ embeds: [embed] })
  }
}