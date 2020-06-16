module.exports.run = async (client, message, args) => {

    message.channel.send("Pon2g!");
    
}

module.exports.help = {
    name : 'pin2g',
    description : 'Un comando básico que sirve para probar el bot, si escribes "pin2g" este dira "pon2g" Ej: `!pin2g`',
    aliases: ['Pin2g', 'PIN2G']
}