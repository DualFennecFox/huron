const musicData = require("./requirements/musicData")
    module.exports = {
            name : 'pause',
            category: "Musica",
            aliases: ['Pause', 'PAUSE'],
            description : 'Este comando pausa la canción que se este escuchando',
            usage: '!pause',
            examples: ['!pause'],
            run: async(client, message, args) => {
               
                if (!musicData.server[message.guild.id]) return message.channel.send("No se esta escuchando ninguna canción")
                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
                if (musicData.server[message.guild.id].pause == true) return message.channel.send("Ya están pausadas las canciones")

                musicData.server[message.guild.id].pause = true
                try {
                musicData.server[message.guild.id].songDispatcher.pause()
                } catch (err) {
                    console.error(err)
                    return message.channel.send("A ocurrido un error al pausar la canción")
                }
                message.channel.send("Se ha pausado la canción")
            }
    }