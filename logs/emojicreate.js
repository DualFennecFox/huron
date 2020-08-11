const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "emojicreate",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild,   { emojiCreate: true })
    message.channel.send("Se ha activado el registro \`Emoji Creado\`")
}
else if (method === "disable") {
    updateLog(message.guild,   { emojiCreate: false })
    message.channel.send("Se ha desactivado el registro \`Emoji Creado\`")
}
    }
}