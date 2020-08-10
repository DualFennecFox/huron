const Discord = require('discord.js')
const Guild = require("./models/Guild")
const { updateGuild, createGuild, updateLog } = require("./models/functions")

module.exports = {
    name : 'log',
    category: "Moderacion",
    description : 'Este comando te permite activar los logs y ver cuales están activos',
    aliases: ['Log', 'LOG', 'logs', 'Logs', 'LOGS'],
    usage: '!kick',
    examples: ['!log messagedelete', '!log nickname', '!log channel'],
    run: async (client , message, args, prefix) => {
        if (message.author.id !== process.env.OWNER) return

        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS")) return message.channel.send("No tienes permisos para usar este comando")

        let active = undefined
        let unable = undefined

        Guild.findOne({ guildID: message.guild.id }).then(doc => {
            if (!doc) {
                const newGuild = {
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    guildOwner: message.guild.owner.user.username,
                    guildOwnerID: message.guild.ownerID,
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
            else if (!doc.log) {
                const newGuild = {
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
                    }
            }
            try {
            updateLog(message.guild, newGuild)
            } catch (err) {
                console.error(err)
            }
        }

        if (doc.log.channelCreate == true) active += "Canal Creado\n"
        if (doc.log.channelDelete == true) active += "Canal Eliminado\n"
        if (doc.log.channelPinsUpdate == true) active += "Mensaje Fijado\n"
        if (doc.log.channelUpdate == true) active += "Canal Actualizado\n"
        if (doc.log.emojiCreate == true) active += "Emoji Creado\n"
        if (doc.log.emojiDelete == true) active += "Emoji Eliminado\n"
        if (doc.log.emojiUpdate == true) active += "Emoji Actualizado\n"
        if (doc.log.banAdd == true) active += "Baneo\n"
        if (doc.log.banRemove == true) active += "Desbaneo\n"
        if (doc.log.MemberAdd == true) active += "Nuevo Miembro\n"
        if (doc.log.MemberRemove == true) active += "Miembro se va\n"
        if (doc.log.MemberUpdate == true) active += "Miembro Actualizado\n"
        if (doc.log.guildUpdate == true) active += "Servidor Actualizado\n"
        if (doc.log.inviteCreate == true) active += "Invitación Creada\n"
        if (doc.log.inviteDelete == true) active += "Invitación Eliminada\n"
        if (doc.log.messageDelete == true) active += "Mensaje eliminado\n"
        if (doc.log.messageUpdate == true) active += "Mensaje Editado\n"
        if (doc.log.roleCreate == true) active += "Rol Creado\n"
        if (doc.log.roleDelete == true) active += "Rol Eliminado\n"
        if (doc.log.roleUpdate == true) active += "Rol Actualizado\n";

        if (doc.log.channelCreate == false) unable += "Canal Creado\n"
        if (doc.log.channelDelete == false) unable += "Canal Eliminado\n"
        if (doc.log.channelPinsUpdate == false) unable += "Mensaje Fijado\n"
        if (doc.log.channelUpdate == false) unable += "Canal Actualizado\n"
        if (doc.log.emojiCreate == false) unable += "Emoji Creado\n"
        if (doc.log.emojiDelete == false) unable += "Emoji Eliminado\n"
        if (doc.log.emojiUpdate == false) unable += "Emoji Actualizado\n"
        if (doc.log.banAdd == false) unable += "Baneo\n"
        if (doc.log.banRemove == false) unable += "Desbaneo\n"
        if (doc.log.MemberAdd == false) unable += "Nuevo Miembro\n"
        if (doc.log.MemberRemove == false) unable += "Miembro se va\n"
        if (doc.log.MemberUpdate == false) unable += "Miembro Actualizado\n"
        if (doc.log.guildUpdate == false) unable += "Servidor Actualizado\n"
        if (doc.log.inviteCreate == false) unable += "Invitación Creada\n"
        if (doc.log.inviteDelete == false) unable += "Invitación Eliminada\n"
        if (doc.log.messageDelete == false) unable += "Mensaje eliminado\n"
        if (doc.log.messageUpdate == false) unable += "Mensaje Editado\n"
        if (doc.log.roleCreate == false) unable += "Rol Creado\n"
        if (doc.log.roleDelete == false) unable += "Rol Eliminado\n"
        if (doc.log.roleUpdate == false) unable += "Rol Actualizado\n";
        
    
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setAuthor("Registros", client.user.displayAvatarURL())
                .setColor("#FFFF00")
                .setDescription(`Para que funcionen los registros se debe poner un canal con ${prefix}logchannel #Canal-Mencionado, se pueden seleccionar todos los eventos con \"All\"\n\nEstos son los eventos de los registros:`)
                embed.addField("Todos",  "Canal Creado\nCanal Eliminado\nMensaje Fijado\nCanal Actualizado\nEmoji Creado\nEmoji Eliminado\nEmoji Actualizado\nBaneo\nDesbaneo\nNuevo Miembro\nMiembro se va\nMiembro Actualizado\nServidor Actualizado\nInvitación Creada\nInvitación Eliminada\nMensaje Eliminado\nMensaje Editado\nRol Creado\nRol Eliminado\nRol Actualizado")
                if (active != undefined) embed.addField("Activados", active.replace("undefined", ""))
                if (unable != undefined) embed.addField("Desactivados", unable.replace("undefined", ""));

                message.channel.send({ embed })
                return
        }
    }).catch(err => {
        console.error(err)
    })
        switch (args[0]) {
            case "enable": 
        switch (args[1]) {
            case "all":
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                        
                updateLog(message.guild, {log: {
                    channelCreate: true,
                    channelDelete: true,
                    channelPinsUpdate: true,
                    channelUpdate: true,
                    emojiCreate: true,
                    emojiDelete: true,
                    emojiUpdate: true,
                    banAdd: true,
                    banRemove: true,
                    MemberAdd: true,
                    MemberRemove: true,
                    MemberUpdate: true,
                    guildUpdate: true,
                    inviteCreate: true,
                    inviteDelete: true,
                    messageDelete: true,
                    messageDeleteBulk: true,
                    messageUpdate: true,
                    roleCreate: true,
                    roleDelete: true,
                    roleUpdate: true,
                    userUpdate: false,
                    voiceState: false
                }
                    })
            
                message.channel.send("Se han activado todos los registros")
                }).catch(err => {
                    console.error(err)
                    message.channel.send("Hubo un error al activar los registros")
                })
            break;
            case "channel": 

              updateLog(message.guild, { log: { channelCreate: true, channelDelete: true, channelPinsUpdate: true, channelUpdate: true }})
            
            message.channel.send("Se han activado los registros de Canales")

        break;
        case "channelcreate":
            updateLog(message.guild, { log: { channelCreate: true }})
            message.channel.send("Se ha activado el registro \`Crear Canales\`")
        break;
        case "channeldelete":
            updateLog(message.guild, { log: { channelDelete: true }})
            message.channel.send("Se ha activado el registro \`Canal Eliminado\`")
        break;
        case "channelupdate":
            updateLog(message.guild, { log: { channelUpdate: true }})
            message.channel.send("Se ha activado el registro \`Canal Actualizado\`")
        break;
        case "channelpin":
            updateLog(message.guild, { log: { channelPinsUpdate: true }})
            message.channel.send("Se ha activado el registro \`Mensaje Fijado\`")
        break;
        case "emoji":
            updateLog(message.guild, { log: { emojiCreate: true, emojiDelete: true, emojiUpdate: true }})
            message.channel.send("Se han activado los registros de Emojis")
        break;
        case "emojicreate":
            updateLog(message.guild, { log: { emojiCreate: true }})
            message.channel.send("Se ha activado el registro \`Emoji Creado\`")
        break;
        case "emojidelete":
            updateLog(message.guild, { log: { emojiDelete: true }})
            message.channel.send("Se ha activado el registro \`Emoji Eliminado\`")
        break;
        case "emojiupdate":
            updateLog(message.guild, { log: { emojiUpdate: true }})
            message.channel.send("Se ha activado el registro \`Emoji Actualizado\`")
        break;
        case "bans":
            updateLog(message.guild, { log: { banAdd: true, banRemove: true }})
            message.channel.send("Se han activado los registros de Baneos")
        break;
        case "ban":
            updateLog(message.guild, { log: { banAdd: true }})
            message.channel.send("Se ha activado el registro \`Ban\`")
        break;
        case "unban":
            updateLog(message.guild, { log: { banRemove: true }})
            message.channel.send("Se ha activado el registro \`UnBan\`")
        break;
        case "member":
            updateLog(message.guild, { log: { MemberAdd: true, MemberRemove: true, MemberUpdate: true }})
            message.channel.send("Se han activado los registros de Miembros")
        break;
        case "memberadd":
            updateLog(message.guild, { log: { MemberAdd: true }})
            message.channel.send("Se ha activado el registro \`Miembro Nuevo\`")
        break;
        case "memberremove":
            updateLog(message.guild, { log: { MemberRemove: true } })
            message.channel.send("Se ha activado el registro \`Miembro se va\`")
        break;
        case "memberupdate": 
            updateLog(message.guild, { log: { MemberUpdate: true }})
            message.channel.send("Se ha activado el registro \`Miembro Actualizado\`")
        break;
        case "guildupdate":
            updateLog(message.guild, { log: { guildUpdate: true }})
            message.channel.send("Se ha activado el registro \`Servidor Actualizado\`")
        break;
        case "invite":
            updateLog(message.guild, { log: { inviteCreate: true, inviteDelete: true }})
            message.channel.send("Se han activado los registros de Invitación")
        break;
        case "invitecreate":
            updateLog(message.guild, { log: { inviteCreate: true }})
            message.channel.send("Se ha activado el registro \`Invitación Creada\`")
        break;
        case "invitedelete": 
            updateLog(message.guild, { log: { inviteDelete: true }})
            message.channel.send("Se ha activado el registro \`Invitación Eliminada\`")
        break;
        case "message":
            updateLog(message.guild, { log: { messageDelete: true, messageUpdate: true }})
            message.channel.send("Se han activado los registros de Mensajes")
        break;
        case "messagedelete": 
            updateLog(message.guild, { log: { messageDelete: true }})
            message.channel.send("Se ha activado el registro \`Mensaje Eliminado\`")
        break;
        case "messageupdate":
            updateLog(message.guild, { log: { messageUpdate: true }})
            message.channel.send("Se ha activado el registro \`Mensaje Actualizado\`")
        break;
        case "role":
            updateLog(message.guild, { log: { roleCreate: true, roleDelete: true, roleUpdate: true }})
            message.channel.send("Se han activado los registros de Roles")
        break;
        case "rolecreate":
            updateLog(message.guild, { log: { roleCreate: true }})
            message.channel.send("Se ha activado el registro \`Rol Creado\`")
        break;
        case "roledelete":
            updateLog(message.guild, { log: { roleDelete: true }})
            message.channel.send("Se ha activado el registro \`Rol Eliminado\`")
        break;
        case "roleupdate":
            updateLog(message.guild, { log: { roleUpdate: true }})
            message.channel.send("Se ha activado el registro \`Rol Actualizado\`")
        break;
    }
    break;
    case "unable":
        switch (args[1]) {
            case "all":
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                updateLog(message.guild, {log: {
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
                }
                })
            
                message.channel.send("Se han desactivado todos los registros")
                }).catch(err => {
                    console.error(err)
                    message.channel.send("Hubo un error al desactivar los registros")
                })
            break;
            case "channel": 

              updateLog(message.guild, { log: { channelCreate: false, channelDelete: false, channelPinsUpdate: false, channelUpdate: false }})
            
            message.channel.send("Se han desactivado los registros de Canales")

        break;
        case "channelcreate":
            updateLog(message.guild, { log: { channelCreate: false }})
            message.channel.send("Se ha desactivado el registro \`Crear Canales\`")
        break;
        case "channeldelete":
            updateLog(message.guild, { log: { channelDelete: false }})
            message.channel.send("Se ha desactivado el registro \`Canal Eliminado\`")
        break;
        case "channelupdate":
            updateLog(message.guild, { log: { channelUpdate: false }})
            message.channel.send("Se ha desactivado el registro \`Canal Actualizado\`")
        break;
        case "channelpin":
            updateLog(message.guild, { log: { channelPinsUpdate: false }})
            message.channel.send("Se ha desactivado el registro \`Mensaje Fijado\`")
        break;
        case "emoji":
            updateLog(message.guild, { log: { emojiCreate: false, emojiDelete: false, emojiUpdate: false }})
            message.channel.send("Se han desactivado los registros de Emojis")
        break;
        case "emojicreate":
            updateLog(message.guild, { log: { emojiCreate: false }})
            message.channel.send("Se ha desactivado el registro \`Emoji Creado\`")
        break;
        case "emojidelete":
            updateLog(message.guild, { log: { emojiDelete: false }})
            message.channel.send("Se ha desactivado el registro \`Emoji Eliminado\`")
        break;
        case "emojiupdate":
            updateLog(message.guild, { log: { emojiUpdate: false }})
            message.channel.send("Se ha desactivado el registro \`Emoji Actualizado\`")
        break;
        case "bans":
            updateLog(message.guild, { log: { banAdd: false, banRemove: false }})
            message.channel.send("Se han desactivado los registros de Baneos")
        break;
        case "ban":
            updateLog(message.guild, { log: { banAdd: false }})
            message.channel.send("Se ha desactivado el registro \`Ban\`")
        break;
        case "unban":
            updateLog(message.guild, { log: { banRemove: false }})
            message.channel.send("Se ha desactivado el registro \`UnBan\`")
        break;
        case "member":
            updateLog(message.guild, { log: { MemberAdd: false, MemberRemove: false, MemberUpdate: false }})
            message.channel.send("Se han desactivado los registros de Miembros")
        break;
        case "memberadd":
            updateLog(message.guild, { log: { MemberAdd: false }})
            message.channel.send("Se ha desactivado el registro \`Miembro Nuevo\`")
        break;
        case "memberremove":
            updateLog(message.guild, { log: { MemberRemove: false } })
            message.channel.send("Se ha desactivado el registro \`Miembro se va\`")
        break;
        case "memberupdate": 
            updateLog(message.guild, { log: { MemberUpdate: false }})
            message.channel.send("Se ha desactivado el registro \`Miembro Actualizado\`")
        break;
        case "guildupdate":
            updateLog(message.guild, { log: { guildUpdate: false }})
            message.channel.send("Se ha desactivado el registro \`Servidor Actualizado\`")
        break;
        case "invite":
            updateLog(message.guild, { log: { inviteCreate: false, inviteDelete: false }})
            message.channel.send("Se han desactivado los registros de Invitación")
        break;
        case "invitecreate":
            updateLog(message.guild, { log: { inviteCreate: false }})
            message.channel.send("Se ha desactivado el registro \`Invitación Creada\`")
        break;
        case "invitedelete": 
            updateLog(message.guild, { log: { inviteDelete: false }})
            message.channel.send("Se ha desactivado el registro \`Invitación Eliminada\`")
        break;
        case "message":
            updateLog(message.guild, { log: { messageDelete: false, messageUpdate: false }})
            message.channel.send("Se han desactivado los registros de Mensajes")
        break;
        case "messagedelete": 
            updateLog(message.guild, { log: { messageDelete: false }})
            message.channel.send("Se ha desactivado el registro \`Mensaje Eliminado\`")
        break;
        case "messageupdate":
            updateLog(message.guild, { log: { messageUpdate: false }})
            message.channel.send("Se ha desactivado el registro \`Mensaje Actualizado\`")
        break;
        case "role":
            updateLog(message.guild, { log: { roleCreate: false, roleDelete: false, roleUpdate: false }})
            message.channel.send("Se han desactivado los registros de Roles")
        break;
        case "rolecreate":
            updateLog(message.guild, { log: { roleCreate: false }})
            message.channel.send("Se ha desactivado el registro \`Rol Creado\`")
        break;
        case "roledelete":
            updateLog(message.guild, { log: { roleDelete: false }})
            message.channel.send("Se ha desactivado el registro \`Rol Eliminado\`")
        break;
        case "roleupdate":
            updateLog(message.guild, { log: { roleUpdate: false }})
            message.channel.send("Se ha desactivado el registro \`Rol Actualizado\`")
        break;
    }
    break;
    }
}
}