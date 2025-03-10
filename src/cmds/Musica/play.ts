import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, TextChannel, VoiceChannel } from 'discord.js';
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
        const argsresult = args.join(" ")
        if (isURL(args[0])) {
            return client.distube.play<Metadata>(voicechannel, args[0], {
                textChannel: message.channel as TextChannel,
                metadata: { user: message.author, msg: null }
            }).catch(err => {
                console.error(err);
                return (message.channel as TextChannel).send({ content: "Algo salio mal vuelva a intentarlo" })
            })
        } else {

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
            const arr = []
            const frow: ButtonBuilder[] = []
            const srow: ButtonBuilder[] = []
            for (let i = 0; i < vidNameArr.length; i++) {
                if (vidNameArr[i]) arr.push({ name: `\`${i + 1}\``, value: vidNameArr[i] })
                if (i < 5) frow.push(new ButtonBuilder().setCustomId(videoID[i] ?? i.toString()).setLabel(`${i + 1}`).setStyle(ButtonStyle.Secondary))
                else srow.push(new ButtonBuilder().setCustomId(videoID[i] ?? i.toString()).setLabel(`${i + 1}`).setStyle(ButtonStyle.Secondary))
            }

            embed.setFields(arr)
            const faction = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(frow).toJSON()

            const saction = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(srow).toJSON()

            await (message.channel as TextChannel).send({ embeds: [embed], components: [faction, saction] });

        }
    }
}
