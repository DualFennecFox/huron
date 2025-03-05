import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from 'discord.js';
import GuildModel from './models/Guild';
import { search, getUser } from './models/functions';
import ExtendedClient from '../../classes/extendedClient';

export default {
    name: 'infractions',
    category: "Moderacion",
    description: 'Este comando muestra el número de infracciones de un usuario, la razón y el usuario que lo advirtio',
    aliases: ['warns', 'check', 'strikes'],
    usage: '!infractions <Usuario>',
    examples: ['!infractions @Wumpus', '!infractions 12345678987654321'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers || PermissionFlagsBits.KickMembers)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!");
        if (args.length == 0) return (message.channel as TextChannel).send("Debes mencionar a un usuario o darme su id")

        let bUser = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if (contentPrefix !== prefix) bUser = message.guild?.members.cache.get(getUser(args[0], client)?.id ?? "")
        if (!bUser) return (message.channel as TextChannel).send("Ese no parece ser un usuario valido");

        const db = await GuildModel.findOne({ guildID: message.guildId })

        if (!db) return (message.channel as TextChannel).send("Este usuario no tiene advertencias")

        const doc = search(bUser.id, db.warns)

        if (!doc) return (message.channel as TextChannel).send("Este usuario no tiene advertencias")

        const warns: string[] = []
        for (let i = 0; i < doc.warnLevel; i++) {
            warns.push(`**Usuario:** <@!${doc.warnedByID[i]}>\n**Razón:** ${doc.warnReason[i]}`)
        }
        const map = warns.join("\n\n")

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Infracciones de: ${bUser.user.tag}`, iconURL: bUser.user.displayAvatarURL({ extension: "png" }) })
            .setColor("#FF0000")
            .setDescription(`**Este usuario tiene ${warns.length} advertencias.**\n\n${map}`)
            .setFooter({ text: `${bUser.user.username} | ${bUser.user.id}` })

        await (message.channel as TextChannel).send({ embeds: [embed] })
    }
}