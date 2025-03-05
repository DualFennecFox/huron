const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "channeldelete",
    run: async (message, method) => {
if (method === "enable") {
updateLog(message.guild,  { channelDelete: true })
message.channel.send("Se ha activado el registro \`Canal Eliminado\`")
}
else if (method === "disable") {
    updateLog(message.guild,  { channelDelete: false })
message.channel.send("Se ha desactivado el registro \`Canal Eliminado\`")
}
    }
}