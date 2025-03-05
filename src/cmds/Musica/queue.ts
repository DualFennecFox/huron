import { EmbedBuilder, Message, TextChannel, VoiceChannel } from 'discord.js';
import ExtendedClient from '../../classes/extendedClient';
export default {
  name: 'queue',
  category: "Musica",
  description: 'Este comando te muestra las canciones que esten en la cola del server',
  usage: '!queue',
  run: async ({ client, message }: {
    client: ExtendedClient,
    message: Message
  }) => {

    let voicechannel = message.member?.voice.channel

    if (message.author.id === "1225644162196701245") {
      voicechannel = client.channels.cache.get(process.env.MC_VOICE ?? "") as VoiceChannel;
    }
    const queue = client.distube.getQueue(message.guildId ?? "")
    if (!queue) return (message.channel as TextChannel).send("No se esta escuchando ninguna canción")
    if (!voicechannel) return (message.channel as TextChannel).send("Debes estar en un canal de voz para usar este comando")
    if (!message.guild?.members.me?.voice.channel) return (message.channel as TextChannel).send("No estoy en un canal de voz")
    if (message.guild.members.me.voice.channel.id !== voicechannel.id) return (message.channel as TextChannel).send("Debes estar conectado a mi canal de voz para usar este comando")
    if (queue.songs.length < 2) return (message.channel as TextChannel).send("No hay ninguna otra canción en la cola")

    const num = queue.songs.length >= 15 ? 15 : queue.songs.length
    const Songs = []
    const embed = new EmbedBuilder()
    for (let v = 1; v < num; v++) {
      Songs.push(`${v + 1}: ${queue.songs[v].name}`);
    }
    const SongsMapped = Songs.join("\n\n")

    await (message.channel as TextChannel).send({ embeds: [embed.setDescription(`**Escuchando: ${queue.songs[0].name}**\n\n${SongsMapped}`)] })
  }
} 