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
        if (oldRole.name != newRole.name) {
            name = true
        }
        let newerperm = newRole.permissions.toArray()
        for (let v = 0; v < newRole.permissions.toArray().length; v++) {
            if (!oldRole.permissions.has(newerperm[v])) {
                newperm = true
                if (newRole.permissions.has('ADMINISTRATOR')) {
                getnewperm.push("Administrador")
                break;
                }
                else {
                    let rol = changeRole[newerperm[v]]
                    getnewperm.push(rol)
                }
            }
          }
          let oldperm = oldRole.permissions.toArray()
        for (let v = 0; v < oldRole.permissions.toArray().length; v++) {
            if (!newRole.permissions.has(oldperm[v])) {
                removeperms = true
                if (oldRole.permissions.has("ADMINISTRATOR")) {
                getremoveperm.push("Administrador")
                break;
                }
                else {
                    let rol = changeRole[oldperm[v]]
                    getremoveperm.push(rol)
                }
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
        .setDescription(`<@&${newRole.id}>`)
        if (name == true) embed.addField("Nombre Antes | Después", `${oldRole.name} | ${newRole.name}`)
        if (newperm == true) embed.addField("Permisos Agregados", `${getnewperm.join(", ")}`)
        if (removeperms == true) embed.addField("Permisos Removidos", `${getremoveperm.join(", ")}`)
        if (position == true) embed.addField("Posición", `**De:** ${oldRole.rawPosition}\n**A:** ${newRole.rawPosition}`)
        if (mentionable == true) embed.addField("Mencionable", `**${boolean[newRole.mentionable]}**`)
        if (hoist == true) embed.addField("Mostrar Separado", `**${boolean[newRole.hoist]}**`)
    
        Channel.send({ embed }) 
    }
}).catch(err => {
    console.error(err)
})
}