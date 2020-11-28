const Guild = require("../cmds/Moderacion/models/Guild")
const { getGuild, updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")

module.exports = {
    name: "allyrole",
    run: async (message, args, method) => {

        if (method === "enable") {
            if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_CHANNELS")) return message.channel.send("No tienes permisos para usar este comando")
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
            if (!role) return message.channel.send('Debes mencionar un rol o darme su ID')

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
                        muteUsers: [],
                        confessionChannel: leaveChannel,
                        confessionLevel: 1,
                        allyRole: role
                      };
                      try {
                        createGuild(newGuild);
                        
                      } catch (error) {
                        console.error(error);
                      }
                      return message.channel.send(`Se ha establecido el rol **${role.name}** para los aliados`) 
                }
                else {
                    updateGuild(message.guild, { allyRole: role})
                    return message.channel.send(`Se ha establecido el rol **${role.name}** para los aliados`) 
                }
            }).catch(err => {
                console.error(err)
            })               
        }
        else if (method === "disable") {
            Guild.findOne({ guildID: message.guild.id }).then(doc => {
                if (!doc) {
                    message.channel.send("No existe un rol en mi base de datos")
                    return getGuild(message.guild)
                 }
               else if (doc.LeaveBool == false) return message.channel.send("Ya esta desactivado esta configuración")
            else {
            updateGuild(message.guild, { allyRole: "" })
    
            message.channel.send("Se ha eliminado el rol de mi base de datos")
            }
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
        }
    }
}