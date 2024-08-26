const musicData = require('./requirements/musicData')

module.exports = {
    name: 'shuffle',
    category: "Musica",
    description: 'Este comando mueve la cola de canciones de manera aleatoria, puedes notarlo con !queue',
    usage: '!shuffle',
    run: async (client, message, args, prefix) => {

        let voicechannel = message.member.voice.channel

        if (message.author.id === "1225644162196701245") {
            voicechannel = client.channels.cache.get(process.env.MC_VOICE);
        }

        if (!musicData.server[message.guild.id]) return message.channel.send("No se esta escuchando ninguna canción")
        if (!voicechannel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
        if (!message.guild.members.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
        if (message.guild.members.me.voice.channel.id !== voicechannel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
        if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
        

        const msg = await message.channel.send("Barajeando la cola...")

        for (let i = musicData.server[message.guild.id].queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [musicData.server[message.guild.id].queue[i], musicData.server[message.guild.id].queue[j]] = [musicData.server[message.guild.id].queue[j], musicData.server[message.guild.id].queue[i]];
        }
        msg.delete()
        message.channel.send(`Se ha movido la cola, puedes verla con ${prefix}queue`)
    
    }
}