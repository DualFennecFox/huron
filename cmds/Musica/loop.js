const Discord = require('discord.js');
const musicData = require("./requirements/musicData")
    module.exports = {
            name : 'loop',
            category: "Musica",
            aliases: ['Loop', 'LOOP'],
            description : 'Este comando hace que se escuche una canción infinitamente hasta que se desactive',
            usage: '!loop',
            examples: ['!loop'],
            run: async(client, message, args) => {

                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
                if (musicData.loop == false) {
                    musicData.loop = true 
                    message.channel.send("Bucle activado")
                } 
                else if (musicData.loop == true) {
                    musicData.loop = false
                    musicData.looped.length = 0
                    message.channel.send("Bucle desactivado")
                }
            }
        }