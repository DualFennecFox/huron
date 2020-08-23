const Discord = require('discord.js')
const Guild = require("../Moderacion/models/Guild")

module.exports = {
        name : 'deny',
        category: "Util",
        description : 'Este comando Denega sugerencias que se hayan creado en el canal de sugerencias',
        usage: '!deny <Mensaje> <Razón>',
        examples: ['!deny 12345678987654321 No me parece necesario'],
        run: async (client , message, args) => {
            Guild.findOne({ guildID: message.guild.id }).then(async doc => {

                let channel = message.guild.channels.cache.get(doc.suggestionChannel)
                if (!channel) return message.channel.send("El canal de sugerencias no parece ser válido")
            
                let msg = channel.messages.cache.get(args[0])
                if (!msg) {
                    try {
                        msg = await channel.messages.fetch(args[0])
                    } catch (err) {
                        console.error(err)
                        return message.channel.send("Ese no parece ser un ID de mensaje válido")
                    }
                }
                if (!msg) return message.channel.send("Ese no parece ser un ID de mensaje válido")

                if (msg.author.id !== client.user.id) return message.channel.send("Ese no es un mensaje de sugerencias")
                if (!msg.editable) return message.channel.send("No puedo editar ese mensaje")
                
                let approved = false
                if (message.embeds[0]) {
                    if (message.embeds[0].fields) {
                        if (message.embeds[0].fields[0].name === "Aprobada" || message.embeds[0].fields[0].name === "Denegada") {
                            approved = true
                        }
                    }
                }
                if (approved === true) return message.channel.send("Esta sugerencia ya esta respondida")

                let reason = args.slice(1).join(" ")
                msg.embeds[0].addField("Denegada", reason)

                return message.channel.send("Se ha denegado la sugerencia")
            }).catch(err => {
                console.error(err)
                message.channel.send("Ha ocurrido un error")
            })
        }
    }