const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    let argsresult;
    let mChannel = message.mentions.channels.first();

    message.delete()
    if(mChannel) {
        argsresult = args.slice(1).join(" ")
        mChannel.send(argsresult)
    } else {
        argsresult = args.join(" ")
        message.channel.send(argsresult)
    }
} 

module.exports.help = {
    name : 'say',
    description : 'El bot envia un mensaje escrito por un usuario, también puedes elegir un canal a donde enviarlo Ej: `!say Hola Mundo`, `!say #canal Hola Mundo`',
    aliases: ['Say', 'SAY']
}