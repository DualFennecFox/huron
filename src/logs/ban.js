const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "ban",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild,   { banAdd: true })
    message.channel.send("Se ha activado el registro \`Ban\`")
}
else if (method === "disable") {
    updateLog(message.guild,   { banAdd: false })
    message.channel.send("Se ha desactivado el registro \`Ban\`")
}
    }
}