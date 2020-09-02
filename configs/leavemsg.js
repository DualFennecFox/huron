const Guild = require("../cmds/Moderacion/models/Guild")
const { getGuild, updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")

module.exports = {
    name: "leavemsg",
    run: async (message, args, method) => {

        if (method === "enable") {
            if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_CHANNELS")) return message.channel.send("No tienes permisos para usar este comando")
            let leaveChannel = message.mentions.channels.first();
            if (!leaveChannel) return message.channel.send("Debes especificar un canal para enviar el mensaje")
            if (!leaveChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")
            let leaveMsg = args.slice(1).join(" ").replace(leaveChannel, '')
            if (!leaveMsg) return message.channel.send("Debes especificar un mensaje de despedida")
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
                        LeaveMsg: leaveMsg,
                        LeaveBool: true,
                        WelcomeChannel: "",
                        LeaveChannel: leaveChannel.id,
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
                        },
                        warns: [],
                        role: [],
                        muteUsers: []
                      };
                      try {
                        createGuild(newGuild);
                        
                      } catch (error) {
                        console.error(error);
                      }
                      return message.channel.send("Se ha establecido el mensaje de despedida") 
                }
                else {
                    updateGuild(message.guild, { LeaveMsg: leaveMsg, LeaveBool: true, LeaveChannel: leaveChannel.id})
                    return message.channel.send("Se ha establecido el mensaje de despedida") 
                }
            }).catch(err => {
                console.error(err)
            })               
        }
        else if (method === "disable") {
            Guild.findOne({ guildID: message.guild.id }).then(doc => {
                if (!doc) {
                    message.channel.send("No existe un mensaje de bienvenida")
                    return getGuild(message.guild)
                 }
               else if (doc.LeaveBool == false) return message.channel.send("Ya estaba desactivado el mensaje")
            else {
            updateGuild(message.guild, { LeaveMsg: "", LeaveBool: false, LeaveChannel: ""})
    
            message.channel.send("Se ha eliminado el mensaje de despedida")
            }
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
        }
    }
}
