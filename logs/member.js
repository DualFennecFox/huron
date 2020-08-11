const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "unban",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { MemberAdd: true, MemberRemove: true, MemberUpdate: true })
    message.channel.send("Se han activado los registros de Miembros")
}
else if (method === "disable") {
    updateLog(message.guild, { MemberAdd: false, MemberRemove: false, MemberUpdate: false })
    message.channel.send("Se han desactivado los registros de Miembros")
}
    }
}