    module.exports = {
        name : 'pong',
        category: "Info",
        description : 'Un comando básico que sirve para probar el bot, si escribes "!pong" este dira "Ping"',
        usage: '!pong',
    run: async (client, message, args) => {

    message.channel.send("Ping!");
    
}
}