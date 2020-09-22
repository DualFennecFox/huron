module.exports = {
    name : 'say',
    category: "Info",
    description : 'El bot envia un mensaje escrito por un usuario al canal',
    usage: '!say <Mensaje>',
    examples: ['!say Hola Mundo'],
    run: async (client, message, args) => {
    let argsresult;
    if (message.guild.me.hasPermission("MANAGE_MESSAGES" || "ADMINISTRATOR")) message.delete()

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
