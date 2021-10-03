const { snipe } = require('../Moderacion/models/functions')

module.exports = {
    name : 'snipe',
    category: "Info",
    description : 'Muestra el ultimo mensaje borrado de el canal especificado o el canal donde se ejecuto el comando',
    usage: '!snipe',
    run: async (client, message, args) => {

    function searchNumber(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
        if (myArray[i]._id === nameKey) {
        return i
    }
}
    }

    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("No tienes permisos para usar este comando")
    if (!snipe[message.guild.id]) return message.channel.send("No hay ningun mensaje borrado recientemente en este canal")
    let msg = snipe[message.guild.id][searchNumber(message.channel.id, snipe[message.guild.id])]

    if (!msg?._id) return message.channel.send("No hay ningun mensaje borrado recientemente en este canal")

    return message.channel.send({ content: `Mensaje eliminado: ${msg.message}` })
    }
}