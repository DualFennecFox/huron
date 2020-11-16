const Discord = require('discord.js')
const Guild = require('../Moderacion/models/Guild')

module.exports = {
    name: "confess",
    category: "Util",
    description: "Envia tu confesión anonima al canal de confesiones, puedes usar este comando tanto en el servidor como en el md para privacidad",
    usage: "!confess",
    examples: ["!confess <confesión>"],
    run: async (client, message, args, prefix) => {

        if (!args[0]) return message.channel.send("Dime que quieres confesar")

        if (message.channel.type === "dm") {
            let guild = client.guilds.cache.get("736200583320567820")
            Guild.findOne({ guildID: guild.id }).then(async doc => {
                if (!doc) return message.channel.send("No hay ningún canal de confesiones declarado")

                let channel = guild.channels.cache.get(doc.confessionChannel)
                if (!channel) return message.channel.send("El canal de confesiones no parece ser válido")

            if (!channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para enviar mensajes en el canal de confesiones")
            
            const embed = new Discord.MessageEmbed()
            .setAuthor(`Confesión #${level}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
            .setColor("#f7f749")
            .setDescription(args.join(" "))

            channel.send({ embed })
            return message.channel.send("Se ha enviado tu confesión con exito")
            })
        }        
        else {
        
        Guild.findOne({ guildID: message.guild.id }).then(async doc => {
        if (!doc) return message.channel.send("No hay ningún canal de confesiones declarado")

        let channel = message.guild.channels.cache.get(doc.confessionChannel)
        if (!channel) return message.channel.send("El canal de confesiones no parece ser válido")

        if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para enviar mensajes en el canal de confesiones")
        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete()
        let level = doc.confessionLevel
        if (doc.confessionLevel === 0) level = 1

        let confession = args.join(" ")
        
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Confesión #${level}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
        .setColor("#f7f749")
        .setDescription(confession)

        channel.send({ embed })

        doc.confessionLevel = level + 1

        await doc.save()

        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
    }
    }
}