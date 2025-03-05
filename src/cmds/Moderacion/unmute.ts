import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from 'discord.js';
import { getUser } from './models/functions';
import Guild from './models/Guild';
import ExtendedClient from '../../classes/extendedClient';

export default {
    name: 'unmute',
    category: "Moderacion",
    description: 'Este comando Desmutea al usuario mencionado con su ID o mención Ej: `!unmute @Firulais`, `!unmute 556540723235651584` También puedes dar una razón de ello',
    usage: '!unmute <Usuario> [Razón]',
    examples: ['!unmute @Wumpus', '!unmute 123456789876543210', '!unmute @Wumpus Me equivoque si es Wumpus'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.KickMembers || PermissionFlagsBits.BanMembers)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!")
        if (args.length == 0) return (message.channel as TextChannel).send("Debe mencionar un usuario muteado o darme su id")

        if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) return (message.channel as TextChannel).send("No tengo permisos para añadir roles");

        let unmutee = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if (contentPrefix !== prefix) unmutee = message.guild.members.cache.get(getUser(args[0], client)?.id ?? "")
        if (!unmutee) return (message.channel as TextChannel).send("Ese no parece ser un usuario valido");
        if (unmutee.id === message.author.id) return (message.channel as TextChannel).send("No te puedes mutear a ti mismo!");
        if (unmutee.id === client.user?.id) return (message.channel as TextChannel).send("No.")

        const mReason = `[${message.author.tag}]: ${args.slice(1).join(" ") || "No se específico una Razón"}`;

        const doc = await Guild.findOne({ guildID: message.guild.id })
        if (!doc) return (message.channel as TextChannel).send("No existe un rol para mutear, asegurate de declararlo en las configuraciones")

        const muterole = message.guild.roles.cache.get(doc.muterole)
        if (!muterole) return (message.channel as TextChannel).send("No existe un rol para mutear, asegurate de declararlo en las configuraciones")

        if (!unmutee.roles.cache.some(r => r.id === muterole.id)) return (message.channel as TextChannel).send("Este usuario no esta muteado")
        unmutee.roles.remove(muterole.id, mReason);

        if (doc.muteUsers.includes(unmutee.id)) {
            doc.muteUsers.splice(doc.muteUsers.indexOf(unmutee.id), 1)

            await doc.save()
        }

        const unmuteEmbed = new EmbedBuilder()
            .setAuthor({ name: "UnMute", iconURL: unmutee.user.displayAvatarURL({ extension: "png" }) })
            .setColor("#0088ff")
            .setFields([
                {
                    name: "Usuario Desmuteado",
                    value: `${unmutee}\n**ID:** ${unmutee.id}`
                },
                {
                    name: "Razón",
                    value: mReason
                }
            ])

        await (message.channel as TextChannel).send({ embeds: [unmuteEmbed] })
    }
}