const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { changeRole } = require('../cmds/Moderacion/models/functions')
module.exports = async (oldChannel, newChannel) => {
        if (newChannel.type == "dm") return
        let client = newChannel.client 
        Guild.findOne({ guildID: newChannel.guild.id }).then(doc => {
            if (!doc) return
            if (doc.log.channelUpdate == true) {
              if (!doc.LogChannel) return
              let Channel = newChannel.guild.channels.cache.get(doc.LogChannel)
              if (!Channel) return
              if (!Channel.permissionsFor(newChannel.guild.me).has("SEND_MESSAGES")) return
    
            let name = false
            let newperm = false
            let removeperms = false
            let getremoveperm = []
            let position = false
            let getnewperm = []

            if (oldChannel.name != newChannel.name) {
                name = true
            }
            for (const channel of newChannel.permissionOverwrites.values()) {
                if (!oldChannel.permissionOverwrites.has(channel)) {
                    newperm = true
                    let rol = changeRole[channel]
                    getnewperm.push(rol)
                }
              }
            for (const channel of oldChannel.permissionOverwrites.values()) {
                if (!newChannel.permissionOverwrites.has(channel)) {
                    removeperms = true
                    let rol = changeRole[channel]
                    getremoveperm.push(rol)
            }
            }
            if (oldChannel.position != newChannel.position) {
                position = true
            }
    
            if (name == false && newperm == false && position == false && removeperms == false) return
    
            const embed = new Discord.MessageEmbed()
            .setAuthor("Canal Actualizado", newChannel.guild.iconURL())
            .setFooter(`${newChannel.name} | ${newChannel.id}`)
            .setColor("#FF0000")
            .setDescription(`<#${newChannel.id}>`)
            if (name == true) embed.addField("Nombre Antes | Después", `${oldChannel.name} | ${newChannel.name}`)
            if (newperm == true) embed.addField("Permisos Agregados", `${getnewperm.join(", ")}`)
            if (removeperms == true) embed.addField("Permisos Removidos", `${getremoveperm.join(", ")}`)
            if (position == true) embed.addField("Posición", `**De:** ${oldChannel.rawPosition}\n**A:** ${newChannel.rawPosition}`)
        
            Channel.send({ embed }) 
        }
    }).catch(err => {
        console.error(err)
    })
    }