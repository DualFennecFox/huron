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
                if (!musicData.server[message.guild.id]) return message.channel.send("No se esta escuchando ninguna canción")
                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
                if (musicData.server[message.guild.id].queue.length < 1) return message.channel.send("No hay ninguna otra canción en la cola")

                musicData.server[message.guild.id].loop = false
                musicData.server[message.guild.id].looped.length = 0
                return playSong(musicData.server[message.guild.id].queue, message)
            }
        }
