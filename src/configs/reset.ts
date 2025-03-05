import { Message, PermissionFlagsBits, TextChannel } from "discord.js";
import { updateGuild } from "../cmds/Moderacion/models/functions";
import GuildModel, { IGuild } from "../cmds/Moderacion/models/Guild";

module.exports = {
    name: "reset",
    run: async (message: Message) => {
        if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")

        const doc = await GuildModel.findOne({ guildID: message.guildId })
        if (!doc) return (message.channel as TextChannel).send("No se ha modificado ningún ajuste")

        const newGuild: Partial<IGuild> = {
            guildID: message.guildId ?? "",
            guildName: message.guild?.name,
            guildOwner: message.client.users.cache.get(message.guild?.ownerId ?? "")?.username,
            guildOwnerID: message.guild?.ownerId,
            prefix: '!',
            JoinMsg: "",
            JoinBool: false,
            LeaveMsg: "",
            LeaveBool: false,
            WelcomeChannel: "",
            LeaveChannel: "",
            LogChannel: "",
        };

        await updateGuild(message.guild!, newGuild)

        return (message.channel as TextChannel).send("Se han reseteado de fábrica las configuraciones")
    }
}