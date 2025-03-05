import { Message, TextChannel, VoiceChannel } from "discord.js";
import ExtendedClient from "../../classes/extendedClient";

export default {
    name: 'leave',
    category: "Musica",
    description: 'Este comando saca al bot del canal de voz del usuario si es que esta',
    aliases: ["stop", "disconnect"],
    usage: '!leave',
    run: async ({ client, message }: {
        client: ExtendedClient,
        message: Message
    }) => {

        let voicechannel = message.member?.voice.channel

        if (message.author.id === "1225644162196701245") {
            voicechannel = client.channels.cache.get(process.env.MC_VOICE ?? "") as VoiceChannel;
        }
        const queue = client.distube.getQueue(message.guildId ?? "")
        if (!voicechannel) return (message.channel as TextChannel).send("Debes estar en un canal de voz para usar este comando")
        if (!message.guild?.members.me?.voice.channel) return (message.channel as TextChannel).send("No estoy en un canal de voz")
        if (message.guild.members.me.voice.channel.id !== voicechannel.id) return (message.channel as TextChannel).send("Debes estar conectado a mi canal de voz para usar este comando")
        if (queue) queue.stop();
        client.distube.voices.get(message.guildId ?? "")?.connection.destroy()
    }
}
