import { GuildMember, Message, PermissionFlagsBits, EmbedBuilder, TextChannel } from "discord.js"
import GuildModel from '../cmds/Moderacion/models/Guild'
import { snipe } from '../cmds/Moderacion/models/functions'


export default async function messageDelete(message: Message) {

    const client = message.client
    snipe[message.guildId + message.channelId] = {
        _id: message.channel.id,
        message: message.content,
        member: message.member?.id ?? ""
    }
 
    const doc = await GuildModel.findOne({ guildID: message.guildId })
    if (!doc || !doc.log) return
    if (doc.log.messageDelete == true) {
        if (!doc.LogChannel) return
        const Channel = message.guild?.channels.cache.get(doc.LogChannel) as TextChannel
        if (!Channel) return
        if (!Channel.permissionsFor(message.guild?.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return
        if (message.author.id === client.user.id) return

        if (!message.content && !message.attachments.first()) return

        const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(message.content)
            .setFooter({ text: `De: ${message.author.tag} | ${message.author.id}`, iconURL: message.author.displayAvatarURL({ extension: "png" }) })
        if (message.attachments.first()) {

            embed.addFields([{ name: "Archivos Adjuntados", value: message.attachments.map(r => r.name).join(", ") }])
        }

        Channel.send({ content: `Mensaje Eliminado En: <#${message.channel.id}>`, embeds: [embed] })
    }
}