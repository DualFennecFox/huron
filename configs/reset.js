const { updateGuild } = require("../cmds/Moderacion/models/functions");
const Guild = require("../cmds/Moderacion/models/Guild");

module.exports = {
    name: "reset",
    run: async (message) => {
        if (!message.member.permissions.has("MANAGE_GUILD" || "ADMINISTRATOR")) return message.channel.send("No tienes permisos para usar este comando")

        Guild.findOne({ guildID: message.guild.id }).then(doc => {
            if (!doc) return message.channel.send("No se ha modificado ningún ajuste")
        
        const newGuild = {
            guildID: message.guild.id,
            guildName: message.guild.name,
            guildOwner: message.client.users.cache.get(message.guild.ownerId).username,
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
          };

          updateGuild(message.guild, newGuild)

        return message.channel.send("Se han reseteado de fábrica las configuraciones")
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error al resetear los ajustes")
        })
    }
}