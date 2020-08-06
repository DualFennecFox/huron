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
        function setAll(a) {
          var i, n = a.length;
          for (i = 0; i < n; ++i) {
              a[i] = changeRole[a[i]];
          }
      }
      if (channel.permissionOverwrites) {
        perm = true
        for (const perm of channel.permissionOverwrites.values()) {

          console.log("allow " + perm.allow.toArray())
          console.log("deny " + perm.deny.toArray())
          if (perm.type === "member") {
            user = true
          overwritesAllowedUser.push(`<@!${perm.id}>: ${setAll(perm.allow.toArray())}`)
          overwritesDenyUser.push(`<@!${perm.id}>: ${changeRole[perm.deny.toArray()]}`)
setAll()
          }
          if (perm.type === "role") {
            role = true
            overwritesAllowedRole.push(`<@&${perm.id}>: ${setAll(perm.allow.toArray())}`)
            overwritesDenyRole.push(`<@&${perm.id}>: ${changeRole[perm.deny.toArray()]}`)
          }
        }
      }
      const embed = new Discord.MessageEmbed()
      .setAuthor("Canal Creado", channel.guild.iconURL())
      .setColor("#FF0000")
      .setDescription(`Se ha creado el canal **${channel.name}**`)
      .addField("Tipo de canal", type[channel.type])
      if (perm == true && user == true) embed.addField("Permisos Por Usuario", `**Permitidos:** ${overwritesAllowedUser.map(r => r).join("\n")}\n\n**Denegados:** ${overwritesDenyUser.map(r => r).join("\n")}`)
      if (perm == true && role == true) embed.addField("Permisos Por Rol", `**Permitidos:** ${overwritesAllowedRole.map(r => r).join("\n")}\n\n**Denegados:** ${overwritesDenyRole.map(r => r).join("\n")}`)
      .setFooter(`${channel.name} | ${channel.id}`);

  Channel.send({ embed })
    } 
  }).catch(err => {
    console.error(err)
  })
}