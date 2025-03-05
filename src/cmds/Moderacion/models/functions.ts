import ExtendedClient from '../../../classes/extendedClient';
import GuildModel, { IGuild, ILog, IWarns } from './Guild';
import { Colors, EmbedBuilder, Guild, Message, TextChannel, } from 'discord.js';
import { PermissionFlagsBits } from "discord.js";

export interface snipeType {
  [index: string]: {
    _id: string,
    message: string,
    member: string
  }
}
const snipe: snipeType = {};

const region = {
  "brazil": ":flag_br: Brazil",
  "eu-central": ":flag_eu: Central Europe",
  "singapore": ":flag_sg: Singapore",
  "us-central": ":flag_us: U.S. Central",
  "sydney": ":flag_au: Sydney",
  "us-east": ":flag_us: U.S. East",
  "us-south": ":flag_us: U.S. South",
  "us-west": ":flag_us: U.S. West",
  "eu-west": ":flag_eu: Western Europe",
  "vip-us-east": ":flag_us: VIP U.S. East",
  "london": ":flag_gb: London",
  "amsterdam": ":flag_nl: Amsterdam",
  "hongkong": ":flag_hk: Hong Kong",
  "russia": ":flag_ru: Russia",
  "southafrica": ":flag_za:  South Africa"
};

const getGuild = async (guild: Guild) => {
  let doc = await GuildModel.findOne({ guildID: guild.id })

  if (!doc) {
    const newGuild = new GuildModel({
      guildID: guild.id,
      guildName: guild.name,
      guildOwner: guild.client.users.cache.get(guild.ownerId)?.username,
      guildOwnerID: guild.ownerId,
      prefix: '!',
      JoinMsg: "",
      JoinBool: false,
      LeaveMsg: "",
      LeaveBool: false,
      WelcomeChannel: "",
      LeaveChannel: "",
      LogChannel: "",
      log: {
        Premium: false,
        channelCreate: false,
        channelDelete: false,
        channelUpdate: false,
        emojiCreate: false,
        emojiDelete: false,
        emojiUpdate: false,
        banAdd: false,
        banRemove: false,
        MemberAdd: false,
        MemberRemove: false,
        MemberUpdate: false,
        guildUpdate: false,
        inviteCreate: false,
        inviteDelete: false,
        messageDelete: false,
        messageDeleteBulk: false,
        messageUpdate: false,
        roleCreate: false,
        roleDelete: false,
        roleUpdate: false,
        userUpdate: false,
        voiceState: false
      },
      warns: [],
      role: [],
      muteUsers: [],
      suggestionLevel: 0
    });
    try {
      await newGuild.save();
    } catch (error) {
      console.error(error);
    }
  }
  doc = await GuildModel.findOne({ guildID: guild.id })
  if (doc) return doc.toObject()
}

const updateGuild = async (guild: Guild, settings: Partial<IGuild>) => {
  const data = await getGuild(guild);
  if (data == null) return
  for (const key in settings) {
    if (data[key as keyof IGuild] !== settings[key as keyof IGuild]) (data as Partial<IGuild>)[key as keyof IGuild] = settings[key as keyof IGuild];
    else return;
  }
  return await GuildModel.updateOne({ guildID: guild.id }, settings);
};
const updateLog = async (guild: Guild, settings: Partial<ILog>) => {
  const data = (await getGuild(guild))?.toObject();
  if (data == null || data.log == null) return
  for (const key in settings) {
    if (data.log[key] !== settings[key as keyof ILog]) data.log[key] = settings[key as keyof ILog];
    else return;
  }
  return data?.save()
};
function search(nameKey: string, myArray: Array<IWarns>) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].warnUserID === nameKey) {
      return myArray[i];
    }
  }
}
function searchNumber(nameKey: string, myArray: Array<IWarns>) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].warnUserID === nameKey) {
      return i
    }
  }
}
function checkDays(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days == 0) return "Hoy"
  else return `Hace ${days} ${days == 1 ? "día" : "días"}`;
};

