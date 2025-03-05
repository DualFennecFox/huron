import { EmbedBuilder, GuildEmoji, PermissionFlagsBits, TextChannel } from 'discord.js'
import GuildModel from '../cmds/Moderacion/models/Guild'

export default async function emojiDelete(emoji: GuildEmoji) {

  const doc = await GuildModel.findOne({ guildID: emoji.guild.id })
  if (!doc) return
  if (doc.log?.emojiDelete == true) {
    if (!doc.LogChannel) return
    const Channel = emoji.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(emoji.guild?.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

    let animated = ""
    if (emoji.animated == true) animated = `https://cdn.discordapp.com/emojis/${emoji.id}.gif`
    else animated = `https://cdn.discordapp.com/emojis/${emoji.id}.png`

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Emoji Eliminado" })
      .setColor("#FF0000")
      .setDescription(`${emoji.name}\n\nID: ${emoji.id}`)
      .setThumbnail(animated)

    await (Channel as TextChannel).send({ embeds: [embed] })
  }
}