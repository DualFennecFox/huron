import { ChannelType, EmbedBuilder, GuildBasedChannel, PermissionFlagsBits, TextChannel } from "discord.js"
import GuildModel from '../cmds/Moderacion/models/Guild'
import { checkDays } from '../cmds/Moderacion/models/functions'

export default async function channelDelete(channel: GuildBasedChannel) {

  const doc = await GuildModel.findOne({ guildID: channel.guild.id })
  if (!doc) return
  if (doc?.log?.channelDelete == true) {
    if (!doc.LogChannel) return
    const Channel = channel.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(channel.guild?.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

    const type = {
      [ChannelType.GuildCategory]: "Categoría",
      [ChannelType.GuildText]: "Texto",
      [ChannelType.GuildVoice]: "Voz",
      [ChannelType.GuildAnnouncement]: "Noticias",
      [ChannelType.GuildStageVoice]: "Escenario"
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Canal Eliminado", iconURL: channel.guild.iconURL() ?? "" })
      .setColor("#FF0000")
      .setDescription(`Se ha eliminado el canal **${channel.name}**`)
      .setFields([
        {
          name: "Creado",
          value: channel.createdAt ? checkDays(channel.createdAt) : ""
        },
        {
          name: "Tipo de canal",
          value: type[channel.type as keyof typeof type]
        }
      ])
      .setFooter({ text: `${channel.name} | ${channel.id}` });

    (Channel as TextChannel).send({ embeds: [embed] })
  }
}