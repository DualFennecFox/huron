import { EmbedBuilder, Message, PermissionFlagsBits, TextChannel } from "discord.js"
import ExtendedClient from "../../classes/extendedClient"
import GuildModel from "../Moderacion/models/Guild"
import { updateGuild, getGuild } from '../Moderacion/models/functions'

export default {
    name: 'suggestion',
    category: "Util",
    description: 'Este comando sirve para aprobar (approve), denegar (deny) y resetear el número de sugerencias del servidor (reset)',
    usage: '!suggestion <approve, deny o reset> <Razón>',
    examples: ['!suggestion Pongan al Bot de Wumpus'],
    run: async ({ client, message, args }: {
        client: ExtendedClient,
        message: Message,
        args: string[]
    }) => {

        if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando!")

        if (!args[0]) return (message.channel as TextChannel).send("Debes especificar si aprobar, denegar o resetear las sugerencias")

        switch (args[0].toLowerCase()) {
            case "approve":
                {
                    if (!args[1]) return (message.channel as TextChannel).send("Debes especificar un mensaje")
                    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")

                    const doc = await GuildModel.findOne({ guildID: message.guildId })

                    const channel = message.guild?.channels.cache.get(doc?.suggestionChannel ?? "")
                    if (!channel) return (message.channel as TextChannel).send("El canal de sugerencias no parece ser válido")

                    let msg = (channel as TextChannel).messages.cache.get(args[1])
                    if (!msg) {
                        const MsgID = args[1].replace(/([^0-9])/g, '')
                        msg = await (channel as TextChannel).messages.fetch(MsgID)
                    }
                    if (!msg) return (message.channel as TextChannel).send("Ese no parece ser un ID de mensaje válido")

                    if (msg.author.id !== client.user?.id) return (message.channel as TextChannel).send("Ese no es un mensaje de sugerencias")
                    if (!msg.editable) return (message.channel as TextChannel).send("No puedo editar ese mensaje")

                    let approved = false
                    if (!msg.embeds[0]) return (message.channel as TextChannel).send("Ese no es un mensaje de sugerencias")
                    if (!msg.embeds[0].author) return (message.channel as TextChannel).send("Ese no es un mensaje de sugerencias")
                    if (!msg.embeds[0].author.name.includes("Sugerencia #")) return (message.channel as TextChannel).send("Ese no es un mensaje de sugerencias")

                    if (msg.embeds[0].fields[0]) {
                        if (msg.embeds[0].fields[0].name === "Aprobada" || msg.embeds[0].fields[0].name === "Denegada") {
                            approved = true
                        }
                    }
                    if (approved === true) return (message.channel as TextChannel).send("Esta sugerencia ya esta respondida")

                    if (!args[2]) return (message.channel as TextChannel).send("Debes especificar una razón")
                    const reason = args.slice(2).join(" ")
                    const embed = new EmbedBuilder(msg.embeds[0].toJSON())
                    embed.addFields({ name: "Aprobada", value: reason })
                    embed.setColor("#7BFFCF")
                    msg.edit({ embeds: [embed] })

                    return (message.channel as TextChannel).send("Se ha aprobado la sugerencia")
                }

            case "deny":

                {
                    if (!args[1]) return (message.channel as TextChannel).send("Debes especificar un mensaje")
                    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return (message.channel as TextChannel).send("No tienes permisos para usar este comando")

                    const doc = await GuildModel.findOne({ guildID: message.guildId })

                    const channel = message.guild?.channels.cache.get(doc?.suggestionChannel ?? "")
                    if (!channel) return (message.channel as TextChannel).send("El canal de sugerencias no parece ser válido")

                    let msg = (channel as TextChannel).messages.cache.get(args[1])
                    if (!msg) {
                        const MsgID = args[1].replace(/([^0-9])/g, '')
                        msg = await (channel as TextChannel).messages.fetch(MsgID)
                    }
                    if (!msg) return (message.channel as TextChannel).send("Ese no parece ser un ID de mensaje válido")

                    if (msg.author.id !== client.user?.id) return (message.channel as TextChannel).send("Ese no es un mensaje de sugerencias")
                    if (!msg.editable) return (message.channel as TextChannel).send("No puedo editar ese mensaje")

                    let approved = false
                    if (!msg.embeds[0]) return (message.channel as TextChannel).send("Ese no es un mensaje de sugerencias")
                    if (!msg.embeds[0].author) return (message.channel as TextChannel).send("Ese no es un mensaje de sugerencias")
                    if (!msg.embeds[0].author.name.includes("Sugerencia #")) return (message.channel as TextChannel).send("Ese no es un mensaje de sugerencias")

                    if (msg.embeds[0].fields[0]) {
                        if (msg.embeds[0].fields[0].name === "Aprobada" || msg.embeds[0].fields[0].name === "Denegada") {
                            approved = true
                        }
                    }
                    if (approved === true) return (message.channel as TextChannel).send("Esta sugerencia ya esta respondida")

                    if (!args[2]) return (message.channel as TextChannel).send("Debes especificar una razón")
                    const reason = args.slice(2).join(" ")

                    const embed = new EmbedBuilder(msg.embeds[0].toJSON())
                    embed.addFields({ name: "Denegada", value: reason })
                    embed.setColor("#FF7B7B")

                    msg.edit({ embeds: [embed] })
                    return (message.channel as TextChannel).send("Se ha denegado la sugerencia")
                }

            case "reset":
                {
                    const doc = await GuildModel.findOne({ guildID: message.guildId })
                    if (!doc) {
                        (message.channel as TextChannel).send("No hay ninguna sugerencia")
                        return getGuild(message.guild!)
                    }
                    else if (doc.suggestionLevel === 1) return (message.channel as TextChannel).send("No hay ninguna sugerencia")
                    else {
                        await updateGuild(message.guild!, { suggestionLevel: 1 })
                        await (message.channel as TextChannel).send("Se han restablecido las sugerencias")
                    }
                    break;
                }
            default:
                (message.channel as TextChannel).send("Esa no es una opción válida")
                break;
        }
    }
}