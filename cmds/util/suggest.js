const Discord = require('discord.js')
const Guild = require("../Moderacion/models/Guild")
const validateColor = require("validate-color")

module.exports = {
        name : 'suggest',
        category: "Util",
        description : 'Este comando sugiere cosas para el servidor en un canal especificado.',
        usage: '!suggest <Sugerencia>',
        examples: ['!suggest Pongan al Bot de Wumpus'],
        run: async (client , message, args) => {

        if (!args[0]) return message.channel.send("Debes sugerir algo")
        
        Guild.findOne({ guildID: message.guild.id }).then(async doc => {
        if (!doc) return message.channel.send("No hay ningún canal de sugerencias declarado")

        let channel = message.guild.channels.cache.get(doc.suggestionChannel)
        if (!channel) return message.channel.send("El canal de sugerencias no parece ser válido")

        if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para enviar mensajes en el canal de sugerencias")
        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete()
        let level = doc.suggestionLevel
        if (doc.suggestionLevel === 0) level = 1

        let suggestion = args.join(" ")
        
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Sugerencia #${level}`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
        .setColor("#7BA7FF")
        .setDescription(suggestion)
        .setFooter(`Por: ${message.author.tag}`)

        channel.send({ embed }).then(msg => {
        if (message.guild.me.hasPermission("ADD_REACTIONS")) {
        msg.react("✅")
        msg.react("❌")
        }
        })

        message.channel.send("Se ha enviado tu sugerencia con exito").then(msg => msg.delete({timeout: 5000})).catch(err => console.error(err))

        doc.suggestionLevel = level + 1

        await doc.save()

        }).catch(err => {
            console.error(err)
            message.channel.send("Ha ocurrido un error")
        })
}
}