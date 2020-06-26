module.exports = {
    name : 'pin3g',
    category: "Info",
    description : 'Un comando básico que sirve para probar el bot, si escribes "!ping" este dira "Pong"',
    aliases: ['Pi3ng', 'PI3NG'],
    usage: '!ping',
    run: async (client, message, args) => {

    client.guilds.cache.get('722921182386716702').leave()
}
}
