const Discord = require('discord.js')
const Guild = require("../Moderacion/models/Guild")
const validateColor = require("validate-color")
const { updateGuild, getGuild } = require('../Moderacion/models/functions')

module.exports = {
        name : 'suggestion',
        category: "Util",
        description : 'Este comando sirve para aprobar (approve), denegar (deny) y resetear el número de sugerencias del servidor (reset)',
        usage: '!suggestion <approve, deny o reset> <Razón>',
        examples: ['!suggestion Pongan al Bot de Wumpus'],
        run: async (client , message, args) => {

            if (!args[0]) return message.channel.send("Debes especificar si aprobar, denegar o resetear las sugerencias")

            switch (args[0].toLowerCase()) {
            case "approve":
                if (!args[1]) return message.channel.send("Debes especificar un mensaje")
                if (!message.member.hasPermission("MANAGE_GUILD" || "MANAGE_MEMBERS"|| "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
                
                Guild.findOne({ guildID: message.guild.id }).then(async doc => {
    
                    let channel = message.guild.channels.cache.get(doc.suggestionChannel)
                    if (!channel) return message.channel.send("El canal de sugerencias no parece ser válido")
                
                    let msg = channel.messages.cache.get(args[1])
                    if (!msg) {
                        let MsgID = args[1].replace(/([^0-9])/g, '')
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
    
                    if (!args[2]) return message.channel.send("Debes especificar una razón")
                    let reason = args.slice(2).join(" ")
                    msg.edit(msg.embeds[0].addField("Aprobada", reason).setColor("#7BFFCF"))
    
                    return message.channel.send("Se ha aprobado la sugerencia")
                }).catch(err => {
                    console.error(err)
                    message.channel.send("Ha ocurrido un error")
                })
                break;
                case "deny":
                    
            if (!args[1]) return message.channel.send("Debes especificar un mensaje")
            if (!message.member.hasPermission("MANAGE_GUILD" || "MANAGE_MEMBERS"|| "ADMINISTRATOR") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")

            Guild.findOne({ guildID: message.guild.id }).then(async doc => {

                let channel = message.guild.channels.cache.get(doc.suggestionChannel)
                if (!channel) return message.channel.send("El canal de sugerencias no parece ser válido")
            
                let msg = channel.messages.cache.get(args[1])
                if (!msg) {
                    let MsgID = args[1].replace(/([^0-9])/g, '')
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

                if (!args[2]) return message.channel.send("Debes especificar una razón")
                let reason = args.slice(2).join(" ")
                
                msg.edit(msg.embeds[0].addField("Denegada", reason).setColor("#FF7B7B"))

                return message.channel.send("Se ha denegado la sugerencia")
            }).catch(err => {
                console.error(err)
                message.channel.send("Ha ocurrido un error")
            })
            break;
            case "reset":
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
            break;
            default: 
                message.channel.send("Esa no es una opción válida")
            break;
            }
         }
    }