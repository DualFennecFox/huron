const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('./models/Guild')
const { updateGuild } = require('./models/functions')

module.exports = {
    name : 'disablewelcome',
    category: "Moderacion",
    description : 'Este comando elimina el mensaje de bienvenida',
    aliases: ['Disablewelcome', 'DisableWelcome', 'DISABLEWELCOME'],
    usage: '!disablewelcome',
    examples: ['!disablewelcome"'],
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR" || "MANAGE_MEMBERS") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando")
        Guild.findOne({ guildID: message.guild.id }).then(doc => {
            if (doc.JoinBool == false) return message.channel.send("Ya estaba desactivado el mensaje")
        })
        updateGuild(message.guild, { JoinMsg: "", JoinBool: false, WelcomeChannel: ""})

        message.channel.send("Se ha eliminado el mensaje de bienvenida")
    }
}