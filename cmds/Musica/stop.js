const musicData = require("./requirements/musicData")
    module.exports = {
            name : 'stop',
            category: "Musica",
            description : 'Este comando termina y borra todas las canciones de la cola',
            usage: '!stop',
            run: async(client, message, args) => {
                if (!musicData.server[message.guild.id]) return message.channel.send("No se esta escuchando ninguna canción")
                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")

                musicData.server[message.guild.id].queue.length = 0
                musicData.server[message.guild.id].isPlaying = false
                musicData.server[message.guild.id].pause = false
                musicData.server[message.guild.id].loop = false
                musicData.server[message.guild.id].looped.length = 0
                musicData.server[message.guild.id].awaiting = false
                await musicData.server[message.guild.id].songDispatcher.dispatcher.destroy()
                musicData.server[message.guild.id].songDispatcher = null
                return message.channel.send("Se han detenido y borrado de la cola todas las canciones")
            }
    }