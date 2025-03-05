import { Message, PermissionFlagsBits, TextChannel } from "discord.js"
import GuildModel, { IGuild } from "../cmds/Moderacion/models/Guild"
import { getGuild, updateGuild } from "../cmds/Moderacion/models/functions"

export default {
    name: "leavemsg",
    run: async (message: Message, args: string[], method: "enable" | "disable") => {


        if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild || PermissionFlagsBits.ManageChannels)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")
        if (method === "enable") {
            const leaveChannel = (message.mentions.channels.first() || message.guild?.channels.cache.get(args[2])) as TextChannel
            if (!leaveChannel) return (message.channel as TextChannel).send("Debes especificar un canal para enviar el mensaje")
            if (!leaveChannel.permissionsFor(message.guild?.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return (message.channel as TextChannel).send("No tengo permisos para hablar en ese canal")
            const leaveMsg = args.slice(2).join(" ").replace(leaveChannel.id, '')
            if (!leaveMsg) return (message.channel as TextChannel).send("Debes especificar un mensaje de despedida")
            const doc = await GuildModel.findOne({ guildID: message.guildId })
            if (!doc) {
                const newGuild: Partial<IGuild> = {
                    guildID: message.guildId ?? "",
                    guildName: message.guild?.name,
                    guildOwner: message.client.users.cache.get(message.guild?.ownerId ?? "")?.username,
                    guildOwnerID: message.guild?.ownerId,
                    prefix: '!',
                    LeaveMsg: leaveMsg,
                    LeaveBool: true,
                    LeaveChannel: leaveChannel.id
                };
                try {
                    await getGuild(message.guild!);
                    await updateGuild(message.guild!, newGuild)
                } catch (error) {
                    console.error(error);
                }
                return (message.channel as TextChannel).send("Se ha establecido el mensaje de despedida")
            }
            else {
                updateGuild(message.guild!, { LeaveMsg: leaveMsg, LeaveBool: true, LeaveChannel: leaveChannel.id })
                return (message.channel as TextChannel).send("Se ha establecido el mensaje de despedida")
            }
        }
        else if (method === "disable") {
            const doc = await GuildModel.findOne({ guildID: message.guildId })
            if (!doc) {
                (message.channel as TextChannel).send("No existe un mensaje de bienvenida")
                return getGuild(message.guild!)
            }
            else if (doc.LeaveBool == false) return (message.channel as TextChannel).send("Ya estaba desactivado el mensaje")
            else {
                updateGuild(message.guild!, { LeaveMsg: "", LeaveBool: false, LeaveChannel: "" })

                await (message.channel as TextChannel).send("Se ha eliminado el mensaje de despedida")
            }
        }
    }
}
