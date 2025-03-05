const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "emojidelete",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { emojiDelete: true })
    message.channel.send("Se ha activado el registro \`Emoji Eliminado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { emojiDelete: false })
    message.channel.send("Se ha desactivado el registro \`Emoji Eliminado\`")
}
    }
}