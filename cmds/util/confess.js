const { EmbedBuilder } = require('discord.js')
const Guild = require('../Moderacion/models/Guild')

module.exports = {
    name: "confess",
    category: "Util",
    description: "Envia tu confesión anonima al canal de confesiones",
    usage: "!confess",
    examples: ["!confess <confesión>"],
    run: async (client, message, args) => {

        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send("Por privacidad es necesario que yo pueda borrar mensajes")
        message.delete()
        
        if (!args[0]) return message.channel.send("Dime que quieres confesar").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
        
        Guild.findOne({ guildID: message.guild.id }).then(async doc => {
        if (!doc) return message.channel.send("No hay ningún canal de confesiones declarado").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))

        let channel = message.guild.channels.cache.get(doc.confessionChannel)
        if (!channel) return message.channel.send("El canal de confesiones no parece ser válido").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))

        if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para enviar mensajes en el canal de confesiones").then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
        let level = doc.confessionLevel

        let confession = args.join(" ")
        
        const embed = new EmbedBuilder()
        .setAuthor({name: `Confesión #${level}`, iconURL: message.guild.iconURL({ format: "png", dynamic: true, size: 2048})})
        .setColor("#f7f749")
        .setDescription(confession)

        channel.send({ embeds: [embed] })

        doc.confessionLevel = level + 1

        await doc.save()

        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
    }
    }