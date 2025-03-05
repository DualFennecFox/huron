const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "guildupdate",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { guildUpdate: true })
    message.channel.send("Se ha activado el registro \`Servidor Actualizado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { guildUpdate: false })
    message.channel.send("Se ha desactivado el registro \`Servidor Actualizado\`")
}
    }
}