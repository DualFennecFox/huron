const musicData = require("./requirements/musicData")
const Discord = require('discord.js')
module.exports = {
    name : 'queue',
    category: "Musica",
    description : 'Este comando te muestra las canciones que esten en la cola del server',
    usage: '!queue',
    run: async(client, message, args) => {   

                if (!musicData.server[message.guild.id]) return message.channel.send("No se esta escuchando ninguna canción")
                if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                if (!message.guild.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
                if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
                if (musicData.server[message.guild.id].queue.length < 1) return message.channel.send("No hay ninguna canción en la cola")
                
                let Songs = []
                let num = musicData.server[message.guild.id].queue.length

                if (musicData.server[message.guild.id].queue.length >= 15) {
                  num = 15
                }

                const embed = new Discord.MessageEmbed()
                for (let v = 0; v < num; v++) {
                   Songs.push(`${v + 1}: ${musicData.server[message.guild.id].queue[v].title}`);
                }      
              const SongsMapped = Songs.join("\n\n")
   
              message.channel.send({ embeds: [embed.setDescription(SongsMapped)] })         
    }
} 