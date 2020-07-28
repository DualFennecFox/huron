const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('./models/Guild')
const { updateGuild } = require('./models/functions')

module.exports = {
    name : 'leave',
    category: "Moderacion",
    description : 'El Bot envia a un canal específico un mensaje de despedida, para especificar el usuario mencionado pon {user}, para el server usa {server} (usar {user} es obligatorio)',
    aliases: ['Leave', 'LEAVE', 'Leavechannel', 'LEAVECHANNEL', 'LeaveChannel'],
    usage: '!leave',
    examples: ['!leave #canal "{user} se ha ido de {server}"'],
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
        let leaveMsg = args.slice(1).join(" ")
        let leaveChannel = message.mentions.channels.first();
        if (!leaveChannel) return message.channel.send("Debes especificar un canal para enviar el mensaje")
        if (!leaveChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("No tengo permisos para hablar en ese canal")
        if (!leaveMsg) return message.channel.send("Debes especificar un mensaje de bienvenida")
        if (!leaveMsg.includes("{user}")) return message.channel.send("Debes especificar un usuario con {user} para mencionarlo")

        updateGuild(message.guild, { LeaveMsg: leaveMsg, LeaveBool: true, LeaveChannel: leaveChannel.id})

        message.channel.send("Se ha establecido el mensaje de despedida")
    }
}