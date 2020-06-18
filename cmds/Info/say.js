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

    if (args.length === 0) {
        return
    } else if (args.length === 1) {
    message.delete()
    if(mChannel) {
        argsresult = args.slice(1).join(" ")
        mChannel.send(argsresult)
    } else {
        argsresult = args.join(" ")
        message.channel.send(argsresult)
    }
    }
} 
}