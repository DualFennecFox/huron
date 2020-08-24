const Discord = require('discord.js')
const Guild = require("./models/Guild")
const { createGuild, updateGuild, changePerm } = require("./models/functions")

module.exports = {
    name : 'log',
    category: "Moderacion",
    description : 'Este comando te permite activar los logs y ver cuales están activos, para que funcione debes poner un canal con !logchannel #Canal',
    aliases: ['logs'],
    usage: '!log <evento>',
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
                    warns: [],
                    role: []
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
        let arg = args[0].toLowerCase()
        if (!args.length >= 1) {
            const embed = new Discord.MessageEmbed()
                .setAuthor("Registros", client.user.displayAvatarURL())
                .setColor("#FFFF00")
                .setDescription(`Para que funcionen los registros se debe poner un canal con ${prefix}logchannel #Canal-Mencionado, se pueden seleccionar todos los eventos con \"All\"\n\n**Eventos:**\nchannel, channelcreate, channeldelete, channelupdate, emoji, emojicreate, emojidelete, emojiupdate, bans, ban, unban, member, memberadd, memberremove, memberupdate, guildupdate, message, messagedelete, messageupdate, role, rolecreate, roledelete`)
                embed.addField("Todos",  "Canal Creado\nCanal Eliminado\nEmoji Creado\nEmoji Eliminado\nEmoji Actualizado\nBaneo\nDesbaneo\nNuevo Miembro\nMiembro se va\nMiembro Actualizado\nServidor Actualizado\nMensaje Eliminado\nMensaje Editado\nRol Creado\nRol Eliminado")
                if (active != undefined) embed.addField("Activados", active.replace("undefined", ""))
                if (unable != undefined) embed.addField("Desactivados", unable.replace("undefined", ""));

                message.channel.send({ embed })
                return
        }
         else if (arg === "enable" || arg === "disable") {
         if (arg === "enable") method = "enable"
         else if (arg === "disable") method = "disable";
        
         let cmd = args[1].toLowerCase()

         if (client.log.has(cmd)) {
            command = client.log.get(cmd)
        };
            if (command) command.run(message, method)
            else return message.channel.send("Ese no es un evento válido")
    }
    else return message.channel.send("Dime si quieres activarlo o desactivarlo")
}).catch(err => {
    console.error(err)
})
}
}