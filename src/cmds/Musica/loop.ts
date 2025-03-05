import { Message, TextChannel, VoiceChannel } from "discord.js";
import ExtendedClient from "../../classes/extendedClient";

export default {
    name: 'loop',
    category: "Musica",
    description: 'Este comando hace que se escuche una canción indefinidamente hasta que se desactive',
    usage: '!loop',
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
            
        if (queue.repeatMode == 1) { queue.setRepeatMode(0); return (message.channel as TextChannel).send("Se ha desactivado el bucle") }
        queue.setRepeatMode(1); return (message.channel as TextChannel).send("Se ha activado el bucle")
    }
}