const Guild = require("../cmds/Moderacion/models/Guild")
const { getGuild, updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")

module.exports = {
    name: "joinmsg",
    run: async (message, args, method) => {
        
        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_CHANNELS")) return message.channel.send("No tienes permisos para usar este comando")
        if (method === "enable") {
                
            let welcomeChannel = message.mentions.channels.first();
            if (!welcomeChannel) return message.channel.send("Debes especificar un canal para enviar el mensaje")
            if (!welcomeChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")

            let welcomeMsg = args.slice(2).join(" ").replace(welcomeChannel, '')
            if (!welcomeMsg) return message.channel.send("Debes especificar un mensaje de bienvenida")

            Guild.findOne({ guildID: message.guild.id }).then(doc => {
                if (!doc) {
                    const newGuild = {
                        guildID: message.guild.id,
                        guildName: message.guild.name,
                        guildOwner: message.guild.owner.user.username,
                        guildOwnerID: message.guild.ownerID,
                        prefix: '!',
                        JoinMsg: welcomeMsg,
                        JoinBool: true,
                        LeaveMsg: "",
                        LeaveBool: false,
                        WelcomeChannel: welcomeChannel.id,
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
                        },
                        warns: [],
                        muteUsers: []
                      };
                      try {
                        createGuild(newGuild);
                        
                      } catch (error) {
                        console.error(error);
                      }
                      return message.channel.send("Se ha establecido el mensaje de bienvenida")
                }
                else {
                    updateGuild(message.guild, { JoinMsg: welcomeMsg, JoinBool: true, WelcomeChannel: welcomeChannel.id})

                    return message.channel.send("Se ha establecido el mensaje de bienvenida")
                }
            }).catch(err => {
                console.error(err)
            })
        }
        else if (method === "disable") {
            if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_CHANNELS")) return message.channel.send("No tienes permisos para usar este comando")

            Guild.findOne({ guildID: message.guild.id }).then(doc => {
                if (!doc) {
                   message.channel.send("No existe un mensaje de bienvenida")
                   return getGuild(message.guild)
                }
               else if (doc.JoinBool == false) return message.channel.send("Ya estaba desactivado el mensaje")
            else {
            updateGuild(message.guild, { JoinMsg: "", JoinBool: false, WelcomeChannel: ""})
    
            message.channel.send("Se ha eliminado el mensaje de bienvenida")
            }
            }).catch(err => {
                console.error(err)
                return message.channel.send("Ha ocurrido un error")
            })
        }
    }
}
