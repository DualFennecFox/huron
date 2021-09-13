const Guild = require('./Guild')
const defaultSettings = require('./config')
const mongoose = require('mongoose');
const { MessageEmbed, Intents, Permissions } = require('discord.js')

let region = {
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

const perms = {

  administrator: Permissions.FLAGS.ADMINISTRATOR,
  create_instant_invite: Permissions.FLAGS.CREATE_INSTANT_INVITE,
  kick_members: Permissions.FLAGS.KICK_MEMBERS,
  ban_members: Permissions.FLAGS.BAN_MEMBERS,
  manage_channels: Permissions.FLAGS.MANAGE_CHANNELS,
  manage_guild: Permissions.FLAGS.MANAGE_GUILD,
  add_reactions: Permissions.FLAGS.ADD_REACTIONS,
  view_audit_log: Permissions.FLAGS.VIEW_AUDIT_LOG,
  priority_speaker: Permissions.FLAGS.PRIORITY_SPEAKER,
  stream: Permissions.FLAGS.STREAM,
  view_channel: Permissions.FLAGS.VIEW_CHANNEL,
  send_messages: Permissions.FLAGS.SEND_MESSAGES,
  send_tts_messages: Permissions.FLAGS.SEND_TTS_MESSAGES,
  manage_messages: Permissions.FLAGS.MANAGE_MESSAGES, 
  embed_links: Permissions.FLAGS.EMBED_LINKS,
  attach_files: Permissions.FLAGS.ATTACH_FILES,
  read_message_history: Permissions.FLAGS.READ_MESSAGE_HISTORY,
  mention_everyone: Permissions.FLAGS.MENTION_EVERYONE,
  use_external_emojis: Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
  view_guild_insights: Permissions.FLAGS.VIEW_GUILD_INSIGHTS,
  connect: Permissions.FLAGS.CONNECT,
  speak: Permissions.FLAGS.SPEAK,
  mute_members : Permissions.FLAGS.MUTE_MEMBERS,
  deafen_members: Permissions.FLAGS.DEAFEN_MEMBERS,
  move_members: Permissions.FLAGS.MOVE_MEMBERS,
  use_vad: Permissions.FLAGS.USE_VAD,
  change_nickname: Permissions.FLAGS.CHANGE_NICKNAME,
  manage_nicknames: Permissions.FLAGS.MANAGE_NICKNAMES, 
  manage_roles: Permissions.FLAGS.MANAGE_ROLES,
  manage_webhooks: Permissions.FLAGS.MANAGE_WEBHOOKS,
  manage_emojis_and_stickers: Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS
}

const requiredIntent = [ 
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Intents.FLAGS.GUILD_INVITES,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]

let getGuild = async (guild) => {
    var doc
    Guild.findOne({ guildID: guild.id }).then(async result => {

   if (result) doc = result
    else {
      const newGuild = {
        guildID: guild.id,
        guildName: guild.name,
        guildOwner: guild.members.cache.get(guild.ownerID).username,
        guildOwnerID: guild.ownerID,
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
      };
      try {
        await createGuild(newGuild);
      } catch (error) {
        console.error(error);
      }
    }
    }).catch(err => {
      console.error(err)
    })
    let db = await Guild.findOne({ guildID: guild.id })
    doc = db
    if (doc) return doc
  }
  
  let updateGuild = async (guild, settings) => {
    let data = getGuild(guild);
    if (typeof data !== 'object') data = {};
    for (const key in settings) {
        if (data[key] !== settings[key]) data[key] = settings[key];
        else return;
    }
    return Guild.updateOne({ guildID: guild.id }, settings);
  };
  let updateLog = async (guild, settings) => {
Guild.findOne({ guildID: guild.id }).then(data => {
    if (typeof data.log !== 'object') data.log = {};
    for (const key in settings) {
        if (data.log[key] !== settings[key]) data.log[key] = settings[key];
        else return;
    }
    return data.save()
  }).catch(err => {
    console.error(err)
  })
  };
  let createGuild = async (settings) => {
    let defaults = Object.assign({ _id: mongoose.Types.ObjectId() });
    let merged = Object.assign(defaults, settings);
  
    const newGuild = new Guild(merged);
    return newGuild.save()
  }
  function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].warnUserID === nameKey) {
            return myArray[i];
        }
    }
}
function searchNumber(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
  if (myArray[i].warnUserID === nameKey) {
      return i
  }
}
}
function checkDays(date) {
  let now = new Date();
  let diff = now.getTime() - date.getTime();
  let days = Math.floor(diff / 86400000);
  if (days == 0) return "Hoy"
  else return `Hace ${days} ${days == 1 ? "día" : "días"}`;
};

