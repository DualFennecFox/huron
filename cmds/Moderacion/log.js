const Discord = require('discord.js')
const Guild = require("./models/Guild")
const { updateLog, createGuild, updateGuild, changePerm } = require("./models/functions")

module.exports = {
    name : 'log',
    category: "Moderacion",
    description : 'Este comando te permite activar los logs y ver cuales están activos, para que funcione debes poner un canal con !logchannel #Canal',
    aliases: ['Log', 'LOG', 'logs', 'Logs', 'LOGS'],
    usage: '!kick',
    examples: ['!log messagedelete', '!log nickname', '!log channel'],
    run: async (client , message, args, prefix) => {

        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS")) return message.channel.send("No tienes permisos para usar este comando")

        let active = undefined
        let unable = undefined
        let command;
        let method;

        Guild.findOne({ guildID: message.guild.id }).then(async (doc) => {
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
        for (let key in doc.log) {
            if (doc.log[key] == true && changePerm[key] != undefined) {
                active += `${changePerm[key]}\n`
            }
            else if (doc.log[key] == false && changePerm[key] != undefined) {
                unable += `${changePerm[key]}\n`
            }
        }
        
        if (!args.length >= 1) {
            const embed = new Discord.MessageEmbed()
                .setAuthor("Registros", client.user.displayAvatarURL())
                .setColor("#FFFF00")
                .setDescription(`Para que funcionen los registros se debe poner un canal con ${prefix}logchannel #Canal-Mencionado, se pueden seleccionar todos los eventos con \"All\"\n\n**Eventos:**\nchannel, channelcreate, channeldelete, channelupdate, emoji, emojicreate, emojidelete, emojiupdate, bans, ban, unban, member, memberadd, memberremove, memberupdate, guildupdate, invite, invitecreate, invitedelete, message, messagedelete, messageupdate, role, rolecreate, roledelete`)
                embed.addField("Todos",  "Canal Creado\nCanal Eliminado\nEmoji Creado\nEmoji Eliminado\nEmoji Actualizado\nBaneo\nDesbaneo\nNuevo Miembro\nMiembro se va\nMiembro Actualizado\nServidor Actualizado\nInvitación Creada\nInvitación Eliminada\nMensaje Eliminado\nMensaje Editado\nRol Creado\nRol Eliminado")
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
}).catch(err => {
    console.error(err)
})
}
}