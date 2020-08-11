const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "memberupdate",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { MemberUpdate: true })
    message.channel.send("Se ha activado el registro \`Miembro Actualizado\`")
}
else if (method === "disable") {
    updateLog(message.guild, { MemberUpdate: false })
    message.channel.send("Se ha desactivado el registro \`Miembro Actualizado\`")
}
    }
}