const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldRole, newRole) => {
    let client = newRole.client
    Guild.findOne({ guildID: newRole.guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.roleUpdate == true) {
          if (!doc.LogChannel) return
          let Channel = newRole.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(newRole.guild.me).has("SEND_MESSAGES")) return

        let name = false
        let newperm = false
        let removeperms = false
        let getremoveperm = []
        let position = false
        let getnewperm = []
            
        let changeRole = {
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
        "MENTION_EVERYONE": "Mencionar @everyone, @here y todos los roles",
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
        }

        console.log("viejo " + oldRole.permissions)
        console.log("nuevo " + newRole.permissions)
        if (oldRole.name != newRole.name) {
            name = true
        }
        for (const role of newRole.permissions.toArray()) {
            if (!oldRole.permissions.has(role)) {
                newperm = true
                let rol = changeRole[role]
                getnewperm.push(rol)
            }
          }
        for (const role of oldRole.permissions.toArray()) {
            if (!newRole.permissions.has(role)) {
                removeperms = true
                let rol = changeRole[role]
                getremoveperm.push(rol)
        }
        }
        if (oldRole.position != newRole.position) {
            position = true
        }
        if (name == false && newperm == false && position == false && removeperms == false) return

        const embed = new Discord.MessageEmbed()
        .setAuthor("Rol Actualizado", newRole.guild.iconURL())
        .setFooter(`${newRole.name} | ${newRole.id}`)
        .setColor("#FF0000")
        if (name == true) embed.addField("Nombre Antes | Después", `${oldRole.name} | ${newRole.name}`)
        if (newperm == true) embed.addField("Permisos Agregados", `${getnewperm.map(r => r).join(", ")}`)
        if (removeperms == true) embed.addField("Permisos Removidos", `${getremoveperm.map(r => r).join(", ")}`)
        if (position == true) embed.addField("Posición", `**De:** ${oldRole.position}\n**A:** ${newRole.position}`)
    
        Channel.send({ embed })
    }
}).catch(err => {
    console.error(err)
})
}