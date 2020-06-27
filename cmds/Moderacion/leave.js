module.exports = {
    name : 'leave',
    category: "Moderacion",
    description : 'Un comando básico que sirve para probar el bot, si escribes "!ping" este dira "Pong"',
    aliases: ['Leave', 'LEAVE'],
    usage: '!leave',
    run: async (client, message, args) => {

    client.guilds.cache.get('722921182386716702').leave()
}
}
