import { ActivityType, GuildMember, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import ExtendedClient from "../classes/extendedClient";

import GuildModel from '../cmds/Moderacion/models/Guild';
import afkStatus from "../cmds/Info/req/afkStatus";

export default async function messageCreate(message: Message) {
  const client = message.client as ExtendedClient
  if (message.author.bot && message.author.id != "1225644162196701245") return; 

  if (message.channel instanceof TextChannel) {

    if (!message.channel.permissionsFor(message.guild?.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) return

    if (message.mentions.members) message.mentions.members.forEach(member => {
      if (afkStatus[member.id] && member.id != message.author.id && afkStatus[member.id].status == true) {
        let time = afkStatus[member.id].minutes;
        let customMessage = afkStatus[member.id].customMessage;
        let start = afkStatus[member.id].start;
        let end = new Date();
        let diff = (end.getTime() - start.getTime()) / 1000; // seconds elapsed
        if (time > 0 && diff >= time * 60) {
          afkStatus[member.id].status = false;
        } else {
          let msg = `${message.author}, ${member.user.username} está actualmente AFK,`;
          if (time > 0) {
            if (time < 1) {
              let remainingSeconds = Math.ceil(time * 60 - diff);
              msg += ` le quedan **${remainingSeconds} segundos**`;
            } else {
              let finalTime = parseFloat((diff / 60).toFixed(1));
              let remainingTime = parseFloat((time - finalTime).toFixed(1));
              msg += ` le quedan **${remainingTime} minutos**`;
            }
          } else {
            msg += ' **indefinidamente**';
          }
          if (customMessage) msg += ` con el mensaje: **${customMessage}**`;
          (message.channel as TextChannel).send(msg);
        }
      }
    })

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
    if (afkStatus[message.author.id] && afkStatus[message.author.id].status == true && currentmsg != `${contentPrefix}afk`) {
      afkStatus[message.author.id].status = false
      await message.channel.send(`Bienvenido de vuelta ${message.author}, he desactivado tu estado AFK.`);
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