const changeRole = {
  [PermissionFlagsBits.Administrator.toString()]: "Administrador",
  [PermissionFlagsBits.CreateInstantInvite.toString()]: "Crear invitación",
  [PermissionFlagsBits.KickMembers.toString()]: "Expulsar miembros",
  [PermissionFlagsBits.BanMembers.toString()]: "Banear miembros",
  [PermissionFlagsBits.ManageChannels.toString()]: "Gestionar canales",
  [PermissionFlagsBits.ManageGuild.toString()]: "Gestionar servidor",
  [PermissionFlagsBits.AddReactions.toString()]: "Añadir reacciones",
  [PermissionFlagsBits.ViewAuditLog.toString()]: "Ver el registro de auditoría",
  [PermissionFlagsBits.PrioritySpeaker.toString()]: "Prioridad de palabra",
  [PermissionFlagsBits.Stream.toString()]: "Video",
  [PermissionFlagsBits.ViewChannel.toString()]: "Leer canales de texto y canales de voz",
  [PermissionFlagsBits.SendMessages.toString()]: "Enviar mensajes",
  [PermissionFlagsBits.SendTTSMessages.toString()]: "Enviar mensajes de texto a voz",
  [PermissionFlagsBits.ManageMessages.toString()]: "Gestionar mensajes",
  [PermissionFlagsBits.EmbedLinks.toString()]: "Insertar enlaces",
  [PermissionFlagsBits.AttachFiles.toString()]: "Adjuntar archivos",
  [PermissionFlagsBits.ReadMessageHistory.toString()]: "Leer el historial de mensajes",
  [PermissionFlagsBits.MentionEveryone.toString()]: "Mencionar @\u200beveryone, @\u200bhere y todos los roles",
  [PermissionFlagsBits.UseExternalEmojis.toString()]: "Usar emojis externos",
  [PermissionFlagsBits.ViewGuildInsights.toString()]: "Ver información del servidor",
  [PermissionFlagsBits.Connect.toString()]: "Conectar",
  [PermissionFlagsBits.Speak.toString()]: "Hablar",
  [PermissionFlagsBits.MuteMembers.toString()]: "Silenciar miembros",
  [PermissionFlagsBits.DeafenMembers.toString()]: "Ensorceder miembros",
  [PermissionFlagsBits.MoveMembers.toString()]: "Mover miembros",
  [PermissionFlagsBits.UseVAD.toString()]: "Usar Actividad de voz",
  [PermissionFlagsBits.ChangeNickname.toString()]: "Cambiar apodo",
  [PermissionFlagsBits.ManageNicknames.toString()]: "Gestionar apodos",
  [PermissionFlagsBits.ManageRoles.toString()]: "Gestionar roles",
  [PermissionFlagsBits.ManageWebhooks.toString()]: "Gestionar webhooks",
  [PermissionFlagsBits.UseApplicationCommands.toString()]: "Usar comandos de aplicaciones",
  [PermissionFlagsBits.ManageThreads.toString()]: "Gestionar hilos",
  [PermissionFlagsBits.CreatePublicThreads.toString()]: "Crear hilos públicos",
  [PermissionFlagsBits.CreatePrivateThreads.toString()]: "Crear hilos privados",
  [PermissionFlagsBits.RequestToSpeak.toString()]: "Pedir permiso a la palabra",
  [PermissionFlagsBits.ManageEvents.toString()]: "Gestionar eventos",
  [PermissionFlagsBits.UseExternalStickers.toString()]: "Usar stickers externos",
  [PermissionFlagsBits.SendMessagesInThreads.toString()]: "Enviar mensajes en hilos",
  [PermissionFlagsBits.ModerateMembers.toString()]: "Moderar miembros",
};

const changePerm = {
  "channelCreate": "Canal Creado",
  "channelDelete": "Canal Eliminado",
  "emojiCreate": "Emoji Creado",
  "emojiDelete": "Emoji Eliminado",
  "emojiUpdate": "Emoji Actualizado",
  "banAdd": "Baneo",
  "banRemove": "Desbaneo",
  "MemberAdd": "Nuevo Miembro",
  "MemberRemove": "Miembro se va",
  "MemberUpdate": "Miembro Actualizado",
  "guildUpdate": "Servidor Actualizado",
  "inviteCreate": "Invitación Creada",
  "inviteDelete": "Invitación Eliminada",
  "messageDelete": "Mensaje Eliminado",
  "messageUpdate": "Mensaje Editado",
  "roleCreate": "Rol Creado",
  "roleDelete": "Rol Eliminado",
};

