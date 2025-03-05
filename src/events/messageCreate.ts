import { ActivityType, GuildMember, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import ExtendedClient from "../classes/extendedClient";

import GuildModel from '../cmds/Moderacion/models/Guild';

export default async function messageCreate(message: Message) {
  const client = message.client as ExtendedClient
  if (message.author.bot && message.author.id != "1225644162196701245") return;

  if (message.channel instanceof TextChannel) {

    if (!message.channel.permissionsFor(message.guild?.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return


    let prefixes: string[] = ["!", `<@${client.user?.id}>`, `<@!${client.user?.id}>`];
    let contentPrefix: string = "";
    let prefix: string = "!";
    let currentmsg = message.content

    if (message.author.id === "1225644162196701245" && message.embeds[0]?.description) {
      currentmsg = message.embeds[0].description
    }


    const owner = process.env.OWNER

    const result = (await GuildModel.findOne({ guildID: message.guildId }))?.toObject()
    if (result) {
      prefixes = [result.prefix, `<@${client.user?.id}>`, `<@!${client.user?.id}>`]
      prefix = result.prefix
    }

    for (const thePrefix of prefixes) {
      if (currentmsg.startsWith(thePrefix)) contentPrefix = thePrefix
    }
    if (!contentPrefix) return;

    const args = currentmsg.slice(contentPrefix.length).trim().split(/ +/g);
    const cmd = args.shift()?.toLowerCase() ?? "";
    let command;

    if (currentmsg === "Reset Status") {
      if (message.author.id != owner) return

      const scount = client.guilds.cache.size
      client.user?.setPresence({
        status: "online",
        activities: [{
          name: `Estoy en ${scount} Servidores!`,
          type: ActivityType.Streaming,
          url: "https://trovo.live/DualFennecFox"
        }]
      });
    }
    if (currentmsg === `<@${client.user?.id}>` || currentmsg === `<@!${client.user?.id}>`) {
      message.channel.send(`Mi prefix en este server es ${prefix} o una mención, si es la primera vez que me usa escriba ${prefix}help.`)
    }

    if (!currentmsg.startsWith(contentPrefix)) return;

    if (client.commands.has(cmd)) {

      command = client.commands.get(cmd);
    } else {
      command = client.commands.get(client.aliases.get(cmd) ?? "");
    }
    if (command) {
      if (command.category === "owner" && message.author.id !== process.env.OWNER) return

      command.run({ client, message, args, prefix, contentPrefix });
    };
  }
}