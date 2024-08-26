const musicData = require("./requirements/musicData")
const { EmbedBuilder } = require('discord.js')
module.exports = {
  name: 'queue',
  category: "Musica",
  description: 'Este comando te muestra las canciones que esten en la cola del server',
  usage: '!queue',
  run: async (client, message, args) => {

    let voicechannel = message.member.voice.channel

    if (message.author.id === "1225644162196701245") {
      voicechannel = client.channels.cache.get(process.env.MC_VOICE);
    }

    if (!musicData.server[message.guild.id]) return message.channel.send("No se esta escuchando ninguna canción")
    if (!voicechannel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
    if (!message.guild.members.me.voice.channel) return message.channel.send("No estoy en un canal de voz")
    if (message.guild.members.me.voice.channel.id !== voicechannel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
    if (musicData.server[message.guild.id].isPlaying == false) return message.channel.send("No se esta escuchando ninguna canción")
    if (musicData.server[message.guild.id].queue.length < 1) return message.channel.send("No hay ninguna canción en la cola")

    let Songs = []
    let num = musicData.server[message.guild.id].queue.length

    if (musicData.server[message.guild.id].queue.length >= 15) {
      num = 15
    }

    if (args[1]) {
      let start = parseInt(args[0])
      let end = parseInt(args[1])
    }

    const embed = new EmbedBuilder()
    for (let v = 0; v < num; v++) {
      Songs.push(`${v + 1}: ${musicData.server[message.guild.id].queue[v].title}`);
    }
    const SongsMapped = Songs.join("\n\n")

    message.channel.send({ embeds: [embed.setDescription(`**Escuchando: ${musicData.server[message.guild.id].isPlaying.title}**\n\n${SongsMapped}`)] })
  }
} 