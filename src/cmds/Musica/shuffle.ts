import { Message, TextChannel, VoiceChannel } from "discord.js";
import ExtendedClient from "../../classes/extendedClient";

export default {
    name: 'shuffle',
    category: "Musica",
    description: 'Este comando mueve la cola de canciones de manera aleatoria, puedes notarlo con !queue',
    usage: '!shuffle',
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
            
        queue.shuffle()
        await (message.channel as TextChannel).send("Se ha barajeado la cola")
    }
}
