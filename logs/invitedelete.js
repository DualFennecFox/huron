const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "invitedelete",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { inviteDelete: true })
    message.channel.send("Se ha activado el registro \`Invitación Eliminada\`")
}
else if (method === "disable") {
    updateLog(message.guild, { inviteDelete: false })
    message.channel.send("Se ha desactivado el registro \`Invitación Eliminada\`")
}
    }
}