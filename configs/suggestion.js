const Guild = require('../cmds/Moderacion/models/Guild')
const { getGuild, updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")
const { validateHTMLColorHex } = require('validate-color')

module.exports = {
    name: "suggestion",
    run: async (message, args, method) => {

    if (method === "enable") {
        if (!args[2]) return message.channel.send("Debes especificar un canal")

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])

        if (!channel && !color) return message.channel.send("Debes especificar un canal")
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
            return message.channel.send("Ha ocurrido un error")
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
        updateGuild(message.guild, { suggestionChannel: ""})

        message.channel.send("Se han eliminado las sugerencias")
        }
    }).catch(err => {
        console.error(err)
        return message.channel.send("Ha ocurrido un error")
    })
}
    }
}