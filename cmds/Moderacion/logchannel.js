const Guild = require("./models/Guild")
const { updateGuild, createGuild } = require("./models/functions")

module.exports = {
    name : 'logchannel',
    category: "Moderacion",
    description : 'Este comando activa un canal para los registros, importante para que funcionen los logs',
    aliases: ['Logchannel', 'LogChannel', 'LOGCHANNEL'],
    usage: '!logchannel',
    examples: ['!logchannel #Canal-mencionado', '!logchannel ID'],
    run: async (client , message, args) => {
        if (message.author.id !== process.env.OWNER) return
        
        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS")) return message.channel.send("No tienes permisos para usar este comando")
        
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel) return message.channel.send("Debes especificar un canal")

        if (channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")

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
                    LogChannel: channel,
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
                    userUpdate: false,
                    voiceState: false
                    },
                    warns: []
                  };
                  try {
                    createGuild(newGuild);
                  } catch (error) {
                    console.error(error);
                  }
            }
            else updateGuild(message.guild, { LogChannel: channel })
            
            return message.channel.send("Se ha establecido el canal de registros")
        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error al establecer el canal de registros")
        })
    }
}