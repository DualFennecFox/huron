const Discord = require('discord.js')
const Guild = require("./models/Guild")
const { updateLog, createGuild, updateGuild } = require("./models/functions")

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
            updateGuild(message.guild, newGuild)
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
                .setDescription(`Para que funcionen los registros se debe poner un canal con ${prefix}logchannel #Canal-Mencionado, se pueden seleccionar todos los eventos con \"All\"\n\n**Eventos:**\nchannel, channelcreate, channeldelete, channelupdate, channelpin, emoji, emojicreate, emojidelete, emojiupdate, bans, ban, unban, member, memberadd, memberremove, memberupdate, guildupdate, invite, invitecreate, invitedelete, message, messagedelete, messageupdate, role, rolecreate, roledelete, roleupdate`)
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
                        
                updateGuild(message.guild, {log: {
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

              updateLog(message.guild,  { channelCreate: true, channelDelete: true, channelPinsUpdate: true, channelUpdate: true })
            
            message.channel.send("Se han activado los registros de Canales")

        break;
        case "channelcreate":
            updateLog(message.guild,   { channelCreate: true })
            message.channel.send("Se ha activado el registro \`Crear Canales\`")
        break;
        case "channeldelete":
            updateLog(message.guild,   { channelDelete: true })
            message.channel.send("Se ha activado el registro \`Canal Eliminado\`")
        break;
        case "channelupdate":
            updateLog(message.guild,   { channelUpdate: true })
            message.channel.send("Se ha activado el registro \`Canal Actualizado\`")
        break;
        case "channelpin":
            updateLog(message.guild,   { channelPinsUpdate: true })
            message.channel.send("Se ha activado el registro \`Mensaje Fijado\`")
        break;
        case "emoji":
            updateLog(message.guild,   { emojiCreate: true, emojiDelete: true, emojiUpdate: true })
            message.channel.send("Se han activado los registros de Emojis")
        break;
        case "emojicreate":
            updateLog(message.guild,   { emojiCreate: true })
            message.channel.send("Se ha activado el registro \`Emoji Creado\`")
        break;
        case "emojidelete":
            updateLog(message.guild,   { emojiDelete: true })
            message.channel.send("Se ha activado el registro \`Emoji Eliminado\`")
        break;
        case "emojiupdate":
            updateLog(message.guild,   { emojiUpdate: true })
            message.channel.send("Se ha activado el registro \`Emoji Actualizado\`")
        break;
        case "bans":
            updateLog(message.guild,   { banAdd: true, banRemove: true })
            message.channel.send("Se han activado los registros de Baneos")
        break;
        case "ban":
            updateLog(message.guild,   { banAdd: true })
            message.channel.send("Se ha activado el registro \`Ban\`")
        break;
        case "unban":
            updateLog(message.guild,   { banRemove: true })
            message.channel.send("Se ha activado el registro \`UnBan\`")
        break;
        case "member":
            updateLog(message.guild,   { MemberAdd: true, MemberRemove: true, MemberUpdate: true })
            message.channel.send("Se han activado los registros de Miembros")
        break;
        case "memberadd":
            updateLog(message.guild,   { MemberAdd: true })
            message.channel.send("Se ha activado el registro \`Miembro Nuevo\`")
        break;
        case "memberremove":
            updateLog(message.guild,   { MemberRemove: true })
            message.channel.send("Se ha activado el registro \`Miembro se va\`")
        break;
        case "memberupdate": 
            updateLog(message.guild,   { MemberUpdate: true })
            message.channel.send("Se ha activado el registro \`Miembro Actualizado\`")
        break;
        case "guildupdate":
            updateLog(message.guild,   { guildUpdate: true })
            message.channel.send("Se ha activado el registro \`Servidor Actualizado\`")
        break;
        case "invite":
            updateLog(message.guild,   { inviteCreate: true, inviteDelete: true })
            message.channel.send("Se han activado los registros de Invitación")
        break;
        case "invitecreate":
            updateLog(message.guild,   { inviteCreate: true })
            message.channel.send("Se ha activado el registro \`Invitación Creada\`")
        break;
        case "invitedelete": 
            updateLog(message.guild,   { inviteDelete: true })
            message.channel.send("Se ha activado el registro \`Invitación Eliminada\`")
        break;
        case "message":
            updateLog(message.guild,   { messageDelete: true, messageUpdate: true })
            message.channel.send("Se han activado los registros de Mensajes")
        break;
        case "messagedelete": 
            updateLog(message.guild,   { messageDelete: true })
            message.channel.send("Se ha activado el registro \`Mensaje Eliminado\`")
        break;
        case "messageupdate":
            updateLog(message.guild,   { messageUpdate: true })
            message.channel.send("Se ha activado el registro \`Mensaje Actualizado\`")
        break;
        case "role":
            updateLog(message.guild,   { roleCreate: true, roleDelete: true, roleUpdate: true })
            message.channel.send("Se han activado los registros de Roles")
        break;
        case "rolecreate":
            updateLog(message.guild,   { roleCreate: true })
            message.channel.send("Se ha activado el registro \`Rol Creado\`")
        break;
        case "roledelete":
            updateLog(message.guild,   { roleDelete: true })
            message.channel.send("Se ha activado el registro \`Rol Eliminado\`")
        break;
        case "roleupdate":
            updateLog(message.guild,   { roleUpdate: true })
            message.channel.send("Se ha activado el registro \`Rol Actualizado\`")
        break;
    }
    break;
    case "disable":
        switch (args[1]) {
            case "all":
                Guild.findOne({ guildID: message.guild.id }).then(doc => {
                updateGuild(message.guild, {log: {
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

              updateLog(message.guild,  { channelCreate: false, channelDelete: false, channelPinsUpdate: false, channelUpdate: false })
            
            message.channel.send("Se han desactivado los registros de Canales")

        break;
        case "channelcreate":
            updateLog(message.guild,   { channelCreate: false })
            message.channel.send("Se ha desactivado el registro \`Crear Canales\`")
        break;
        case "channeldelete":
            updateLog(message.guild,   { channelDelete: false })
            message.channel.send("Se ha desactivado el registro \`Canal Eliminado\`")
        break;
        case "channelupdate":
            updateLog(message.guild,   { channelUpdate: false })
            message.channel.send("Se ha desactivado el registro \`Canal Actualizado\`")
        break;
        case "channelpin":
            updateLog(message.guild,   { channelPinsUpdate: false })
            message.channel.send("Se ha desactivado el registro \`Mensaje Fijado\`")
        break;
        case "emoji":
            updateLog(message.guild,   { emojiCreate: false, emojiDelete: false, emojiUpdate: false })
            message.channel.send("Se han desactivado los registros de Emojis")
        break;
        case "emojicreate":
            updateLog(message.guild,   { emojiCreate: false })
            message.channel.send("Se ha desactivado el registro \`Emoji Creado\`")
        break;
        case "emojidelete":
            updateLog(message.guild,   { emojiDelete: false })
            message.channel.send("Se ha desactivado el registro \`Emoji Eliminado\`")
        break;
        case "emojiupdate":
            updateLog(message.guild,   { emojiUpdate: false })
            message.channel.send("Se ha desactivado el registro \`Emoji Actualizado\`")
        break;
        case "bans":
            updateLog(message.guild,   { banAdd: false, banRemove: false })
            message.channel.send("Se han desactivado los registros de Baneos")
        break;
        case "ban":
            updateLog(message.guild,   { banAdd: false })
            message.channel.send("Se ha desactivado el registro \`Ban\`")
        break;
        case "unban":
            updateLog(message.guild,   { banRemove: false })
            message.channel.send("Se ha desactivado el registro \`UnBan\`")
        break;
        case "member":
            updateLog(message.guild,   { MemberAdd: false, MemberRemove: false, MemberUpdate: false })
            message.channel.send("Se han desactivado los registros de Miembros")
        break;
        case "memberadd":
            updateLog(message.guild,   { MemberAdd: false })
            message.channel.send("Se ha desactivado el registro \`Miembro Nuevo\`")
        break;
        case "memberremove":
            updateLog(message.guild,   { MemberRemove: false })
            message.channel.send("Se ha desactivado el registro \`Miembro se va\`")
        break;
        case "memberupdate": 
            updateLog(message.guild,   { MemberUpdate: false })
            message.channel.send("Se ha desactivado el registro \`Miembro Actualizado\`")
        break;
        case "guildupdate":
            updateLog(message.guild,   { guildUpdate: false })
            message.channel.send("Se ha desactivado el registro \`Servidor Actualizado\`")
        break;
        case "invite":
            updateLog(message.guild,   { inviteCreate: false, inviteDelete: false })
            message.channel.send("Se han desactivado los registros de Invitación")
        break;
        case "invitecreate":
            updateLog(message.guild,   { inviteCreate: false })
            message.channel.send("Se ha desactivado el registro \`Invitación Creada\`")
        break;
        case "invitedelete": 
            updateLog(message.guild,   { inviteDelete: false })
            message.channel.send("Se ha desactivado el registro \`Invitación Eliminada\`")
        break;
        case "message":
            updateLog(message.guild,   { messageDelete: false, messageUpdate: false })
            message.channel.send("Se han desactivado los registros de Mensajes")
        break;
        case "messagedelete": 
            updateLog(message.guild,   { messageDelete: false })
            message.channel.send("Se ha desactivado el registro \`Mensaje Eliminado\`")
        break;
        case "messageupdate":
            updateLog(message.guild,   { messageUpdate: false })
            message.channel.send("Se ha desactivado el registro \`Mensaje Actualizado\`")
        break;
        case "role":
            updateLog(message.guild,   { roleCreate: false, roleDelete: false, roleUpdate: false })
            message.channel.send("Se han desactivado los registros de Roles")
        break;
        case "rolecreate":
            updateLog(message.guild,   { roleCreate: false })
            message.channel.send("Se ha desactivado el registro \`Rol Creado\`")
        break;
        case "roledelete":
            updateLog(message.guild,   { roleDelete: false })
            message.channel.send("Se ha desactivado el registro \`Rol Eliminado\`")
        break;
        case "roleupdate":
            updateLog(message.guild,   { roleUpdate: false })
            message.channel.send("Se ha desactivado el registro \`Rol Actualizado\`")
        break;
    }
    break;
    }
}
}