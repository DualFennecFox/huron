import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from 'discord.js';
import { getUser } from './models/functions';
import ExtendedClient from '../../classes/extendedClient';

module.exports = {
    name: 'unban',
    category: "Moderacion",
    description: 'Este comando Desbanea al usuario mencionado con su ID, también puedes dar una razón de ello',
    usage: '!unban <Usuario> [Razón]',
    examples: ['!unban @Wumpus', '!unban 12345678987654321', '!unban @Wumpus Spam'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!");
        if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) return (message.channel as TextChannel).send("No tengo permisos para Banear miembros");
        if (args.length == 0) return (message.channel as TextChannel).send("Debes mencionar a un usuario o darme su id")
        let User = message.mentions.users.first() || client.users.cache.get(args[0])
        if (contentPrefix !== prefix) User = getUser(args[0], client)
        if (!User) {
            const UserID = args[0].replace(/([^0-9])/g, '')
            User = await client.users.fetch(UserID);
        }
        if (!User) return (message.channel as TextChannel).send("Ese no parece ser un usuario valido");
        const bReason = `[${message.author.tag}]: ${args.slice(1).join(" ") || "No se específico una Razón"}`;
        const bans = await message.guild.bans.fetch();

        const bannedMember = bans.find(user => user.user.id === User.id)

        if (!bannedMember) return (message.channel as TextChannel).send("Este usuario no esta baneado")

        try {
            message.guild.members.unban(User, bReason)
        } catch (err) {
            console.log(err)
            return (message.channel as TextChannel).send("Se ha ocurrido un error al desbanear a este usuario")
        }

        const unbanEmbed = new EmbedBuilder()
            .setAuthor({ name: "UnBan", iconURL: User.displayAvatarURL() })
            .setColor("#0088ff")
            .setFields([
                {
                    name: "Usuario Desbaneado",
                    value: `${User}\n**ID:** ${User.id}`
                },
                {
                    name: "Razón",
                    value: bReason
                }
            ])

        await (message.channel as TextChannel).send({ embeds: [unbanEmbed] })
    }
}
