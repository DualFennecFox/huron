const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('./models/Guild')
const { updateGuild } = require('./models/functions')

module.exports = {
    name : 'welcome',
    category: "Moderacion",
    description : 'El Bot envia a un canal específico un mensaje de bienvenida, para especificar el usuario mencionado pon {user}, para el server usa {server} (usar {user} es obligatorio)',
    aliases: ['Welcome', 'WELCOME', 'welcomechannel', 'WelcomeChannel', 'WELCOMECHANNEL', 'Welcomechannel'],
    usage: '!welcome',
    examples: ['!welcome #canal "Bienvenido {user} a {server}"'],
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
        let welcomeMsg = args.slice(1).join(" ")
        let welcomeChannel = message.mentions.channels.first();
        if (!welcomeChannel) return message.channel.send("Debes especificar un canal para enviar el mensaje")
        if (!welcomeChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")
        if (!welcomeMsg) return message.channel.send("Debes especificar un mensaje de bienvenida")
        if (!welcomeMsg.includes("{user}")) return message.channel.send("Debes especificar un usuario con {user} para mencionarlo")

        updateGuild(message.guild, { JoinMsg: welcomeMsg, JoinBool: true, WelcomeChannel: welcomeChannel.id})

        message.channel.send("Se ha establecido el mensaje de bienvenida")
    }
}