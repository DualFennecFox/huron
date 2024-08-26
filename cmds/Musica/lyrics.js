const { EmbedBuilder } = require('discord.js');
const musicData = require('./requirements/musicData')
const Genius = require("genius-lyrics");

module.exports = {
    name: 'lyrics',
    category: "Musica",
    description: 'Este comando mueve la cola de canciones de manera aleatoria, puedes notarlo con !queue',
    usage: '!lyrics',
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
        if (musicData.server[message.guild.id].isPlaying.provider !== "SoundCloud") return message.channel.send("Solo puedes usar este comando con el servicio de SoundCloud")

        const Client = new Genius.Client();
        const song = musicData.server[message.guild.id].isPlaying

        const searches = await Client.songs.search(song.title);

        try {

        // Pick first one
        const firstSong = searches[0];

        // Ok lets get the lyrics
        const lyrics = await firstSong.lyrics();

        const embed = new EmbedBuilder().setColor("#FF0000")
        message.channel.send({ embeds: [embed.setDescription(lyrics)] })

        } catch (err) {
            return message.channel.send("No se ha podido encontrar las letras de esa cancion")
        }
    }
}