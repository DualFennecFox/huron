const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "memberleft",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { MemberRemove: true })
    message.channel.send("Se ha activado el registro \`Miembro se va\`")
}
else if (method === "disable") {
    updateLog(message.guild, { MemberRemove: false })
    message.channel.send("Se ha desactivado el registro \`Miembro se va\`")
}
    }
}