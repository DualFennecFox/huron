import { Message, PermissionFlagsBits, TextChannel } from "discord.js"
import ExtendedClient from "../../classes/extendedClient"
import { getUser } from "./models/functions"

export default {
    name: "removerole",
    category: "Moderacion",
    description: 'Este comando quita un rol a un usuario mencionado',
    aliases: ["remove-role"],
    usage: '!removerole <Rol> <Usuario> [Razón]',
    examples: ['!removerole @Rojo @Wumpus Colores', '!removerole 12345678987654321 24681356789043210 Colores'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!")
        if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) return (message.channel as TextChannel).send("No tengo permisos para añadir roles")
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role) return (message.channel as TextChannel).send("Debes mencionar un rol o darme su ID")

        if (message.guild.members.me.roles.highest.comparePositionTo(role) < 1) {
            return (message.channel as TextChannel).send("Mi rol es muy bajo para asignar este rol");
        }

        let user = message.mentions.members?.first() || message.guild.members.cache.get(args[1])
        if (contentPrefix !== prefix) user = message.guild.members.cache.get(getUser(args[0], client)?.id ?? "")
        if (!user) return (message.channel as TextChannel).send("Debes mencionar a un usuario o darme su ID")

        const reason = `[${message.author.tag}]: ${args.slice(2).join(" ") || "No se específico una Razón"}`;

        if (!user.roles.cache.has(role.id)) return (message.channel as TextChannel).send("Este usuario no tiene este rol")

        try {
            user.roles.remove(role.id, reason)

        } catch (err) {
            console.error(err)
            return (message.channel as TextChannel).send("Ha ocurrido un error")
        }

        return (message.channel as TextChannel).send(`Se ha removido el rol **${role.name}** a <@${user.id}>`)
    }
}