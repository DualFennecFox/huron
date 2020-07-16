const Discord = require('discord.js');
const musicData = require("./requirements/musicData")
    module.exports = {
            name : 'stop',
            category: "Musica",
            aliases: ['Stop', 'STOP'],
            description : 'Este comando termina borra todas las canciones de la cola',
            usage: '!stop',
            examples: ['!stop'],
            run: async(client, message, args) => {
               
                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")

                musicData.queue.length = 0
                musicData.isPlaying = false
                musicData.pause = false

                await musicData.songDispatcher.destroy()
                musicData.songDispatcher = null
                return message.channel.send("Se han detenido y borrado de la cola todas las canciones")
            }
    }