const musicData = require("./requirements/musicData")
module.exports = {
    name: 'resume',
    category: "Musica",
    aliases: ['continue'],
    description: 'Este comando continua la canción que se haya pausado',
    usage: '!resume',
    run: async (client, message, args) => {

        let voicechannel = message.member.voice.channel

        if (message.author.id === "1225644162196701245") {
            voicechannel = client.channels.cache.get("739961041051582464");
        }

        if (!musicData.server[message.guild.id]) return message.channel.send("No se esta escuchando ninguna canción")
        if (!voicechannel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
        if (!message.guild.members.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
        if (message.guild.members.me.voice.channel.id !== voicechannel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
        if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
        if (musicData.server[message.guild.id].pause == false) return message.channel.send("Ya están reanudadas las canciones")


        musicData.server[message.guild.id].pause = false
        musicData.server[message.guild.id].unPaused = true
        try {
            musicData.server[message.guild.id].songDispatcher.unpause()
        } catch (err) {
            console.error(err)
            return message.channel.send("Hubo un error al reanudar la canción")
        }
        message.channel.send("Se ha reanudado la canción")
    }
}
