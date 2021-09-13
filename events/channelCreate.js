const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { perms, changeRole, changePerm } = require('../cmds/Moderacion/models/functions')
module.exports = async channel => {

  if (channel.type === "dm") return
  Guild.findOne({ guildID: channel.guild.id }).then(async doc => {
    if (!doc) return
    if (doc.log.channelCreate == true) {
      if (!doc.LogChannel) return
      let Channel = channel.guild.channels.cache.get(doc.LogChannel)
      if (!Channel) return
      if (!Channel.permissionsFor(channel.guild.me).has(perms.send_messages)) return

      let perm = false
      let overwritesAllowedUser = []
      let user = false 
      let overwritesDenyUser = []
      let overwritesAllowedRole = []
      let role = false
      let overwritesDenyRole = []
      let allowedUser = false
      let denyUser = false
      let allowedrole = false
      let denyRole = false

      let type = {
        "GUILD_CATEGORY": "Categoría",
        "GUILD_TEXT": "Texto",
        "GUILD_VOICE": "Voz",
        "GUILD_NEWS": "Noticias",
        "GUILD_STORE": "Tienda",
        "GUILD_STAGE_VOICE": "Escenario",
        "UNKNOWN": "Desconocido"
      }
      let muterole = channel.guild.roles.cache.get(doc.muterole)
      if (muterole && channel.guild.me.permissions.has(perms.manage_channels)) {
      try {
        channel.guild.channels.cache.forEach(async (channel, id) => {
            await channel.permissionOverwrites.create(muterole,  {
                SEND_MESSAGES: false,
                CREATE_INSTANT_INVITE: false,
                ADD_REACTIONS: false,
                SEND_TTS_MESSAGES: false,
                ATTACH_FILES: false,
                SPEAK: false
            })
        })
    } catch (err) {
        console.error(err)
}
}

      if (channel.permissionOverwrites) {
        perm = true
        for (const perm of channel.permissionOverwrites.cache.values()) {

          if (perm.type === "member") {
            user = true
          if ([...perm.allow].length >= 1) {
          allowedUser = true
          overwritesAllowedUser.push(`<@!${perm.id}>: ${[...perm.allow].join(", ")}`)
          }
          if ([...perm.deny].length >= 1) {
          denyUser = true
          overwritesDenyUser.push(`<@!${perm.id}>: ${[...perm.deny].join(", ")}`)
          }
          }
          if (perm.type === "role") {
            role = true
            if ([...perm.allow].length >= 1) {
            allowedrole = true
            overwritesAllowedRole.push(`<@&${perm.id}>: ${[...perm.allow].join(", ")}`)
            }
            if ([...perm.deny].length >= 1) {
            denyRole = true
            overwritesDenyRole.push(`<@&${perm.id}>: ${[...perm.deny].join(", ")}`)
            }
          }
        }
      }
      let AllowU;
      let DenyU;
      let AllowR;
      let DenyR;

      if (perm == true && overwritesAllowedUser) {
        
    for (i = 0; i < overwritesAllowedUser.length; i++) {

      AllowU = overwritesAllowedUser.map(r => changePerm[overwritesAllowedUser[i]]).join("\n\n")
      
    }
    }


      if (perm == true && overwritesDenyUser) DenyU = overwritesDenyUser.map(r => r).join("\n\n").replace(/ADMINISTRATOR/g, "Administrador")
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

      if (perm == true && overwritesAllowedRole) {

        for (i = 0; i < overwritesAllowedRole.length; i++) {

          AllowR = overwritesAllowedRole.map(r => changePerm[overwritesAllowedRole[i]]).join("\n\n")
          
        }
      }
      
      if (perm == true && overwritesDenyRole) {
        
        for (i = 0; i < overwritesDenyRole.length; i++) {

          DenyR = overwritesDenyRole.map(r => changePerm[overwritesDenyRole[i]]).join("\n\n")
          
        }
      }

      let msgU;
      let msgR;

      if (allowedUser == true && denyUser == false) msgU = `**Permitidos:** ${AllowU}`
      if (allowedUser == false && denyUser == true) msgU = `**Denegados:** ${DenyU}`
      if (allowedUser == true && denyUser == true) msgU = `**Permitidos:** ${AllowU}\n\n**Denegados:** ${DenyU}`

      if (allowedrole == true && denyRole == false) msgR = `**Permitidos:** ${AllowR}`
      if (allowedrole == false && denyRole == true) msgR = `**Denegados:** ${DenyR}`
      if (allowedrole == true && denyRole == true) msgR = `**Permitidos:** ${AllowR}\n\n**Denegados:** ${DenyR}`

      const embed = new Discord.MessageEmbed()
      .setAuthor("Canal Creado", channel.guild.iconURL())
      .setColor("#FF0000")
      .setDescription(`Se ha creado el canal **${channel.name}**`)
      .addField("Tipo de canal", type[channel.type])
      if (perm == true && user == true) embed.addField("Permisos Por Usuario", msgU)
      if (perm == true && role == true) embed.addField("Permisos Por Rol", msgR)
      .setFooter(`${channel.name} | ${channel.id}`);

  Channel.send({ embeds: [embed] })
    } 
  }).catch(err => {
    console.error(err)
  })
}