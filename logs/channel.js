const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "channel",
    run: async (message, method) => {
if (method === "enable") {
updateLog(message.guild, { channelCreate: true, channelDelete: true, channelUpdate: true })
            
message.channel.send("Se han activado los registros de Canales")
}
else if (method === "disable") {
    updateLog(message.guild, { channelCreate: false, channelDelete: false, channelUpdate: false })
            
message.channel.send("Se han activado los registros de Canales")
}
    }
}