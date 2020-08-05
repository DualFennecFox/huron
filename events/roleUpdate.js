const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldRole, newRole) => {
    let client = newRole.client
    Guild.findOne({ guildID: newRole.guild.id }).then(doc => {
        if (!doc) return
        if (doc.log.roleUpdate == true) {
          if (!doc.LogChannel) return
          let Channel = newRole.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(newRole.guild.me).has("SEND_MESSAGES")) return

        let name = false
        let newperm = false
        let removeperms = false
        let getremoveperm;
        let position = false
        let getnewperm

        console.log("viejo " + oldRole.permissions)
        console.log("nuevo " + newRole.permissions)
        if (oldRole.name != newRole.name) {
            name = true
        }
        for (const role of newRole.permissions.serialize()) {
            if (!oldRole.has(role)) {
                newperm = true
                getnewperm = role
            }
          }
        for (const role of oldRole.permissions.serialize()) {
            if (!newRole.has(role)) {
                removeperms = true
                getremoveperm = role
        }
        }
        if (oldRole.position != newRole.position) {
            position = true
        }
        if (name == false && perm == false && position == false) return

        const embed = new Discord.MessageEmbed()
        .setAuthor("Rol Actualizado", newRole.guild.iconURL())
        .setFooter(`${newRole.name} | ${newRole.id}`)
        .setColor("#FF0000")
        if (name == true) embed.addField("Nombre Antes | Después", `${oldRole.name} | ${newRole.name}`)
        if (newperm == true) embed.addField("Permisos Agregados", `${getnewperm}`)
        if (removeperms == true) embed.addField("Permisos Removidos", `${getremoveperm}`)
        if (position == true) embed.addField("Posición", `**De:** ${oldRole.position}\n**A:** ${newRole.position}`)
    
        Channel.send({ embed })
    }
}).catch(err => {
    console.error(err)
})
}