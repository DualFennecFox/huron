import { Message, EmbedBuilder, GuildMember, PermissionFlagsBits, TextChannel } from 'discord.js'
import Guild from '../cmds/Moderacion/models/Guild'
import ExtendedClient from '../classes/extendedClient'

export default async function messageUpdate(oldMessage: Message, newMessage: Message) {
    const client = newMessage.client as ExtendedClient

    const doc = await Guild.findOne({ guildID: newMessage.guildId })
    if (!doc || !doc.log) return
    if (doc.log.messageUpdate == true) {
        if (!doc.LogChannel) return
        const Channel = newMessage.guild?.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(newMessage.guild?.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return
        if (newMessage.author.id === client.user?.id) return

        let content = false

        if (oldMessage.content != newMessage.content) {
            content = true
        }

        if (content == false) return

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Mensaje Editado", iconURL: newMessage.author.displayAvatarURL({ extension: "png" }) })
            .setColor("#FF0000")
            .setDescription(`**De:** <@!${newMessage.author.id}>\n\n**Antes:** ${oldMessage.content}\n**Después:** ${newMessage.content}`)
            .setFooter({ text: `${newMessage.author.tag} | ${newMessage.author.id}` })

        await (Channel as TextChannel).send({ embeds: [embed] })
    }

}