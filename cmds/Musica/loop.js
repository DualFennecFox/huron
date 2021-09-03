const musicData = require("./requirements/musicData")
    module.exports = {
            name : 'loop',
            category: "Musica",
            description : 'Este comando hace que se escuche una canción infinitamente hasta que se desactive',
            usage: '!loop',
            run: async(client, message, args) => {

                if (!musicData.server[message.guild.id]) return message.channel.send({ content: "No se esta escuchando ninguna canción" })
                if (!message.member.voice.channel) return message.channel.send({ content: "Debes estar en un canal de voz para usar este comando" })
                if (!message.guild.me.voice.channel) return message.channel.send({ content: "No estoy en un canal de voz" })
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send({ content: "Debes estar conectado a mi canal de voz para usar este comando" })
                if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send({ content: "No se esta escuchando ninguna canción" })
                if (musicData.server[message.guild.id].loop == false) {
                    musicData.server[message.guild.id].loop = true 
                    message.channel.send({ content: "Bucle activado" })
                } 
                else if (musicData.server[message.guild.id].loop == true) {
                    musicData.server[message.guild.id].loop = false
                    musicData.server[message.guild.id].looped.length = 0
                    message.channel.send({ content: "Bucle desactivado" })
                }
            }
        }