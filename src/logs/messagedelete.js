const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "messagedelete",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { messageDelete: true })
    message.channel.send("Se ha activado el registro \`Mensaje Eliminado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { messageDelete: false })
    message.channel.send("Se ha desactivado el registro \`Mensaje Eliminado\`")
}
    }
}