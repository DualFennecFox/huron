const Discord = require('discord.js');
const musicData = require("./requirements/musicData")
const { playSong }= require("./play")
    module.exports = {
            name : 'skip',
            category: "Musica",
            aliases: ['Skip', 'SKIP'],
            description : 'Este comando se salta la canción que se este escuchando por la siguiente en la cola',
            usage: '!skip',
            examples: ['!skip'],
            run: async(client, message, args) => {   
                
                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
                if (musicData.queue.length <= 1) return message.channel.send("No hay ninguna otra canción en la cola")

                musicData.queue.shift();
                return playSong(musicData.queue, message)
            }
        }