const Guild = require("../cmds/Moderacion/models/Guild")
const { getGuild, updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")

module.exports = {
    name: "confession",
    run: async (message, args, method) => {

        if (method === "enable") {
            if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_CHANNELS")) return message.channel.send("No tienes permisos para usar este comando")
            let leaveChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
            if (!leaveChannel) return message.channel.send("Debes especificar un canal")
            if (!leaveChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")

            Guild.findOne({ guildID: message.guild.id }).then(doc => {
                if (!doc) {
                    const newGuild = {
                        guildID: message.guild.id,
                        guildName: message.guild.name,
                        guildOwner: message.guild.members.cache.get(message.guild.ownerID).user.username,
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
                        muteUsers: [],
                        confessionChannel: leaveChannel,
                        confessionLevel: 1
                      };
                      try {
                        createGuild(newGuild);
                        
                      } catch (error) {
                        console.error(error);
                      }
                      return message.channel.send("Se ha establecido el canal") 
                }
                else {
                    updateGuild(message.guild, { confessionChannel: leaveChannel.id, confessionLevel: 1})
                    return message.channel.send("Se ha establecido el canal") 
                }
            }).catch(err => {
                console.error(err)
            })               
        }
        else if (method === "disable") {
            Guild.findOne({ guildID: message.guild.id }).then(doc => {
                if (!doc) {
                    message.channel.send("No existe un canal en mi base de datos")
                    return getGuild(message.guild)
                 }
               else if (doc.LeaveBool == false) return message.channel.send("Ya esta desactivado esta configuración")
            else {
            updateGuild(message.guild, {  confessionChannel: "", confessionLevel: 1})
    
            message.channel.send("Se ha eliminado el canal de mi base de datos")
            }
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
        }
    }
}
