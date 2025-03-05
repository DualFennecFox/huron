import { Message, PermissionFlagsBits, TextChannel } from "discord.js";
import GuildModel, { IGuild } from "../cmds/Moderacion/models/Guild";
import { getGuild, updateGuild } from "../cmds/Moderacion/models/functions";

export default {
  name: "logchannel",
  run: async (message: Message, args: string[], method: "enable" | "disable") => {


    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild || PermissionFlagsBits.ManageChannels)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")
    if (method === "enable") {
      const Channel = (message.mentions.channels.first() || message.guild?.channels.cache.get(args[2])) as TextChannel
      if (!Channel) return (message.channel as TextChannel).send("Debes especificar un canal")

      if (!Channel.permissionsFor(message.guild?.members.me ?? "")?.has(PermissionFlagsBits.SendMessages)) return (message.channel as TextChannel).send("No tengo permisos para hablar en ese canal")

      const doc = await GuildModel.findOne({ guildID: message.guildId })
      if (!doc) {
        const newGuild: Partial<IGuild> = {
          guildID: message.guildId ?? "",
          guildName: message.guild?.name,
          guildOwner: message.client.users.cache.get(message.guild?.ownerId ?? "")?.username,
          guildOwnerID: message.guild?.ownerId,
          prefix: '!',
          LogChannel: Channel.id,
        };
        try {
          await getGuild(message.guild!);
          await updateGuild(message.guild!, newGuild)
        } catch (error) {
          console.error(error);
        }
      }
      else updateGuild(message.guild!, { LogChannel: Channel.id })

      return (message.channel as TextChannel).send("Se ha establecido el canal de registros")
    }
    else if (method === "disable") {
      const doc = await GuildModel.findOne({ guildID: message.guild!.id })
      if (!doc) {
        (message.channel as TextChannel).send("No existe un canal para logear")
        return getGuild(message.guild!)
      }
      else if (!doc.LogChannel) return (message.channel as TextChannel).send("No existe un canal para logear")
      else {
        updateGuild(message.guild!, { LogChannel: "" })

        await (message.channel as TextChannel).send("Se ha eliminado el canal de logeos")
      }
    }
  }
}
