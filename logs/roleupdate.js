const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "roledelete",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { roleUpdate: true })
    message.channel.send("Se ha activado el registro \`Rol Actualizado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { roleUpdate: true })
    message.channel.send("Se ha desactivado el registro \`Rol Actualizado\`")
}
    }
}