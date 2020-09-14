module.exports = {
    name : 'say',
    category: "Info",
    description : 'El bot envia un mensaje escrito por un usuario, también puedes elegir un canal a donde enviarlo con {sendchannel} #canal',
    aliases: ['announcement', 'acc'],
    usage: '!say <Canal o Mensaje>',
    examples: ['!say Hola Mundo', '!say {sendchannel} #Canal Hola Mundo'],
    run: async (client, message, args) => {
    let argsresult;
    let mChannel = message.mentions.channels.first();
    if (message.guild.me.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR")) message.delete()

    if(mChannel && args[0] == "{sendchannel}") {
        if (!mChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
        if (!mChannel.permissionsFor(message.member).has("SEND_MESSAGES")) mChannel = message.channel
        
        argsresult = args.join(" ")
        if(!argsresult) return;
        
        argsresult = argsresult.replace(mChannel, '').replace(args[0], '')

        if (!message.member.hasPermission("MENTION_EVERYONE" || "ADMINISTRATOR") || !message.guild.owner) {
            argsresult = argsresult.replace(/@everyone/, "@\u200beveryone").replace(/@here/, "@\u200bhere")
        }
        if(!message.member.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR") || !message.guild.owner) {
            
               argsresult = argsresult.replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")

        }
        
        mChannel.send(argsresult)
    } else {
        argsresult = args.join(" ")
        if(!argsresult) return;

        if (!message.member.hasPermission("MENTION_EVERYONE" || "ADMINISTRATOR") || !message.guild.owner) {
            argsresult = argsresult.replace(/@everyone/, "@\u200beveryone").replace(/@here/, "@\u200bhere")
        }
        if(!message.member.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR") || !message.guild.owner) {
            
               argsresult = argsresult.replace(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[A-z0-9]/, "")

        }

         message.channel.send(argsresult)
        }
    }
}