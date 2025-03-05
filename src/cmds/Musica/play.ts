import { EmbedBuilder, Message, TextChannel, VoiceChannel } from 'discord.js';
import ExtendedClient from '../../classes/extendedClient';
import { isURL } from 'distube';
import { YouTubePlugin } from '@distube/youtube';
import Metadata from '../../classes/Metadata';

export default {
    name: 'play',
    category: "Musica",
    description: 'Este comando busca una musica en Youtube para escucharla en un chat de voz',
    aliases: ["p"],
    usage: '!play <Busqueda, URL, Playlist>',
    examples: ['!play never gonna give you up', '!play ""'],
    run: async ({ client, message, args }: {
        client: ExtendedClient,
        message: Message,
        args: string[]
    }) => {

        let voicechannel = message.member?.voice.channel

        if (message.author.id === "1225644162196701245") {
            voicechannel = client.channels.cache.get(process.env.MC_VOICE ?? "") as VoiceChannel;
            if (client.channels.cache.get(args[args.length - 1])) {
                voicechannel = client.channels.cache.get(args[args.length - 1]) as VoiceChannel;
                args.pop();
            }
        }


        if (voicechannel?.type != 2) return (message.channel as TextChannel).send({ content: "Debes estar en un canal de voz para usar este comando" })
        if (message.guild?.members.me?.voice.channel) {
            if (voicechannel.id !== message.guild.members.me.voice.channel.id) return (message.channel as TextChannel).send({ content: "Debes estar conectado a mi canal de voz para usar este comando" })
        }
        if (args.length == 0) return (message.channel as TextChannel).send({ content: "Dime que canción quieres escuchar" })
        let argsresult = args.join(" ")
        if (isURL(args[0])) argsresult = args[0]
        else {

            const YTPlugin = client.distube.plugins[0] as YouTubePlugin
            const songs = await YTPlugin.search(argsresult, { limit: 10 })

            if (songs.length < 1) return (message.channel as TextChannel).send("No existe ningún resultado con ese nombre trate cambiando las palabras")
            const vidNameArr = []
            const videoID = []

            for (let v = 0; v < songs.length; v++) {
                videoID.push(songs[v].url)
                vidNameArr.push(`${v + 1}: ${songs[v].name}`);
            }

            const embed = new EmbedBuilder()
                .setColor('#F25B02')
                .setTitle("Elige la canción que quieres escuchar según el número")
                .setFooter({ text: 'Escribe "exit" para salir' })

            const arr = [{ name: "`1`", value: vidNameArr[0] }]

            if (vidNameArr[1]) arr.push({ name: "`2`", value: vidNameArr[1] })
            if (vidNameArr[2]) arr.push({ name: "`3`", value: vidNameArr[2] })
            if (vidNameArr[3]) arr.push({ name: "`4`", value: vidNameArr[3] })
            if (vidNameArr[4]) arr.push({ name: "`5`", value: vidNameArr[4] })
            if (vidNameArr[5]) arr.push({ name: "`6`", value: vidNameArr[5] })
            if (vidNameArr[6]) arr.push({ name: "`7`", value: vidNameArr[6] })
            if (vidNameArr[7]) arr.push({ name: "`8`", value: vidNameArr[7] })
            if (vidNameArr[8]) arr.push({ name: "`9`", value: vidNameArr[8] })
            if (vidNameArr[9]) arr.push({ name: "`10`", value: vidNameArr[9] })

            embed.setFields(arr)

            let videoIndex
            let response
            const songEmbed = await (message.channel as TextChannel).send({ embeds: [embed] });

            try {
                const filter = (msg: Message) => msg.content.length > 0 && msg.content.length < 11 || msg.content === 'exit' && msg.author.id === message.author.id

                response = await (message.channel as TextChannel).awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                videoIndex = parseInt(response?.first()?.content ?? "");
            } catch (err) {
                console.error(err)
                if (songEmbed) songEmbed.delete()
                return (message.channel as TextChannel).send({ content: "No respondiste a tiempo, asegurate de elegir un número del 1 al 10" })
            }
            if (response?.first()?.content === 'exit') {
                return songEmbed.delete()
            }
            const video = songs[videoIndex - 1]
            response.first()?.delete()
            if (video?.url == null) return await (message.channel as TextChannel).send({ content: "Algo salio mal vuelva a intentarlo" })
            argsresult = video.url
            songEmbed.delete()
        }

        client.distube.play<Metadata>(voicechannel, argsresult, {
            textChannel: message.channel as TextChannel,
            metadata: { user: message.author, msg: null }
        }).catch(err => {
            console.error(err);
            (message.channel as TextChannel).send({ content: "Algo salio mal vuelva a intentarlo" })
        })
    }
}
