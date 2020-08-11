const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "channelupdate",
    run: async (message, method) => {
if (method === "enable") {
updateLog(message.guild,  { channelUpdate: true })
message.channel.send("Se ha activado el registro \`Canal Actualizado\`")
}
else if (method === "disable") {
    updateLog(message.guild,  { channelUpdate: false })
message.channel.send("Se ha desactivado el registro \`Canal Actualizado\`")
}
    }
}