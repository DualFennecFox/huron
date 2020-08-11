const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "message",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { messageDelete: true, messageUpdate: true })
    message.channel.send("Se han activado los registros de Mensajes")
}
else if (method === "disable") {
    updateLog(message.guild, { messageDelete: false, messageUpdate: false })
    message.channel.send("Se han desactivado los registros de Mensajes")
}
    }
}