const changeRole = {
  "ADMINISTRATOR": "Administrador",
  "CREATE_INSTANT_INVITE": "Crear invitación",
  "KICK_MEMBERS": "Expulsar miembros",
  "BAN_MEMBERS": "Banear miembros",
  "MANAGE_CHANNELS": "Gestionar canales",
  "MANAGE_GUILD": "Gestionar servidor",
  "ADD_REACTIONS": "Añadir reacciones",
  "VIEW_AUDIT_LOG": "Ver el registro de auditoría",
  "PRIORITY_SPEAKER": "Prioridad de palabra",
  "STREAM": "Video",
  "VIEW_CHANNEL": "Leer canales de texto y canales de voz",
  "SEND_MESSAGES": "Enviar mensajes",
  "SEND_TTS_MESSAGES": "Enviar mensajes de texto a voz",
  "MANAGE_MESSAGES": "Gestionar mensajes", 
  "EMBED_LINKS": "Insertar enlaces",
  "ATTACH_FILES": "Adjuntar archivos",
  "READ_MESSAGE_HISTORY": "Leer el historial de mensajes",
  "MENTION_EVERYONE": "Mencionar \@everyone, \@here y todos los roles",
  "USE_EXTERNAL_EMOJIS": "Usar emojis externos",
  "VIEW_GUILD_INSIGHTS": "Ver información del servidor",
  "CONNECT": "Conectar",
  "SPEAK": "Hablar",
  "MUTE_MEMBERS" : "Silenciar miembros",
  "DEAFEN_MEMBERS": "Ensorceder miembros",
  "MOVE_MEMBERS": "Mover miembros",
  "USE_VAD": "Usar Actividad de voz",
  "CHANGE_NICKNAME": "Cambiar apodo",
  "MANAGE_NICKNAMES": "Gestionar apodos", 
  "MANAGE_ROLES": "Gestionar roles",
  "MANAGE_WEBHOOKS": "Gestionar webhooks",
  "MANAGE_EMOJIS_AND_STICKERS": "Gestionar emojis y stickers"
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

function getAll(client, message, prefix) {
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Para información de un comando en especifico use ${prefix}help [comando]`)
        
const commands = (category) => {
    return client.commands
        .filter(cmd => cmd.category === category && cmd.name !== "hackban")
        .map(cmd => `- \`${cmd.name}\``)
        .join("\n");
} 

const configCommands = () => {
  let command = [ "joinmsg", "leavemsg", "logchannel", "muterole", "suggestion", "prefix"]

  return command
        .map(name => `- \`${name}\``)
        .join("\n");
}

    return message.channel.send({ embeds: [embed
    .addField("Comandos de Información", commands("Info"))
    .addField("Comandos de Moderación", commands("Moderacion"))
    .addField("Comandos de Música", commands("Musica"))
    .addField("Comandos Útiles", commands("Util"))
    .addField("Comandos de Configuración", `Estos son comandos dentro del comando config, se deben usar despues de ${prefix}config.\n\n${configCommands()}`)]})

}


function getCMD(client, message, input) {
  const embed = new MessageEmbed()

  // Get the cmd by the name or alias
  const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
  
  let info = `**${input.toLowerCase()}** no es un comando valido`;

  // If no cmd is found, send not found embed
  if (!cmd) {
      return message.channel.send(embed.setColor("RED").setDescription(info));
  } else if (cmd.category === "owner") {
    return message.channel.send(embed.setColor("RED").setDescription(info));
  }


  // Add all cmd info to the embed
  if (cmd.name) info = `**Nombre del comando**: ${cmd.name}`;
  if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
  if (cmd.description) info += `\n**Descripción**: ${cmd.description}`;
  if (cmd.usage) {
      info += `\n**Uso**: ${cmd.usage}`;
  if (cmd.examples) info += `\n**Ejemplos**: ${cmd.examples.map(a => `\`${a}\``).join(", ")}`;
  }

  return message.channel.send({ embeds: [embed.setColor("#0088ff").setDescription(info).setFooter("<> es obligatorio, [] es opcional")]})
  .catch(err => {
      console.log(err)
  })
}
function getUser(mention, client) {
  if (!mention) return;
  
    mention = mention.replace(/([^0-9])/g, '')
  
		return client.users.cache.get(mention?.id);
  }

let autoRoles = [
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

module.exports = {
    getGuild,
    updateGuild,
    createGuild,
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
    requiredIntent,
    perms,
    region
}
