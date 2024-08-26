const musicData = require('./requirements/musicData')
const { getVoiceConnection } = require("@discordjs/voice")

module.exports = {
    name : 'leave',
    category: "Musica",
    aliases: ['disconnect'],
    description : 'Este comando saca al bot del canal de voz del usuario si es que esta',
    usage: '!leave',
    run: async(client, message, args) => {

        let voicechannel = message.member.voice.channel

        if (message.author.id === "1225644162196701245") {
            voicechannel = client.channels.cache.get(process.env.MC_VOICE);
        }

        if (voicechannel?.type != 2) return message.channel.send({ content: "Debes estar en un canal de voz para usar este comando" })
        if (message.guild.members.me.voice.channel?.type != 2) return message.channel.send({ content: "No estoy en un canal de voz" })
        if (message.guild.members.me.voice.channel.id !== voicechannel.id) return message.channel.send({ content: "Debes estar conectado a mi canal de voz para usar este comando" })
        if (!musicData.server[message.guild.id]) {
            message.guild.members.me.voice.channel.leave()
            return message.channel.send({ content: "Dejando el canal de voz" })
        }
    
    let connection = getVoiceConnection(message.guild.id)

    if (connection) connection?.disconnect()
    musicData.server[message.guild.id].queue.length = 0
    musicData.server[message.guild.id].isPlaying = false
    musicData.server[message.guild.id].pause = false
    musicData.server[message.guild.id].loop = false
    musicData.server[message.guild.id].awaiting = false
    musicData.server[message.guild.id].looped.length = 0
    connection.destroy()
    musicData.server[message.guild.id].songDispatcher = null
    message.channel.send({ content: "Dejando el canal de voz" })
    }
}
