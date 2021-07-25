const Guild = require("../cmds/Moderacion/models/Guild")
const { getGuild, updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")
const validateColor = require("validate-color")

module.exports = {
    name: "muterole",
    run: async (message, args, method) => {

        if (method === "enable") {
            if (!message.member.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR")) return message.channel.send("No tienes permisos para usar este comando")
            if (!args[2]) return message.channel.send(`Menciona un rol, su ID o crea uno especificandolo`)
            if (!message.guild.me.hasPermission("MANAGE_ROLES", "MANAGE_CHANNELS")) return message.channel.send("No tengo permisos para Gestionar Roles o Gestionar Canales!")


                let mRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
                if (!mRole) {
                let Color = "#9b9b9b"
                if (args[3]) {
                Color = args[3].toUpperCase()
                if (!validateColor.validateHTMLColorHex(Color)) Color = "#9b9b9b"
}

                    try {
                        var muterole = await message.guild.roles.create({ data: {  
                            name : args[2],
                            color : Color,
                            permissions : []
                        }
                        })
                        message.guild.channels.cache.forEach(async (channel, id) => {
                            await channel.createOverwrite(muterole,  {
                                SEND_MESSAGES: false,
                                CREATE_INSTANT_INVITE: false,
                                ADD_REACTIONS: false,
                                SEND_TTS_MESSAGES: false,
                                ATTACH_FILES: false,
                                SPEAK: false
                            })
                        })
                        mRole = muterole
                    } catch (err) {
                        console.error(err)
                       return message.channel.send(`Se ha ocurrido un error al crear o modificar el rol ${mRole}`)
                }
            }
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
                        },
                        warns: [],
                        role: [],
                        muterole: mRole.id,
                        muteUsers: []
                      };
                      try {
                        createGuild(newGuild);
                        
                      } catch (error) {
                        console.error(error);
                      }
                      return message.channel.send(`Se ha establecido el Rol **${mRole.name}**`) 
                }
                else {
                    updateGuild(message.guild, { muterole: mRole.id })
                    return message.channel.send(`Se ha establecido el Rol **${mRole.name}**`) 
                }
            }).catch(err => {
                console.error(err)
                message.channel.send("Ha ocurrido un error")
            })               
        }
        else if (method === "disable") {
            Guild.findOne({ guildID: message.guild.id }).then(doc => {
                if (!doc) {
                    message.channel.send("No existe un rol de Muteado")
                    return getGuild(message.guild)
                 }
               else if (!doc.muterole) return message.channel.send("No existe un rol de Muteado")
            else {
            updateGuild(message.guild, { muterole: "" })
    
            message.channel.send("Se ha eliminado el rol")
            }
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
        }
    }
}
