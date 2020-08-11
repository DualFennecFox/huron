const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "bans",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild,   { banAdd: true, banRemove: true })
    message.channel.send("Se han activado los registros de Baneos")
}
else if (method === "disable") {
    updateLog(message.guild,   { banAdd: false, banRemove: false })
    message.channel.send("Se han desactivado los registros de Baneos")
}
    }
}