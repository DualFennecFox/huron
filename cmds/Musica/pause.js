const musicData = require("./requirements/musicData")
module.exports = {
    name: 'pause',
    category: "Musica",
    description: 'Este comando pausa la canción que se este escuchando',
    usage: '!pause',
    run: async (client, message, args) => {

        let voicechannel = message.member.voice.channel

        if (message.author.id === "1225644162196701245") {
            voicechannel = client.channels.cache.get(process.env.MC_VOICE);
        }

        if (!musicData.server[message.guild.id]) return message.channel.send({ content: "No se esta escuchando ninguna canción" })
        if (!voicechannel) return message.channel.send({ content: "Debes estar en un canal de voz para usar este comando" })
        if (!message.guild.members.me.voice.channel) return message.channel.send({ content: "No estoy en un canal de voz" })
        if (message.guild.members.me.voice.channel.id !== voicechannel.id) return message.channel.send({ content: "Debes estar conectado a mi canal de voz para usar este comando" })
        if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send({ content: "No se esta escuchando ninguna canción" })
        if (musicData.server[message.guild.id].pause == true) return message.channel.send({ content: "Ya están pausadas las canciones" })

        musicData.server[message.guild.id].pause = true
        try {
            musicData.server[message.guild.id].songDispatcher.pause()
        } catch (err) {
            console.error(err)
            return message.channel.send({ content: "A ocurrido un error al pausar la canción" })
        }
        message.channel.send({ content: "Se ha pausado la canción" })
    }
}