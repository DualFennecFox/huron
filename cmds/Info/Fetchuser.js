
   module.exports = {
    name : 'pi2g',
    category: "Info",
    description : 'Un comando b2sico que sirve para probar el bot, si escribes "!ping" este dira "Pong"',
    aliases: ['P2ng', 'P2NG'],
    usage: '!p2ng',
   run: async (client, message, args) => {

    let gUser = client.users.fetch(args[0])

    message.channel.send(`<@${gUser.id}> ID ${gUser.id}`);
    
}
}