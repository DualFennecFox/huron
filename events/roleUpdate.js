const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const  { changeRole } = require('../cmds/Moderacion/models/functions')

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
        let getremoveperm = []
        let position = false
        let mentionable = false
        let hoist = false
        let getnewperm = []

        let boolean = {
            "false": "No",
            "true": "Si"
        }
        console.log("viejo " + oldRole.permissions)
        console.log("nuevo " + newRole.permissions)
        if (oldRole.name != newRole.name) {
            name = true
        }
        for (const role of newRole.permissions.toArray()) {
            if (!oldRole.permissions.has(role)) {
                newperm = true
                let rol = changeRole[role]
                getnewperm.push(rol)
            }
          }
        for (const role of oldRole.permissions.toArray()) {
            if (!newRole.permissions.has(role)) {
                removeperms = true
                let rol = changeRole[role]
                getremoveperm.push(rol)
        }
        }
        if (oldRole.position != newRole.position) {
            position = true
        }
        if (oldRole.mentionable != newRole.mentionable) {
            mentionable = true
        }
        if (oldRole.hoist != newRole.hoist) {
            hoist = true
        }
        if (name == false && newperm == false && position == false && removeperms == false && mentionable == false && hoist == false) return

        const embed = new Discord.MessageEmbed()
        .setAuthor("Rol Actualizado", newRole.guild.iconURL())
        .setFooter(`${newRole.name} | ${newRole.id}`)
        .setColor("#FF0000")
        if (name == true) embed.addField("Nombre Antes | Después", `${oldRole.name} | ${newRole.name}`)
        if (newperm == true) embed.addField("Permisos Agregados", `${getnewperm.map(r => r).join(", ")}`)
        if (removeperms == true) embed.addField("Permisos Removidos", `${getremoveperm.map(r => r).join(", ")}`)
        if (position == true) embed.addField("Posición", `**De:** ${oldRole.position}\n**A:** ${newRole.position}`)
        if (mentionable == true) embed.addField("Mencionable", `**${boolean[newRole.mentionable]}**`)
        if (hoist == true) embed.addField("Mostrar Separado", `**${boolean[role.hoist]}**`)
    
        Channel.send({ embed }) 
    }
}).catch(err => {
    console.error(err)
})
}