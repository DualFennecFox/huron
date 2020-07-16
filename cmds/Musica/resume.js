const Discord = require('discord.js');
const musicData = require("./requirements/musicData")
    module.exports = {
            name : 'resume',
            category: "Musica",
            aliases: ['Resume', 'RESUME', 'continue', 'Continue', 'CONTINUE', 'stop', 'Stop', 'STOP'],
            description : 'Este comando continua la canción que se haya pausado',
            usage: '!resume',
            examples: ['!resume'],
            run: async(client, message, args) => {
                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
                if (musicData.pause == false) return message.channel.send("Ya están reanudadas las canciones")

                
                musicData.pause = false
                musicData.songDispatcher.resume()
                message.channel.send("Se ha reanudado la canción")
            }
        }