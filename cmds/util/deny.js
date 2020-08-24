const Guild = require("../Moderacion/models/Guild")

module.exports = {
        name : 'deny',
        category: "Util",
        description : 'Este comando Denega sugerencias que se hayan creado en el canal de sugerencias',
        usage: '!deny <Mensaje> <Razón>',
        examples: ['!deny 12345678987654321 No me parece necesario'],
        run: async (client , message, args) => {

            if (!args[0]) return message.channel.send("Debes especificar un mensaje")
            if (!message.member.hasPermission("MANAGE_GUILD" || "MANAGE_MEMBERS"|| "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")

            Guild.findOne({ guildID: message.guild.id }).then(async doc => {

                let channel = message.guild.channels.cache.get(doc.suggestionChannel)
                if (!channel) return message.channel.send("El canal de sugerencias no parece ser válido")
            
                let msg = channel.messages.cache.get(args[0])
                if (!msg) {
                    let MsgID = args[0].replace(/([^0-9])/g, '')
                    try {
                        msg = await channel.messages.fetch(MsgID)
                    } catch (err) {
                        return message.channel.send("Ese no parece ser un ID de mensaje válido")
                    }
                }
                if (!msg) return message.channel.send("Ese no parece ser un ID de mensaje válido")

                if (msg.author.id !== client.user.id) return message.channel.send("Ese no es un mensaje de sugerencias")
                if (!msg.editable) return message.channel.send("No puedo editar ese mensaje")
                
                let approved = false
                if (!msg.embeds[0]) return message.channel.send("Ese no es un mensaje de sugerencias")
                if (!msg.embeds[0].author) return message.channel.send("Ese no es un mensaje de sugerencias")
                if (!msg.embeds[0].author.name.includes("Sugerencia #")) return message.channel.send("Ese no es un mensaje de sugerencias")

                    if (msg.embeds[0].fields[0]) {
                        if (msg.embeds[0].fields[0].name === "Aprobada" || msg.embeds[0].fields[0].name === "Denegada") {
                            approved = true
                        }
                    }
                if (approved === true) return message.channel.send("Esta sugerencia ya esta respondida")

                if (!args[1]) return message.channel.send("Debes especificar una razón")
                let reason = args.slice(1).join(" ")
                
                msg.edit(msg.embeds[0].addField("Denegada", reason))

                return message.channel.send("Se ha denegado la sugerencia")
            }).catch(err => {
                console.error(err)
                message.channel.send("Ha ocurrido un error")
            })
        }
    }