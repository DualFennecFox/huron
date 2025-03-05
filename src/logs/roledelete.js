const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "roledelete",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { roleDelete: true })
    message.channel.send("Se ha activado el registro \`Rol Eliminado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { roleDelete: false })
    message.channel.send("Se ha desactivado el registro \`Rol Eliminado\`")
}
    }
}