import { Message, EmbedBuilder, TextChannel, PermissionFlagsBits, ChannelType } from "discord.js";

export default {
    name: 'server-info',
    category: "Info",
    description: "Este comando muestra la información del server, como el nombre, el id, el dueño, Etc... Se pueden ver los roles del servidor con \"roles\" y los canales con \"channels\" ",
    aliases: ['serverinfo'],
    usage: '!server-info',
    run: async ({ message, args }: { message: Message, args: string[] }) => {
        function checkDays(date: Date) {
            const now = new Date();
            const diff = now.getTime() - date.getTime();
            const days = Math.floor(diff / 86400000);
            return `Hace ${days} ${days == 1 ? "día" : "días"}`;
        };
        const verifLevels = {
            0: "No Hay",
            1: "Bajo",
            2: "Medio",
            3: "Alto",
            4: "Muy Alto"
        };

        const roleEmbed = new EmbedBuilder()
        if (args[0] == "roles" || args[0] === 'r' || args[0] === 'role') {

            if (message.guild?.roles.cache.size == 1) return (message.channel as TextChannel).send("Este servidor no tiene roles")
            if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) return (message.channel as TextChannel).send("No tienes permisos para ver los roles del servidor")
            const roles = message.guild?.roles.cache.map(r => `<@&${r.id}>`).join(", ") ?? ""

            await (message.channel as TextChannel).send(
                {
                    embeds: [roleEmbed.setColor("Random")
                        .setDescription(roles)
                        .setAuthor({ name: `Roles del servidor`, iconURL: message.guild?.iconURL() ?? "" })
                        .setThumbnail(message.guild?.iconURL() ?? "")
                        .setFooter({ text: `${message.guild?.name} | ${message.guildId}` })]
                })
        }
        else if (args[0] === "channels" || args[0] === "channel" || args[0] === "c") {

            if (message.guild?.channels.cache.size == 0) return (message.channel as TextChannel).send("Este servidor no tiene canales")

            if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) return (message.channel as TextChannel).send("No tienes permisos para ver los canales del servidor")
            const channelEmbed = new EmbedBuilder()

            const channels = message.guild?.channels.cache.filter(
                channel => channel.type === ChannelType.GuildText ||
                    channel.type === ChannelType.GuildMedia ||
                    channel.type === ChannelType.GuildForum)
                .map(channel => `<#${channel.id}>`).join(", ") ?? ""

            await (message.channel as TextChannel).send(
                {
                    embeds: [channelEmbed.setColor("Random")
                        .setDescription(channels).setAuthor({ name: `Canales del servidor`, iconURL: message.guild?.iconURL() ?? "" })
                        .setThumbnail(message.guild?.iconURL() ?? "")
                        .setFooter({ text: `${message.guild?.name} | ${message.guildId}` })]
                })
        }

        else {
            const channels = message.guild?.channels.cache.size
            const textChannel = message.guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size
            const voiceChannel = message.guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size
            const stageChannel = message.guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildStageVoice).size

            const channelName = `Canales | ${textChannel == 0 ? "" : `Texto | `}${voiceChannel == 0 ? "" : `Voz | `}${stageChannel == 0 ? "" : "Estadios"}`
            const channelOrder = `${textChannel == 0 ? "" : `${textChannel} | `}${voiceChannel == 0 ? "" : `${voiceChannel} | `}${stageChannel == 0 ? "" : stageChannel}`

            const embed = new EmbedBuilder()
                .setAuthor({ name: message.guild?.name ?? "", iconURL: message.guild?.iconURL() ?? "" })
                .setColor("Random")
                .setFields([
                    {
                        name: "Nombre",
                        value: message.guild?.name ?? "",
                        inline: true
                    },
                    {
                        name: "Dueñ@",
                        value: message.guild?.members.cache.get(message.guild.ownerId)?.nickname ?? "",
                        inline: true
                    },
                    {
                        name: "Miembros | Usuarios | Bots",
                        value: `${message.guild?.members.cache.size} | ${message.guild?.members.cache.filter(member => !member.user.bot).size} | ${message.guild?.members.cache.filter(member => member.user.bot).size}`,
                        inline: true
                    },
                    {
                        name: "Nivel de Verificación",
                        value: verifLevels[message.guild?.verificationLevel ?? 0],
                        inline: true
                    },
                    {
                        name: channelName,
                        value: `${channels} | ${channelOrder}`,
                        inline: true
                    },
                    {
                        name: "Creado a las",
                        value: `${message.guild?.createdAt.toUTCString()} (${message.guild?.createdAt != null ? checkDays(message.guild.createdAt) : ""})`,
                        inline: true
                    }
                ])
                .setThumbnail(message.guild?.iconURL() ?? "")

            if (message.guild?.roles.cache.size != 1) {
                embed.addFields([{
                    name: "Roles",
                    value: `${(message.guild?.roles.cache.size ?? 1) - 1}`,
                    inline: true
                }])
            }
            await (message.channel as TextChannel).send({ embeds: [embed] })
        }
    }
}