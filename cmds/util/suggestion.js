const Discord = require('discord.js')
const Guild = require("../Moderacion/models/Guild")
const validateColor = require("validate-color")

module.exports = {
        name : 'suggestion',
        category: "Moderacion",
        aliases: ["suggest"],
        description : 'Este comando sugiere cosas para el servidor en un canal especificado.',
        usage: '!suggestion <Sugerencia>',
        examples: ['!suggestion Pongan al Bot de Wumpus'],
        run: async (client , message, args) => {

        if (!args[0]) return message.channel.send("Debes sugerir algo")
        
        Guild.findOne({ guildID: message.guild.id }).then(async doc => {
        if (!doc) return message.channel.send("No hay ningún canal de sugerencias declarado")

        let channel = message.guild.channels.cache.get(doc.suggestionChannel)
        if (!channel) return message.channel.send("El canal de sugerencias no parece ser válido")

        if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para enviar mensajes en el canal de sugerencias")
        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete()
        let color = doc.suggestionColor
        if (!color || !validateColor.validateHTMLColorHex(color)) color = "RANDOM"
        let level = doc.suggestionLevel
        if (isNaN(level)) level = 1

        let suggestion = args.join(" ")
        
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Sugerencia #${level}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
        .setColor(color)
        .setDescription(suggestion)
        .setFooter(`Por: ${message.author.tag} ID: ${message.author.id}`)

        channel.send({ embed }).then(msg => {
        msg.react("✅")
        msg.react("❌")
        })

        doc.suggestionLevel = level + 1

        await doc.save()

        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
}
}