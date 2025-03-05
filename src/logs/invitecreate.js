const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "invitecreate",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { inviteCreate: true })
    message.channel.send("Se ha activado el registro \`Invitación Creada\`")
}
else if (method === "disable") {
    updateLog(message.guild, { inviteCreate: false })
    message.channel.send("Se ha desactivado el registro \`Invitación Creada\`")
}
    }
}