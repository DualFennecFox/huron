import { Message, PermissionFlagsBits, TextChannel } from "discord.js";
import ExtendedClient from "../../classes/extendedClient";
import { getUser } from "./models/functions";

module.exports = {
    name: 'nickname',
    category: "Moderacion",
    aliases: ['setnickname'],
    description: 'Este comando cambia el apodo de un miembro mencionado con su ID o mención',
    usage: '!nickname <Usuario> [Razón]',
    examples: ['!nickname @Wumpus Wumpus321', '!nickname 12345678987654321 Wumpus321'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.ManageNicknames)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")
        if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageNicknames)) return (message.channel as TextChannel).send("No tengo permisos para cambiar apodos")
        if (args.length == 0) return (message.channel as TextChannel).send("Debes elegir un nombre para el usuario")

        let user = message.mentions.members?.first() || message.guild.members.cache.get(args[0]);
        if (contentPrefix !== prefix) user = message.guild.members.cache.get(getUser(args[0], client)?.id ?? "")
        if (!user) user = message.member

        const name = args.slice(1).join(" ");
        if (name.length > 32) return (message.channel as TextChannel).send("El apodo no debe contener más de 32 caracteres")
        if (user.user.id === client.user?.id) {
            await user.setNickname(name)
            return await (message.channel as TextChannel).send("Se ha cambiado mi apodo")
        }
        const role = user.roles.highest;

        if (message.guild.members.me.roles.highest.comparePositionTo(role) < 1) {
            return (message.channel as TextChannel).send("Mi rol es muy bajo para poder cambiarle el nombre");
        }

        await user.setNickname(name)
        await (message.channel as TextChannel).send(`Se ha cambiado el apodo de **${user.user.username}**`)


    }
}