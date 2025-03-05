const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "emoji",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { emojiCreate: true, emojiDelete: true, emojiUpdate: true })
    message.channel.send("Se han activado los registros de Emojis")
}
else if (method === "disable") {
    updateLog(message.guild, { emojiCreate: false, emojiDelete: false, emojiUpdate: false })
    message.channel.send("Se han desactivado los registros de Emojis")
}
    }
}