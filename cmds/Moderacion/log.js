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
        let command;
        let method;

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
    }).catch(err => {
        console.error(err)
    })

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
        
        if (!args.length >= 1) {
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
        else if (args[0] === "enable" || args[0] || "disable") {
         if (args[0] === "enable") method = "enable"
         else if (args[0] === "disable") method = "disable";

         if (client.log.has(args[1])) {
            command = client.log.get(args[1])
        };
            if (command) command.run(message, method)
    }
}
}