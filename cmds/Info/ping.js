
   module.exports = {
    name : 'ping',
    category: "Info",
    description : 'Un comando básico que sirve para probar el bot, si escribes "!ping" este dira "Pong"',
    aliases: ['Ping', 'PING'],
    usage: '!ping',
   run: async (client, message, args) => {

    message.channel.send("Pong!");
    
}
}