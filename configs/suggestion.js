const Guild = require('../cmds/Moderacion/models/Guild')
const { getGuild, updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")
const { validateHTMLColorHex } = require('validate-color')

module.exports = {
    name: "suggestion",
    run: async (message, args, method) => {

    if (method === "enable") {
        if (!args[2]) return message.channel.send("Debes mencionar un canal o su ID")

        let color = "RANDOM"

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
        if (!channel) {
            if (validateHTMLColorHex(args[2].toUpperCase()) || args[2].toUpperCase() === "RANDOM") color = args[2].toUpperCase()
        }

        Guild.findOne({ guildID: message.guild.id }).then(async doc => {
        if (doc) {
            if (doc.suggestionColor || doc.suggestionColor !== "RANDOM") color = doc.suggestionColor
        }
        if (!channel) channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[3])

        if (!channel) {
        if (validateHTMLColorHex(args[3].toUpperCase()) || args[3].toUpperCase() === "RANDOM") color = args[3].toUpperCase()
        }
        if (!channel && !color) return message.channel.send("Debes especificar un canal o color válido")

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
                    role: [],
                    muteUsers: [],
                    suggestionChannel: channel,
                    suggestionColor: color,
                    suggestionLevel: 0
                  };
                  try {
                    createGuild(newGuild);
                  } catch (error) {
                    console.error(error);
                  }
            }
            else updateGuild(message.guild, { suggestionChannel: channel })
            
            return message.channel.send("Se ha establecido el canal de sugerencias")
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error al establecer el canal de sugerencias")
        })
    }
    else if (method === "disable") {
        Guild.findOne({ guildID: message.guild.id }).then(doc => {
            if (!doc) {
                message.channel.send("No existe un canal de sugerencias")
                return getGuild(message.guild)
             }
           else if (!doc.suggestionChannel) return message.channel.send("No existe un canal de sugerencias")
        else {
        updateGuild(message.guild, { suggestionChannel: "", suggestionColor: "", suggestionLevel: 0 })

        message.channel.send("Se han eliminado las sugerencias")
        }
    }).catch(err => {
        console.error(err)
        message.channel.send("Ha ocurrido un error")
    })
    }
    }
}
