const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const  { changeRole } = require('../cmds/Moderacion/models/functions')

module.exports = async (oldRole, newRole) => {
    let client = newRole.client
    Guild.findOne({ guildID: newRole.guild.id }).then(async doc => {
        if (!doc) return
        if (doc.log.roleUpdate == true) {
          if (!doc.LogChannel) return
          let Channel = newRole.guild.channels.cache.get(doc.LogChannel)
          if (!Channel) return
          if (!Channel.permissionsFor(newRole.guild.me).has("SEND_MESSAGES")) return

        let name = false
        let newperm = false
        let removeperms = false
        let getremoveperm = ""
        let position = false
        let mentionable = false
        let hoist = false
        let getnewperm = ""

        let boolean = {
            "false": "No",
            "true": "Si"
        }
        if (oldRole.name != newRole.name) {
            name = true
        }
        let log = await newRole.guild.fetchAuditLogs({ limit: 5, type: "ROLE_UPDATE" })

        let roleLog = log.entries.filter(l => l.target.id === newRole.id).array()[0]
    
        let news = roleLog.changes.filter(c => c.new)
        if (news) {
            newperm = true
            getnewperm = news
            console.log(news)
        }
        let olds = roleLog.changes.filter(c => c.old)
        if (olds) {
            removeperms = true
            getremoveperm = olds
            console.log(olds)
        }
        let removePerm = roleLog.changes.filter(c => c.old)

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
        if (newperm == true) embed.addField("Permisos Agregados", `${getnewperm.join(", ").toString()}`)
        if (removeperms == true) embed.addField("Permisos Removidos", `${getremoveperm.join(", ").toString()}`)
        if (position == true) embed.addField("Posición", `**De:** ${oldRole.rawPosition}\n**A:** ${newRole.rawPosition}`)
        if (mentionable == true) embed.addField("Mencionable", `**${boolean[newRole.mentionable]}**`)
        if (hoist == true) embed.addField("Mostrar Separado", `**${boolean[newRole.hoist]}**`)
    
        Channel.send({ embed }) 
    }
}).catch(err => {
    console.error(err)
})
}