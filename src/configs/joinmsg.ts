import { Message, PermissionFlagsBits, TextChannel } from "discord.js"
import GuildModel, { IGuild } from "../cmds/Moderacion/models/Guild"
import { getGuild, updateGuild } from "../cmds/Moderacion/models/functions"

export default {
    name: "joinmsg",
    run: async (message: Message, args: string[], method: "enable" | "disable") => {

        if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild || PermissionFlagsBits.ManageChannels)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")
        if (method === "enable") {

            const welcomeChannel = (message.mentions.channels.first() || message.guild?.channels.cache.get(args[2])) as TextChannel
            if (!welcomeChannel) return (message.channel as TextChannel).send("Debes especificar un canal para enviar el mensaje")
            if (!welcomeChannel.permissionsFor(message.guild?.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return (message.channel as TextChannel).send("No tengo permisos para hablar en ese canal")

            const welcomeMsg = args.slice(2).join(" ").replace(`<#${welcomeChannel.id}>`, '')
            if (!welcomeMsg) return (message.channel as TextChannel).send("Debes especificar un mensaje de bienvenida")

            const doc = await GuildModel.findOne({ guildID: message.guildId })
            if (!doc) {
                const newGuild: Partial<IGuild> = {
                    guildID: message.guildId ?? "",
                    guildName: message.guild?.name,
                    guildOwner: message.client.users.cache.get(message.guild?.ownerId ?? "")?.username,
                    guildOwnerID: message.guild?.ownerId,
                    prefix: '!',
                    JoinMsg: welcomeMsg,
                    JoinBool: true,
                    WelcomeChannel: welcomeChannel.id,
                };
                try {
                    await getGuild(message.guild!);
                    await updateGuild(message.guild!, newGuild)

                } catch (error) {
                    console.error(error);
                }
                return (message.channel as TextChannel).send("Se ha establecido el mensaje de bienvenida")
            }
            else {
                updateGuild(message.guild!, { JoinMsg: welcomeMsg, JoinBool: true, WelcomeChannel: welcomeChannel.id })

                return (message.channel as TextChannel).send("Se ha establecido el mensaje de bienvenida")
            }
        }
        else if (method === "disable") {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild || PermissionFlagsBits.ManageChannels)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")

            const doc = await GuildModel.findOne({ guildID: message.guildId })
            if (!doc) {
                (message.channel as TextChannel).send("No existe un mensaje de bienvenida")
                return getGuild(message.guild!)
            }
            else if (doc.JoinBool == false) return (message.channel as TextChannel).send("Ya estaba desactivado el mensaje")
            else {
                updateGuild(message.guild!, { JoinMsg: "", JoinBool: false, WelcomeChannel: "" })

                await (message.channel as TextChannel).send("Se ha eliminado el mensaje de bienvenida")
            }
        }
    }
}
