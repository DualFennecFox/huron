const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "messageupdate",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { messageUpdate: true })
    message.channel.send("Se ha activado el registro \`Mensaje Actualizado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { messageUpdate: false })
    message.channel.send("Se ha desactivado el registro \`Mensaje Actualizado\`")
}
    }
}