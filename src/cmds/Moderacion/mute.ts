import { EmbedBuilder, Message } from 'discord.js';
import { getUser } from './models/functions';
import GuildModel from './models/Guild';
import { PermissionFlagsBits, TextChannel } from "discord.js";
import ExtendedClient from '../../classes/extendedClient';

export default {
    name: 'mute',
    category: "Moderacion",
    description: 'Este comando Mutea al usuario mencionado con su ID o mención, también puedes dar una razón de ello',
    usage: '!mute <Usuario> [Razón]',
    examples: ['!mute @Wumpus', '!mute 12345678987654321', '!mute @Wumpus No ser Wumpus'],
    run: async ({ client, message, args, prefix, contentPrefix }: {
        client: ExtendedClient,
        message: Message,
        args: string[],
        prefix: string,
        contentPrefix: string
    }) => {
        if (!(message.channel instanceof TextChannel)) return
        if (!message.member?.permissions.has(PermissionFlagsBits.KickMembers || PermissionFlagsBits.BanMembers)) return message.channel.send("No tienes permisos para usar este comando!");
        if (!(args.length >= 1)) return message.channel.send("Debe mencionar un usuario muteado o darme su id")

        let mutee = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if (contentPrefix !== prefix) mutee = message.guild?.members.cache.get(getUser(args[0], client)?.id ?? "")
        if (!mutee) return message.channel.send("Ese no parece ser un usuario valido");

        if (mutee.id === message.author.id) return message.channel.send("No te puedes mutear a ti mismo!");
        if (mutee.id === client.user?.id) return message.channel.send("No me voy a mutear 🙄")
        if (!message.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) return message.channel.send("No tengo permisos para añadir roles");

        if (mutee.permissions.has(PermissionFlagsBits.KickMembers || PermissionFlagsBits.BanMembers)) return message.channel.send("Esta persona no puede ser muteada!");


        const mReason = `[${message.author.tag}]: ${args.slice(1).join(" ") || "No se específico una Razón"}`;

        const doc = await GuildModel.findOne({ guildID: message.guildId })
        if (!doc) return message.channel.send("No existe un rol para mutear, asegurate de declararlo en las configuraciones")

        const muterole = message.guild.roles.cache.get(doc.muterole)
        if (!muterole) return message.channel.send("No existe un rol para mutear, asegurate de declararlo en las configuraciones")

        if (message.guild.members.me.roles.highest.comparePositionTo(muterole) < 1) {
            return message.channel.send("Mi rol es muy bajo para asignar el rol mute!");
        }
        if (mutee.roles.cache.some(r => r.id === muterole.id)) return message.channel.send("Este usuario ya esta muteado")

        mutee.roles.add(muterole.id, mReason);
        if (!doc.muteUsers?.includes(mutee.id)) {
            doc.muteUsers.push(mutee.id)

            await doc.save()
        }

        const muteEmbed = new EmbedBuilder()
            .setAuthor({ name: "Mute", iconURL: mutee.user.displayAvatarURL() })
            .setColor("#0088ff")
            .setFields([
                {
                    name: "Usuario Muteado",
                    value: `${mutee}\n**ID:** ${mutee.id}`
                },
                {
                    name: "Razón",
                    value: mReason
                }
            ])

        message.channel.send({ embeds: [muteEmbed] })
            .catch(err => {
                console.error(err);
            })
    }
}