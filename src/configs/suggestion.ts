import { Message, PermissionFlagsBits, TextChannel } from "discord.js"
import GuildModel, { IGuild } from '../cmds/Moderacion/models/Guild'
import { getGuild, updateGuild } from "../cmds/Moderacion/models/functions"

export default {
    name: "suggestion",
    run: async (message: Message, args: string[], method: "enable" | "disable") => {


        if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")
        if (method === "enable") {

            const channel = message.mentions.channels.first() || message.guild?.channels.cache.get(args[2])

            if (!channel) return (message.channel as TextChannel).send("Debes especificar un canal")
            const doc = await GuildModel.findOne({ guildID: message.guildId })
            if (!doc) {
                const newGuild: Partial<IGuild> = {
                    guildID: message.guildId ?? "",
                    guildName: message.guild?.name,
                    guildOwner: message.client.users.cache.get(message.guild?.ownerId ?? "")?.username,
                    guildOwnerID: message.guild?.ownerId,
                    prefix: '!',
                    suggestionChannel: channel.id,
                    suggestionLevel: 1
                };
                try {
                    await getGuild(message.guild!);
                    await updateGuild(message.guild!, newGuild)
                } catch (error) {
                    console.error(error);
                }
            }
            else updateGuild(message.guild!, { suggestionChannel: channel.id, suggestionLevel: 1 })

            return (message.channel as TextChannel).send("Se ha establecido el canal de sugerencias")
        }
        else if (method === "disable") {
            const doc = await GuildModel.findOne({ guildID: message.guildId })
            if (!doc) {
                (message.channel as TextChannel).send("No existe un canal de sugerencias")
                return getGuild(message.guild!)
            }

            else if (!doc.suggestionChannel) return (message.channel as TextChannel).send("No existe un canal de sugerencias")

            else {
                updateGuild(message.guild!, { suggestionChannel: "" })

                await (message.channel as TextChannel).send("Se han eliminado las sugerencias")
            }
        }
    }
}