const { EmbedBuilder } = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
let { snipe } = require('../cmds/Moderacion/models/functions')


module.exports = async message => {
    let client = message.client
    let chn = message.channel.id
    snipe[message.guild.id] =  { chn: [{
        _id: message.channel.id,
        message: message.content,
        member: message.member
    }]  
}

        Guild.findOne({ guildID: message.guild.id }).then(async doc => {
            if (!doc) return
            if (doc.log.messageDelete == true) {
                if (!doc.LogChannel) return
                let Channel = message.guild.channels.cache.get(doc.LogChannel)
                if (!Channel) return
                if (!Channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")) return
                if (message.author.id === client.user.id) return

            if (!message.content && !message.attachments.first()) return 

            const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(message.content)
            .setFooter({ text: `De: ${message.author.tag} | ${message.author.id}`, iconURL: message.author.displayAvatarURL({ format: "png", dynamic: true})})
            if (message.attachments.first()) {
                
                embed.addFields([{ name: "Archivos Adjuntados", value: message.attachments.map(r => r.name).join(", ")}])
            }
        
        Channel.send({ content: `Mensaje Eliminado En: <#${message.channel.id}>`, embeds: [embed]})
    }
    }).catch(err => {
            console.error(err)
    })
    }