const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { checkDays } = require('../cmds/Moderacion/models/functions')

module.exports = async message => {
        let client = message.client
        Guild.findOne({ guildID: message.guild.id }).then(doc => {
            if (!doc) return
            if (doc.log.messageDelete == true) {
                if (!doc.LogChannel) return
                let Channel = message.guild.channels.cache.get(doc.LogChannel)
                if (!Channel) return
                if (!Channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
            
            let msg = message.content
            if (message.attachments) msg += message.attachments.map(r => `[${r.name}](${r.url})`).join(", ")
            if (message.embeds) {
                message.embeds.forEach(embed => {
                if (embed.description) msg += `**Descripción:** ${embed.description}\n`
                if (embed.fields) msg += `**Campos:** ${embed.fields.value}\n\n`
                if (embed.footer) msg += `**Pie:** ${embed.footer.text}`
                })
            }
            const embed = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setDescription(`${msg}`)
            .setFooter(`De: ${message.author.tag} | ${message.author.id}`)
        
        Channel.send(`Mensaje Eliminado En: <#${message.channel.id}>`, {embed})
    }
    }).catch(err => {
            console.error(err)
    })
    }