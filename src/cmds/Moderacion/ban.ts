import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from 'discord.js';
import { getUser } from './models/functions';
import ExtendedClient from '../../classes/extendedClient';

export default {
    name: 'ban',
    category: "Moderacion",
    description: 'Este comando banea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!ban <Usuario> [Razón]',
    examples: ['!ban @Firulais', '!ban 556540723235651584', '!ban @Firulais Razon'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!");
        if (args.length == 0) return (message.channel as TextChannel).send("Debes mencionar a un usuario o darme su id")
        let User = message.mentions.users.first() || client.users.cache.get(args[0])
        if (contentPrefix !== prefix) User = getUser(args[0], client)
        if (!User) {
            const UserID = args[0].replace(/([^0-9])/g, '')
            User = await client.users.fetch(UserID);
        }
        if (!User) return (message.channel as TextChannel).send("Ese no parece ser un usuario valido");
        const bReason = `[${message.author.tag}]: ${args.slice(1).join(" ") || "No se específico una Razón"}`;

        const bans = await message.guild?.bans.fetch();

        const bannedMember = bans?.find(user => user.user.id === User.id)

        if (bannedMember) return (message.channel as TextChannel).send("Este usuario ya esta baneado")

        if (User.id === message.author.id) return (message.channel as TextChannel).send("No te puedes banear a ti mismo")
        if (User.id === client.user?.id) return (message.channel as TextChannel).send("No me voy a banear.")
        if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) return (message.channel as TextChannel).send("No tengo permisos para Banear miembros");

        if (message.guild.members.cache.get(User?.id)) {
            const bUser = message.guild.members.cache.get(User?.id)
            const role = bUser?.roles.highest;
            if (bUser?.permissions.has(PermissionFlagsBits.BanMembers)) return (message.channel as TextChannel).send("Esta persona no puede ser baneada!");

            if (role != null && message.guild.members.me.roles.highest.comparePositionTo(role) < 1) {
                return (message.channel as TextChannel).send("Mi rol es muy bajo para banearlo!");
            }
        }

        const banEmbed = new EmbedBuilder()
            .setAuthor({ name: "Ban", iconURL: User.displayAvatarURL({ extension: "png" }) })
            .setColor("#0088ff")
            .setFields(
                [
                    {
                        name: "Usuario Baneado",
                        value: `${User}\n**ID:** ${User.id}`
                    },
                    {
                        name: "Razón",
                        value: bReason
                    }
                ]
            )

        try {
            await message.guild.members.ban(User.id, { reason: bReason })
        } catch (err) {
            console.error(err)
            return (message.channel as TextChannel).send("Se ha ocurrido un error al banear a este usuario")
        }

        await (message.channel as TextChannel).send({ embeds: [banEmbed] })
    }
}
