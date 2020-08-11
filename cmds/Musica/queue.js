const musicData = require("./requirements/musicData")
const Discord = require('discord.js')
module.exports = {
    name : 'queue',
    category: "Musica",
    aliases: ['Queue', 'QUEUE'],
    description : 'Este comando te muestra las canciones que esten en la cola del server',
    usage: '!queue',
    examples: ['!queue'],
    run: async(client, message, args) => {   

                if (!musicData.server[message.guild.id]) return message.channel.send("No se esta escuchando ninguna canción")
                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
                if (musicData.server[message.guild.id].queue.length < 1) return message.channel.send("No hay ninguna canción en la cola")
                
                let Songs = musicData.server[message.guild.id].queue.map(q => q.title).join("\n\n");      
                message.channel.send(embed.setDescription(Songs))         
    }
} 