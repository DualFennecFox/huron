const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "unban",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild,   { banRemove: true })
    message.channel.send("Se ha activado el registro \`UnBan\`")
}
else if (method === "disable") {
    updateLog(message.guild,   { banRemove: false })
    message.channel.send("Se ha desactivado el registro \`UnBan\`")
}
    }
}