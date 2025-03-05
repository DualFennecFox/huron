import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from 'discord.js'
import Guild from "../Moderacion/models/Guild"

export default {
    name: 'suggest',
    category: "Util",
    description: 'Este comando sugiere cosas para el servidor en un canal especificado.',
    usage: '!suggest <Sugerencia>',
    examples: ['!suggest Pongan al Bot de Wumpus'],
    run: async ({ message, args }: {
        message: Message,
        args: string[]
    }) => {

        if (!args[0]) return (message.channel as TextChannel).send("Debes sugerir algo")

        const doc = await Guild.findOne({ guildID: message.guildId })
        if (!doc) return (message.channel as TextChannel).send("No hay ningún canal de sugerencias declarado")

        const channel = message.guild?.channels.cache.get(doc.suggestionChannel)
        if (!channel) return (message.channel as TextChannel).send("El canal de sugerencias no parece ser válido")

        if (!channel.permissionsFor(message.guild?.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return (message.channel as TextChannel).send("No tengo permisos para enviar mensajes en el canal de sugerencias")
        if (message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageMessages)) message.delete()
        const level = doc.suggestionLevel

        const suggestion = args.join(" ")

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Sugerencia #${level}`, iconURL: message.author.displayAvatarURL({ extension: "png" }) })
            .setColor("#7BA7FF")
            .setDescription(suggestion)
            .setFooter({ text: `Por: ${message.author.tag}` })

        const msg = await (channel as TextChannel).send({ embeds: [embed] })
        if (message.guild?.members.me?.permissions.has(PermissionFlagsBits.AddReactions)) {
            await msg.react("✅")
            await msg.react("❌")
        }

        (message.channel as TextChannel).send("Se ha enviado tu sugerencia con exito").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))

        doc.suggestionLevel = level + 1

        await doc.save()
    }
}