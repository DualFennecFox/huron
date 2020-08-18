const musicData = require('./requirements/musicData')
module.exports = {
    name : 'leave',
    category: "Musica",
    aliases: ['disconnect'],
    description : 'Este comando saca al bot del canal de voz del usuario si es que esta',
    usage: '!leave',
    run: async(client, message, args) => {

        if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
        if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
        if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
        if (!musicData.server[message.guild.id]) {
            message.guild.me.voice.channel.leave()
            return message.channel.send("Dejando el canal de voz")
        }

    musicData.server[message.guild.id].queue.length = 0
    musicData.server[message.guild.id].isPlaying = false
    musicData.server[message.guild.id].pause = false
    musicData.server[message.guild.id].loop = false
    musicData.server[message.guild.id].awaiting = false
    musicData.server[message.guild.id].looped.length = 0
    musicData.server[message.guild.id].songDispatcher = null
    message.guild.me.voice.channel.leave()
    message.channel.send("Dejando el canal de voz")
    }
}