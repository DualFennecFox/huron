
    module.exports.run = async (client, message, args) => {

    message.channel.send("Ping!");
    
}
module.exports.help = {
    name : 'pong',
    description : 'Un comando básico que sirve para probar el bot, si escribes "!pong" este dira "Ping"',
    aliases: ['Pong', 'PONG'],
    usage: '!pong'
}