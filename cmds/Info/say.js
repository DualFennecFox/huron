const Discord = require('discord.js');

module.exports = {
    name : 'say',
    category: "Info",
    description : 'El bot envia un mensaje escrito por un usuario, también puedes elegir un canal a donde enviarlo con {sendchannel} #canal',
    aliases: ['Say', 'SAY', 'announcement', 'Announcement', 'ANNOUNCEMENT'],
    usage: '!say',
    examples: ['!say Hola Mundo', '!say {sendchannel} #Canal Hola Mundo'],
    run: async (client, message, args) => {
    let argsresult;
    let mChannel = message.mentions.channels.first();
    if (message.guild.me.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR")) message.delete()

    if(mChannel && args[0] == "{sendchannel}") {
        if (!mChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
        argsresult = args.join(" ")
        if(!argsresult) return;
        if(!message.member.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR") || !message.guild.owner) {
            mChannel = message.channel
           let replace = argsresult.replace(mChannel, '').replace(args[0], '').replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")
            mChannel.send(removeMentions(replace))
        }
       else {
        let remplased = argsresult.replace(mChannel, '').replace(args[0], '')
        mChannel.send(remplased)
    }
    } else {
        argsresult = args.join(" ")
        if(!argsresult) return;
        if(!message.member.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR") || !message.guild.owner) {
               let replace = argsresult.replace(/@everyone/g, "everyone").replace(/@here/g, "here").replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")
               message.channel.send(removeMentions(replace))
            } else  message.channel.send(argsresult)
        }
    }
}