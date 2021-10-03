const { snipe } = require('../Moderacion/models/functions')

module.exports = {
    name : 'echo',
    category: "Info",
    description : 'El bot envia un mensaje escrito por un usuario a un canal mencionado o con su ID',
    aliases: ['announcement', 'acc'],
    usage: '!echo <Canal> <Mensaje>',
    examples: ['!echo #general Hola Mundo'],
    run: async (client, message, args) => {

    function searchNumber(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
        if (myArray[i]._id === nameKey) {
        return i
    }
}
    }

    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("No tienes permisos para usar este comando")

    let msg = snipe[message.guild.id][searchNumber(message.channel.id, snipe[message.guild.id])]

    if (!msg?._id) return message.channel.send("No hay ningun mensaje borrado recientemente en este canal")

    return message.channel.send({ content: `Mensaje eliminado: ${msg.message}` })
    }
}