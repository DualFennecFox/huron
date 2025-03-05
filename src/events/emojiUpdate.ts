import { EmbedBuilder, GuildEmoji, PermissionFlagsBits, TextChannel } from 'discord.js'
import GuildModel from '../cmds/Moderacion/models/Guild'

export default async function emojiUpdate(oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {

  const doc = await GuildModel.findOne({ guildID: newEmoji.guild.id })
  if (!doc) return
  if (doc.log?.emojiUpdate == true) {
    if (!doc.LogChannel) return
    const Channel = newEmoji.guild.channels.cache.get(doc.LogChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(newEmoji.guild?.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return

    if (oldEmoji.name === newEmoji.name) return
    const author = await newEmoji.fetchAuthor()

    let animated = ""
    if (newEmoji.animated == true) animated = `https://cdn.discordapp.com/emojis/${newEmoji.id}.gif`
    else animated = `https://cdn.discordapp.com/emojis/${newEmoji.id}.png`

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Emoji Actualizado" })
      .setColor("#FF0000")
      .setDescription(`<:${newEmoji.name}:${newEmoji.id}> Ha sido Renombrado\n\n**De:** ${oldEmoji.name}\n**A:** ${newEmoji.name}`)
      .setThumbnail(animated)
      .setFooter({ text: `Por: ${author.username} | ${author.id}` });

    await (Channel as TextChannel).send({ embeds: [embed] })
  }
}