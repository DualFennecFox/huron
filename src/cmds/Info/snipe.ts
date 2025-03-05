import { Message, PermissionFlagsBits, TextChannel } from 'discord.js'
import { snipe } from '../Moderacion/models/functions'

export default {
    name: 'snipe',
    category: "Info",
    description: 'Muestra el ultimo mensaje borrado de el canal especificado o el canal donde se ejecuto el comando',
    usage: '!snipe',
    run: async ({ message }: { message: Message }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")
        if (!snipe[message.guildId + message.channelId]) return (message.channel as TextChannel).send("No hay ningun mensaje borrado recientemente en este canal")
        const msg = snipe[message.guildId + message.channelId]

        if (!msg._id) return (message.channel as TextChannel).send("No hay ningun mensaje borrado recientemente en este canal")

        return (message.channel as TextChannel).send(`Mensaje eliminado: ${msg.message}`)
    }
}