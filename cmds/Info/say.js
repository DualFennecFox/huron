const Discord = require('discord.js');

module.exports = {
    name : 'say',
    category: "Info",
    description : 'El bot envia un mensaje escrito por un usuario, también puedes elegir un canal a donde enviarlo',
    aliases: ['Say', 'SAY'],
    usage: '!say',
    examples: ['!say Hola Mundo', '!say #Canal Hola Mundo'],
    run: async (client, message, args) => {
    let argsresult;
    let mChannel = message.mentions.channels.first();

    message.delete()
    if(mChannel) {
        if(message.author.hasPermission("MANAGE_MESSAGES", "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para enviar este mensaje a otro canal!")
        argsresult = args.slice(1).join(" ")
        if(!argsresult) return;
        mChannel.send(argsresult)
    } else {
        argsresult = args.join(" ")
        if(!argsresult) return;
        message.channel.send(argsresult)
    }
} 
}