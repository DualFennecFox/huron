const Guild = require('./Guild')
const defaultSettings = require('./config')
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

let getGuild = async (guild) => {
    Guild.findOne({ guildID: guild.id }).then(result => {
   if (result) defaultSettings.prefix = result.prefix
    else {
      const newGuild = {
        guildID: guild.id,
        guildName: guild.name,
        guildOwner: guild.owner.user.username,
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
        warns: []
      };
      try {
        createGuild(newGuild);
      } catch (error) {
        console.error(error);
      }
    }
    }).catch(err => {
      console.error(err)
    })
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
  return `Hace ${days} ${days == 1 ? "día" : "días"}`;
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
  "MANAGE_EMOJIS": "Gestionar emojis"
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
    "roleUpdate": "Rol Actualizado"
};

function getAll(client, message, prefix) {
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Para información de un comando en especifico use ${prefix}help [comando]`)
        
const commands = (category) => {
    return client.commands
        .filter(cmd => cmd.category === category && cmd.name !== "log" && cmd.name !== "logchannel")
        .map(cmd => `\`${cmd.name}\``)
        .join(", ");
} 

    return message.channel.send(embed.setDescription(`Estos son todos los comandos, si necesita ayuda vea la sección **Invite**.`)
    .addField("Comandos de Información", commands("Info"))
    .addField("Comandos de Moderación", commands("Moderacion"))
    .addField("Comandos de Música", commands("Musica"))
    .addField('Invite', '[Server de Soporte](https://discord.gg/EnWH5HG) | [Invitar al Bot](https://discord.com/oauth2/authorize?client_id=708377742340653137&permissions=-8&scope=bot) | [Patreon](https://patreon.com/EPBK) | [Vota](https://top.gg/bot/728100449047019534)'));
}

function getCMD(client, message, input) {
  const embed = new MessageEmbed()

  // Get the cmd by the name or alias
  const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
  
  let info = `**${input.toLowerCase()}** no es un comando valido`;

  // If no cmd is found, send not found embed
  if (!cmd) {
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

  return message.channel.send(embed.setColor("GREEN").setDescription(info))
  .catch(err => {
      console.log(err)
  })
}

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
    changeRole,
    changePerm
}