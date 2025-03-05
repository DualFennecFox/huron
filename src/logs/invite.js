const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "invite",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { inviteCreate: true, inviteDelete: true })
    message.channel.send("Se han activado los registros de Invitación")
}
else if (method === "disable") {
    updateLog(message.guild, { inviteCreate: false, inviteDelete: false })
    message.channel.send("Se han desactivado los registros de Invitación")
}
    }
}