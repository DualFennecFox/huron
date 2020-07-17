const Discord = require('discord.js');
const search = require('youtube-search');
const ytdl = require('ytdl-core')
const musicData = require("./requirements/musicData")
module.exports = {
    name : 'leave',
    category: "Musica",
    aliases: ['Leave', 'LEAVE', 'disconnect', 'Disconnect', 'DISCONNECT'],
    description : 'Este comando saca al bot del canal de voz del usuario si es que esta',
    usage: '!leave',
    examples: ['!leave'],
    run: async(client, message, args) => {

        if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
        if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
        if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")

    musicData.queue.length = 0
    musicData.isPlaying = false
    musicData.pause = false
    musicData.loop = false
    musicData.looped.length = 0
    musicData.songDispatcher = null
    message.guild.me.voice.channel.leave()
    message.channel.send("Dejando el canal de voz")
    }
}