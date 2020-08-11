const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "channelcreate",
    run: async (message, method) => {
if (method === "enable") {
updateLog(message.guild,  { channelCreate: true })
message.channel.send("Se ha activado el registro \`Canal Creado\`")
}
else if (method === "disable") {
    updateLog(message.guild,  { channelCreate: false })
message.channel.send("Se ha desactivado el registro \`Canal Creado\`")
}
    }
}