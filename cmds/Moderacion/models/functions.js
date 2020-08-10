const Guild = require('./Guild')
const defaultSettings = require('./config')
const mongoose = require('mongoose');

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
        channelPinsUpdate: false,
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
module.exports = {
    getGuild,
    updateGuild,
    createGuild,
    search,
    searchNumber,
    checkDays,
    changeRole
}