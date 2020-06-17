
    module.exports.run = async (client, message, args) => {

    message.channel.send("Pong!");
    
}
module.exports.help = {
    name : 'ping',
    description : 'Un comando básico que sirve para probar el bot, si escribes "!ping" este dira "Pong"',
    aliases: ['Ping', 'PING'],
    usage: '!ping'
}