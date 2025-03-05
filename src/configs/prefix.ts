import { Guild, Message, PermissionFlagsBits, TextChannel } from "discord.js"

import GuildModel, { IGuild } from '../cmds/Moderacion/models/Guild'
import { getGuild, updateGuild } from "../cmds/Moderacion/models/functions"

export = {
  name: "prefix",
  run: async (message: Message, args: string[], prefix: string) => {

    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")
    if (!args[1]) return (message.channel as TextChannel).send(`Mi prefix en este server es ${prefix}`)
    const nPrefix = args.slice(1).join(" ");
    const doc = await GuildModel.findOne({ guildID: message.guildId })
    if (!doc) {
      const newGuild: Partial<IGuild> = {
        guildID: message.guildId ?? "",
        guildName: message.guild?.name,
        guildOwner: message.client.users.cache.get(message.guild?.ownerId ?? "")?.username,
        guildOwnerID: message.guild?.ownerId,
        prefix: nPrefix
      };
      try {
        await getGuild(message.guild!)
        await updateGuild(message.guild!, newGuild)
      } catch (error) {
        console.error(error);
      }
      return (message.channel as TextChannel).send(`Su nuevo Prefix es ${nPrefix}`)
    }
    else {
      updateGuild(message.guild as Guild, { prefix: nPrefix });
      return (message.channel as TextChannel).send(`Su nuevo Prefix es ${nPrefix}`)
    }
  }
}
