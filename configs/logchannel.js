const Guild = require("../cmds/Moderacion/models/Guild")
const { updateGuild, createGuild } = require("../cmds/Moderacion/models/functions")

module.exports = {
    name: "logchannel",
    run: async (message, args, method) => {


    if (!message.member.permissions.has("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS")) return message.channel.send("No tienes permisos para usar este comando")
    if (method === "enable") {
let Channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);
if (!Channel) return message.channel.send("Debes especificar un canal")

if (!Channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")

Guild.findOne({ guildID: message.guild.id }).then(doc => {
    if (!doc) {
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
            LogChannel: Channel,
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
            muteUsers: []
          };
          try {
            createGuild(newGuild);
          } catch (error) {
            console.error(error);
          }
    }
    else updateGuild(message.guild, { LogChannel: Channel })
    
    return message.channel.send("Se ha establecido el canal de registros")
}).catch(err => {
    console.error(err)
    message.channel.send("Ha ocurrido un error al establecer el canal de registros")
})
    }
    else if (method === "disable") {
      Guild.findOne({ guildID: message.guild.id }).then(doc => {
        if (!doc) {
            message.channel.send("No existe un canal para logear")
            return getGuild(message.guild)
         }
       else if (!doc.LogChannel) return message.channel.send("No existe un canal para logear")
    else {
    updateGuild(message.guild, { LogChannel: "" })

    message.channel.send("Se ha eliminado el canal de logeos")
    }
}).catch(err => {
    console.error(err)
    message.channel.send("Ha ocurrido un error")
})
    }
}
}
