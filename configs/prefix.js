const Guild = require('../cmds/Moderacion/models/Guild')
const { updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")

module.exports = {
    name: "prefix",
    run: async (message, args) => {

        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR")) return message.channel.send("No tienes permisos para usar este comando")
        if (!args[1]) return message.channel.send(`Mi prefix en este server es ${prefix}`)
        let nPrefix = args.slice(1).join(" ");
        Guild.findOne({ guildID: message.guild.id }).then(doc => {
            if (!doc) {
                const newGuild = {
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    guildOwner: message.guild.members.cache.get(message.guild.ownerID).user.tag,
                    guildOwnerID: message.guild.ownerID,
                    prefix: nPrefix,
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
                    channelPinsUpdate: false,
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
                  return message.channel.send(`Su nuevo Prefix es ${nPrefix}`)
            }
            else {
            updateGuild(message.guild, { prefix: nPrefix });
           return message.channel.send(`Su nuevo Prefix es ${nPrefix}`)
        }
        }).catch(err => {
            console.error(err)
        })
    }
}
