import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from 'discord.js';
import { getUser } from './models/functions';
import ExtendedClient from '../../classes/extendedClient';

export default {
    name: 'kick',
    category: "Moderacion",
    description: 'Este comando kickea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!kick <Usuario> [Razón]',
    examples: ['!kick @Wumpus', '!kick 12345678987654321', '!kick @Wumpus Este no es Wumpus'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.KickMembers)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!");
        if (args.length == 0) return (message.channel as TextChannel).send("Debes mencionar a un usuario o darme su id")

        let kUser = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if (contentPrefix !== prefix) kUser = message.guild?.members.cache.get(getUser(args[0], client)?.id ?? "")
        if (!kUser) return (message.channel as TextChannel).send("Ese no parece ser un usuario valido");

        const kReason = `[${message.author.tag}]: ${args.slice(1).join(" ") || "No se específico una Razón"}`;

        if (kUser.id === client.user?.id) return (message.channel as TextChannel).send("No puedo expulsarme a mi mismo")
        if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.KickMembers)) return (message.channel as TextChannel).send("No tengo permisos para expulsar miembros");
        if (kUser.permissions.has(PermissionFlagsBits.KickMembers)) return (message.channel as TextChannel).send("Esta persona no puede ser expulsada!");
        if (kUser.id === message.author.id) return (message.channel as TextChannel).send("No te puedes expulsar a ti mismo")

        const role = kUser.roles.highest;

        if (message.guild.members.me.roles.highest.comparePositionTo(role) < 1) {
            return (message.channel as TextChannel).send("Mi rol es muy bajo para poder expulsarlo!");
        }


        const kickEmbed = new EmbedBuilder()
            .setAuthor({ name: "Kick", iconURL: kUser.user.displayAvatarURL({ extension: "png" }) })
            .setColor("#0088ff")
            .setFields([
                {
                    name: "Usuario Expulsado",
                    value: `${kUser}\n**ID:** ${kUser.id}`
                },
                {
                    name: "Razón",
                    value: kReason
                }
            ])

        try {
            await message.guild.members.cache.get(kUser?.id)?.kick(kReason);
        } catch (err) {
            console.error(err)
            return (message.channel as TextChannel).send("Ha ocurrido un error al expulsar a este usuario")
        }
        await (message.channel as TextChannel).send({ embeds: [kickEmbed] })
    }
}