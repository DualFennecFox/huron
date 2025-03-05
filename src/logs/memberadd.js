const { updateLog } = require('../cmds/Moderacion/models/functions')

module.exports = {
    name: "memberadd",
    run: async (message, method) => {
if (method === "enable") {
    updateLog(message.guild, { MemberAdd: true })
    message.channel.send("Se ha activado el registro \`Miembro Nuevo\`")
}
else if (method === "disable") {
    updateLog(message.guild, { MemberAdd: false })
    message.channel.send("Se ha desactivado el registro \`Miembro Nuevo\`")
}
    }
}