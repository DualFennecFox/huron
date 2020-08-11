const { updateGuild } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "all",
    run: async (client, message, args, method) => {
            if (method === "enable") {
            updateGuild(message.guild, {log: {
                channelCreate: true,
                channelDelete: true,
                channelPinsUpdate: true,
                channelUpdate: true,
                emojiCreate: true,
                emojiDelete: true,
                emojiUpdate: true,
                banAdd: true,
                banRemove: true,
                MemberAdd: true,
                MemberRemove: true,
                MemberUpdate: true,
                guildUpdate: true,
                inviteCreate: true,
                inviteDelete: true,
                messageDelete: true,
                messageDeleteBulk: true,
                messageUpdate: true,
                roleCreate: true,
                roleDelete: true,
                roleUpdate: true,
                userUpdate: false,
                voiceState: false
            }
                })    
            message.channel.send("Se han activado todos los registros")
            }
            else if (method === "disable") {
                updateGuild(message.guild, {log: {
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
            })
            message.channel.send("Se han desactivado todos los registros")
        }
    }
}