const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "rolecreate",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { roleCreate: true })
    message.channel.send("Se ha activado el registro \`Rol Creado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { roleCreate: false })
    message.channel.send("Se ha desactivado el registro \`Rol Creado\`")
}
    }
}