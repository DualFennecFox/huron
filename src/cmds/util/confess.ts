import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from 'discord.js'
import GuildModel from '../Moderacion/models/Guild'

export default {
    name: "confess",
    category: "Util",
    description: "Envia tu confesión anonima al canal de confesiones",
    usage: "!confess",
    examples: ["!confess <confesión>"],
    run: async ({ message, args }: {
        message: Message,
        args: string[]
    }) => {

        if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageMessages)) return (message.channel as TextChannel).send("Por privacidad es necesario que yo pueda borrar mensajes")
        message.delete()

        if (!args[0]) return (message.channel as TextChannel).send("Dime que quieres confesar").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))

        const doc = await GuildModel.findOne({ guildID: message.guildId })
        if (!doc) return (message.channel as TextChannel).send("No hay ningún canal de confesiones declarado").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))

        const channel = message.guild.channels.cache.get(doc.confessionChannel)
        if (!channel) return (message.channel as TextChannel).send("El canal de confesiones no parece ser válido").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))

        if (!channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.SendMessages)) return (message.channel as TextChannel).send("No tengo permisos para enviar mensajes en el canal de confesiones").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
        const level = doc.confessionLevel

        const confession = args.join(" ")

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Confesión #${level}`, iconURL: message.guild.iconURL({ extension: "png", size: 2048 }) ?? "" })
            .setColor("#f7f749")
            .setDescription(confession)

        await (channel as TextChannel)?.send({ embeds: [embed] })

        doc.confessionLevel = level + 1

        await doc.save()
    }
}