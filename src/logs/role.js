const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "role",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { roleCreate: true, roleDelete: true, roleUpdate: true })
    message.channel.send("Se han activado los registros de Roles")
}
else if (method === "disable") {
    updateLog(message.guild, { roleCreate: false, roleDelete: false, roleUpdate: false })
    message.channel.send("Se han desactivado los registros de Roles")
}
    }
}