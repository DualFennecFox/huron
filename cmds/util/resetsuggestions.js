const Guild = require('../Moderacion/models/Guild')

module.exports = {
    name: "resetsuggestions",
    category: "Util",
    description: "Resetea todas las sugerencias",
    run: async (client, message, args) => {
        
        Guild.findOne({ guildID: message.guild.id }).then(doc => {
            if (!doc) {
                message.channel.send("No hay ninguna sugerencia")
                return getGuild(message.guild)
             }
           else if (doc.suggestionLevel === 0) return message.channel.send("No hay ninguna sugerencia")
        else {
        updateGuild(message.guild, { suggestionLevel: 0 })

        message.channel.send("Se han restablecido las sugerencias")
        }
    }).catch(err => {
        console.error(err)
        message.channel.send("Ha ocurrido un error")
    })  
    }
}