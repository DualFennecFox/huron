const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "emojiupdate",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { emojiUpdate: true })
    message.channel.send("Se ha activado el registro \`Emoji Actualizado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { emojiUpdate: false })
    message.channel.send("Se ha desactivado el registro \`Emoji Actualizado\`")
}
    }
}