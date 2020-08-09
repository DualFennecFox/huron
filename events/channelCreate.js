const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async channel => {
  let client = channel.client
  if (channel.type === "dm") return
  Guild.findOne({ guildID: channel.guild.id }).then(doc => {
    if (!doc) return
    if (doc.log.channelCreate == true) {
      if (!doc.LogChannel) return
      let Channel = channel.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return

      let perm = false
      let overwritesAllowedUser = []
      let user = false 
      let overwritesDenyUser = []
      let overwritesAllowedRole = []
      let role = false
      let overwritesDenyRole = []

      let type = {
        "category": "Categoría",
        "text": "Texto",
        "voice": "Voz",
        "news": "Noticias",
        "store": "Tienda",
        "unknown": "Desconocido"
      }

      if (channel.permissionOverwrites) {
        perm = true
        for (const perm of channel.permissionOverwrites.values()) {

          console.log("allow " + perm.allow.toArray())
          console.log(perm.deny.toArray())
          if (perm.type === "member") {
            user = true
          if (perm.allow.toArray() !== "[]") {
          overwritesAllowedUser.push(`<@!${perm.id}>: ${perm.allow.toArray().join(", ")}`)
          }
          if (perm.deny.toArray() !== "[]") {
          overwritesDenyUser.push(`<@!${perm.id}>: ${perm.deny.toArray().join(", ")}`)
          }
          }
          if (perm.type === "role") {
            role = true
            if (perm.allow.toArray() !== "[]") {
            overwritesAllowedRole.push(`<@&${perm.id}>: ${perm.allow.toArray().join(", ")}`)
            }
            if (perm.deny.toArray() !== "[]") {
            overwritesDenyRole.push(`<@&${perm.id}>: ${perm.deny.toArray().join(", ")}`)
            }
          }
        }
      }
      let AllowU;
      let DenyU;
      let AllowR;
      let DenyR;

      if (perm == true && overwritesAllowedUser) AllowU = overwritesAllowedUser.map(r => r).join("\n").replace(/ADMINISTRATOR/g, "Administrador")
      .replace(/CREATE_INSTANT_INVITE/g, "Crear Invitación")
      .replace(/KICK_MEMBERS/g, "Expulsar miembros")
      .replace(/BAN_MEMBERS/g, "Banear Miembros")
      .replace(/MANAGE_CHANNELS/g, "Gestionar Canales")
      .replace(/MANAGE_GUILD/g, "Gestionar Servidor")
      .replace(/ADD_REACTIONS/g, "Añadir reacciones")
      .replace(/VIEW_AUDIT_LOG/g, "Ver el registro de auditoría")
      .replace(/PRIORITY_SPEAKER/g, "Prioridad de palabra")
      .replace(/STREAM/g, "Video")
      .replace(/VIEW_CHANNEL/g, "Leer canales de texto y canales de voz")
      .replace(/SEND_MESSAGES/g, "Enviar mensajes")
      .replace(/SEND_TTS_MESSAGES/g, "Enviar mensajes de texto a voz")
      .replace(/MANAGE_MESSAGES/g, "Gestionar mensajes")
      .replace(/EMBED_LINKS/g, "Insertar enlaces")
      .replace(/ATTACH_FILES/g, "Adjuntar archivos")
      .replace(/READ_MESSAGE_HISTORY/g, "Leer el historial de mensajes")
      .replace(/MENTION_EVERYONE/g, "Mencionar \@everyone, \@here y todos los roles")
      .replace(/USE_EXTERNAL_EMOJIS/g, "Usar emojis externos")
      .replace(/VIEW_GUILD_INSIGHTS/g, "Ver información del servidor")
      .replace(/CONNECT/g, "Conectar")
      .replace(/SPEAK/g, "Hablar")
      .replace(/MUTE_MEMBERS/g, "Silenciar miembros")
      .replace(/DEAFEN_MEMBERS/g, "Ensordecer Miembros")
      .replace(/MOVE_MEMBERS/g, "Mover miembros")
      .replace(/USE_VAD/g, "Usar Actividad de voz")
      .replace(/CHANGE_NICKNAME/g, "Cambiar apodo")
      .replace(/MANAGE_NICKNAMES/g, "Gestionar apodos")
      .replace(/MANAGE_ROLES/g, "Gestionar roles")
      .replace(/MANAGE_WEBHOOKS/g, "Gestionar webhooks")
      .replace(/MANAGE_EMOJIS/g, "Gestionar emojis");

      if (perm == true && overwritesDenyUser) DenyU = overwritesDenyUser.map(r => r).join("\n").replace(/ADMINISTRATOR/g, "Administrador")
      .replace(/CREATE_INSTANT_INVITE/g, "Crear Invitación")
      .replace(/KICK_MEMBERS/g, "Expulsar miembros")
      .replace(/BAN_MEMBERS/g, "Banear Miembros")
      .replace(/MANAGE_CHANNELS/g, "Gestionar Canales")
      .replace(/MANAGE_GUILD/g, "Gestionar Servidor")
      .replace(/ADD_REACTIONS/g, "Añadir reacciones")
      .replace(/VIEW_AUDIT_LOG/g, "Ver el registro de auditoría")
      .replace(/PRIORITY_SPEAKER/g, "Prioridad de palabra")
      .replace(/STREAM/g, "Video")
      .replace(/VIEW_CHANNEL/g, "Leer canales de texto y canales de voz")
      .replace(/SEND_MESSAGES/g, "Enviar mensajes")
      .replace(/SEND_TTS_MESSAGES/g, "Enviar mensajes de texto a voz")
      .replace(/MANAGE_MESSAGES/g, "Gestionar mensajes")
      .replace(/EMBED_LINKS/g, "Insertar enlaces")
      .replace(/ATTACH_FILES/g, "Adjuntar archivos")
      .replace(/READ_MESSAGE_HISTORY/g, "Leer el historial de mensajes")
      .replace(/MENTION_EVERYONE/g, "Mencionar \@everyone, \@here y todos los roles")
      .replace(/USE_EXTERNAL_EMOJIS/g, "Usar emojis externos")
      .replace(/VIEW_GUILD_INSIGHTS/g, "Ver información del servidor")
      .replace(/CONNECT/g, "Conectar")
      .replace(/SPEAK/g, "Hablar")
      .replace(/MUTE_MEMBERS/g, "Silenciar miembros")
      .replace(/DEAFEN_MEMBERS/g, "Ensordecer Miembros")
      .replace(/MOVE_MEMBERS/g, "Mover miembros")
      .replace(/USE_VAD/g, "Usar Actividad de voz")
      .replace(/CHANGE_NICKNAME/g, "Cambiar apodo")
      .replace(/MANAGE_NICKNAMES/g, "Gestionar apodos")
      .replace(/MANAGE_ROLES/g, "Gestionar roles")
      .replace(/MANAGE_WEBHOOKS/g, "Gestionar webhooks")
      .replace(/MANAGE_EMOJIS/g, "Gestionar emojis");

      if (perm == true && overwritesAllowedRole) AllowR = overwritesAllowedRole.map(r => r).join("\n")
      .replace(/ADMINISTRATOR/g, "Administrador")
      .replace(/CREATE_INSTANT_INVITE/g, "Crear Invitación")
      .replace(/KICK_MEMBERS/g, "Expulsar miembros")
      .replace(/BAN_MEMBERS/g, "Banear Miembros")
      .replace(/MANAGE_CHANNELS/g, "Gestionar Canales")
      .replace(/MANAGE_GUILD/g, "Gestionar Servidor")
      .replace(/ADD_REACTIONS/g, "Añadir reacciones")
      .replace(/VIEW_AUDIT_LOG/g, "Ver el registro de auditoría")
      .replace(/PRIORITY_SPEAKER/g, "Prioridad de palabra")
      .replace(/STREAM/g, "Video")
      .replace(/VIEW_CHANNEL/g, "Leer canales de texto y canales de voz")
      .replace(/SEND_MESSAGES/g, "Enviar mensajes")
      .replace(/SEND_TTS_MESSAGES/g, "Enviar mensajes de texto a voz")
      .replace(/MANAGE_MESSAGES/g, "Gestionar mensajes")
      .replace(/EMBED_LINKS/g, "Insertar enlaces")
      .replace(/ATTACH_FILES/g, "Adjuntar archivos")
      .replace(/READ_MESSAGE_HISTORY/g, "Leer el historial de mensajes")
      .replace(/MENTION_EVERYONE/g, "Mencionar \@everyone, \@here y todos los roles")
      .replace(/USE_EXTERNAL_EMOJIS/g, "Usar emojis externos")
      .replace(/VIEW_GUILD_INSIGHTS/g, "Ver información del servidor")
      .replace(/CONNECT/g, "Conectar")
      .replace(/SPEAK/g, "Hablar")
      .replace(/MUTE_MEMBERS/g, "Silenciar miembros")
      .replace(/DEAFEN_MEMBERS/g, "Ensordecer Miembros")
      .replace(/MOVE_MEMBERS/g, "Mover miembros")
      .replace(/USE_VAD/g, "Usar Actividad de voz")
      .replace(/CHANGE_NICKNAME/g, "Cambiar apodo")
      .replace(/MANAGE_NICKNAMES/g, "Gestionar apodos")
      .replace(/MANAGE_ROLES/g, "Gestionar roles")
      .replace(/MANAGE_WEBHOOKS/g, "Gestionar webhooks")
      .replace(/MANAGE_EMOJIS/g, "Gestionar emojis");
      
      if (perm == true && overwritesDenyRole) DenyR = overwritesDenyRole.map(r => r).join("\n")
      .replace(/ADMINISTRATOR/g, "Administrador")
      .replace(/CREATE_INSTANT_INVITE/g, "Crear Invitación")
      .replace(/KICK_MEMBERS/g, "Expulsar miembros")
      .replace(/BAN_MEMBERS/g, "Banear Miembros")
      .replace(/MANAGE_CHANNELS/g, "Gestionar Canales")
      .replace(/MANAGE_GUILD/g, "Gestionar Servidor")
      .replace(/ADD_REACTIONS/g, "Añadir reacciones")
      .replace(/VIEW_AUDIT_LOG/g, "Ver el registro de auditoría")
      .replace(/PRIORITY_SPEAKER/g, "Prioridad de palabra")
      .replace(/STREAM/g, "Video")
      .replace(/VIEW_CHANNEL/g, "Leer canales de texto y canales de voz")
      .replace(/SEND_MESSAGES/g, "Enviar mensajes")
      .replace(/SEND_TTS_MESSAGES/g, "Enviar mensajes de texto a voz")
      .replace(/MANAGE_MESSAGES/g, "Gestionar mensajes")
      .replace(/EMBED_LINKS/g, "Insertar enlaces")
      .replace(/ATTACH_FILES/g, "Adjuntar archivos")
      .replace(/READ_MESSAGE_HISTORY/g, "Leer el historial de mensajes")
      .replace(/MENTION_EVERYONE/g, "Mencionar \@everyone, \@here y todos los roles")
      .replace(/USE_EXTERNAL_EMOJIS/g, "Usar emojis externos")
      .replace(/VIEW_GUILD_INSIGHTS/g, "Ver información del servidor")
      .replace(/CONNECT/g, "Conectar")
      .replace(/SPEAK/g, "Hablar")
      .replace(/MUTE_MEMBERS/g, "Silenciar miembros")
      .replace(/DEAFEN_MEMBERS/g, "Ensordecer Miembros")
      .replace(/MOVE_MEMBERS/g, "Mover miembros")
      .replace(/USE_VAD/g, "Usar Actividad de voz")
      .replace(/CHANGE_NICKNAME/g, "Cambiar apodo")
      .replace(/MANAGE_NICKNAMES/g, "Gestionar apodos")
      .replace(/MANAGE_ROLES/g, "Gestionar roles")
      .replace(/MANAGE_WEBHOOKS/g, "Gestionar webhooks")
      .replace(/MANAGE_EMOJIS/g, "Gestionar emojis");

      const embed = new Discord.MessageEmbed()
      .setAuthor("Canal Creado", channel.guild.iconURL())
      .setColor("#FF0000")
      .setDescription(`Se ha creado el canal **${channel.name}**`)
      .addField("Tipo de canal", type[channel.type])
      if (perm == true && user == true) embed.addField("Permisos Por Usuario", `**Permitidos:** ${AllowU}\n\n**Denegados:** ${DenyU}`)
      if (perm == true && role == true) embed.addField("Permisos Por Rol", `**Permitidos:** ${AllowR}\n\n**Denegados:** ${DenyR}`)
      .setFooter(`${channel.name} | ${channel.id}`);

  Channel.send({ embed })
    } 
  }).catch(err => {
    console.error(err)
  })
}