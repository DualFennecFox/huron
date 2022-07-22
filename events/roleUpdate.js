const { EmbedBuilder } = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const  { changeRole } = require('../cmds/Moderacion/models/functions')

module.exports = async (oldRole, newRole) => {

    Guild.findOne({ guildID: newRole.guild.id }).then(async doc => {
        if (!doc) return
        if (doc.log.roleUpdate == true) {
          if (!doc.LogChannel) return
          let Channel = newRole.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(newRole.guild.members.me).has("SEND_MESSAGES")) return

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
        
        for (const perm of newRole.permissions.toArray()) {
        if (oldRole.permissions.has("ADMINISTRATOR")) {
            getnewperm.push("Todos (Administrador)")
            break;
        }
        else if (!oldRole.permissions.has(perm, false)) {
            newperm = true
            getnewperm.push(changeRole[perm])    
            }
        }
        let r = newRole.permissions.has()
        for (const perm of oldRole.permissions.toArray()) {
        if (newRole.permissions.has("ADMINISTRATOR")) {
            getremoveperm.push("Todos (Administrador)")
            break;
        }
        else if (!newRole.permissions.has(perm, false)) {
            removeperms = true
            getremoveperm.push(changeRole[perm])
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

        let arr = []
        const embed = new EmbedBuilder()
        .setAuthor({ name: "Rol Actualizado", iconURL: newRole.guild.iconURL() })
        .setFooter({ text: `${newRole.name} | ${newRole.id}` })
        .setColor("#FF0000")
        .setDescription(`<@&${newRole.id}>`)
        if (name == true) arr.push({ name: "Nombre Antes | Después", value: `${oldRole.name} | ${newRole.name}` })
        if (newperm == true) arr.push({ name:  "Permisos Agregados", value: `${getnewperm.join(", ")}` })
        if (removeperms == true) arr.push({ name: "Permisos Removidos", value: `${getremoveperm.join(", ")}` })
        if (position == true) arr.push({ name: "Posición", value: `**De:** ${oldRole.rawPosition}\n**A:** ${newRole.rawPosition}` })
        if (mentionable == true) arr.push({ name: "Mencionable", value: `**${boolean[newRole.mentionable]}**` })
        if (hoist == true) arr.push({ name: "Mostrar Separado", value: `**${boolean[newRole.hoist]}**` })

        embed.setFields(arr)
    
        Channel.send({ embeds: [embed] }) 
    }
}).catch(err => {
    console.error(err)
})
}