function getAll(client: ExtendedClient, message: Message, prefix: string) {
  const embed = new EmbedBuilder()
    .setColor("Random")
    .setThumbnail(client.user?.displayAvatarURL() ?? "")
    .setFooter({ text: `Para información de un comando en especifico use ${prefix}help [comando]` })

  const commands = (category: string) => {
    return client.commands
      .filter(cmd => cmd.category === category && cmd.name !== "hackban")
      .map(cmd => `- \`${cmd.name}\``)
      .join("\n");
  }

  const configCommands = () => {
    const command = client.configs

    return command
      .map(({ name }) => `- \`${name}\``)
      .join("\n");
  }

  return (message.channel as TextChannel).send({
    embeds: [embed
      .setFields([
        {
          name: "Comandos de Información",
          value: commands("Info")
        },
        {
          name: "Comandos de Moderación",
          value: commands("Moderacion")
        },
        {
          name: "Comandos de Música",
          value: commands("Musica")
        },
        {
          name: "Comandos Útiles",
          value: commands("Util")
        },
        {
          name: "Comandos de Configuración",
          value: `Estos son comandos dentro del comando config, se deben usar despues de ${prefix}config.\n\n${configCommands()}`
        }
      ])
    ]
  })
}


function getCMD(client: ExtendedClient, message: Message, input: string) {
  const embed = new EmbedBuilder()

  // Get the cmd by the name or alias
  const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input?.toLowerCase() ?? "") ?? "");

  let info = `**${input.toLowerCase()}** no es un comando valido`;

  // If no cmd is found, send not found embed
  if (!cmd) {
    return (message.channel as TextChannel).send({ embeds: [embed.setColor(Colors.Red).setDescription(info)] });
  } else if (cmd.category === "owner") {
    return (message.channel as TextChannel).send({ embeds: [embed.setColor(Colors.Red).setDescription(info)] });
  }


  // Add all cmd info to the embed
  if (cmd.name) info = `**Nombre del comando**: ${cmd.name}`;
  if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
  if (cmd.description) info += `\n**Descripción**: ${cmd.description}`;
  if (cmd.usage) {
    info += `\n**Uso**: ${cmd.usage}`;
    if (cmd.examples) info += `\n**Ejemplos**: ${cmd.examples.map(a => `\`${a}\``).join(", ")}`;
  }

  return (message.channel as TextChannel).send({ embeds: [embed.setColor("#0088ff").setDescription(info).setFooter({ text: "<> es obligatorio, [] es opcional" })] })
}
function getUser(mention: string, client: ExtendedClient) {
  if (!mention) return;

  mention = mention.replace(/([^0-9])/g, '')

  return client.users.cache.get(mention);
}

const autoRoles = [
  {
    name: "Rojo",
    color: "#ff0f00"
  },
  {
    name: "Naranja",
    color: "#ff7300"
  },
  {
    name: "Amarillo",
    color: "#ffc900"
  },
  {
    name: "Rosado",
    color: "#fb71a3"
  },
  {
    name: "Morado",
    color: "#6e248f"
  },
  {
    name: "Gris",
    color: "#4e5556"
  },
  {
    name: "Negro",
    color: "#000001"
  },
  {
    name: "Blanco",
    color: "#fdfeff"
  },
  {
    name: "Azul",
    color: "#277ecd"
  },
  {
    name: "Celeste",
    color: "#00aae4"
  },
  {
    name: "Invisible",
    color: "#36393f"
  }
]

export {
  getGuild,
  updateGuild,
  search,
  searchNumber,
  checkDays,
  getAll,
  getCMD,
  updateLog,
  getUser,
  changeRole,
  changePerm,
  autoRoles,
  region,
  snipe
}
