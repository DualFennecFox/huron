const { EmbedBuilder } = require('discord.js');
const musicData = require("./requirements/musicData");
const { playSong } = require('./requirements/functions')
const getVideoId = require('get-video-id');
const { spawnSync, spawn } = require('child_process');

const sendCallback = (data, message, voicechannel) => {
    if (data.length == 1) {
        data = data[0]
        const url = data.url
        const download = data.download_url
        const title = data.name.replace("@", "@\u200b")
        const duration = data.duration
        const thumbnail = data.cover_url
        const channel = data.artist
        const channelURL = null
        const voiceChannel = voicechannel
        const provider = "Spotify"

        const song = {
            url,
            download,
            title,
            duration,
            thumbnail,
            channel,
            channelURL,
            voiceChannel,
            provider
        };
        musicData.server[message.guild.id].queue.push(song);
        if (
            !musicData.server[message.guild.id].isPlaying
        ) {
            musicData.server[message.guild.id].isPlaying = musicData.server[message.guild.id].queue[0];
            return playSong(musicData.server[message.guild.id].queue, message);
        } else if (musicData.server[message.guild.id].isPlaying) {
            musicData.server[message.guild.id].loop = false
            return message.channel.send({ content: `**${song.title}** Se ha añadido a la cola` })
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            musicData.server[message.guild.id].queue.push({
                url: data[i].url,
                download: data[i].download_url,
                title: data[i].name.replace("@", "@\u200b"),
                duration: data[i].duration,
                thumbnail: data[i].cover_url,
                channel: data[i].artist,
                channelURL: null,
                voiceChannel: voicechannel,
                provider: "Spotify"
            });
        }

        if (!musicData.server[message.guild.id].isPlaying) {
            musicData.server[message.guild.id].isPlaying = data[0];
            message.channel.send({ content: `Se han añadido a la cola **${data.length}** canciones` })
            return playSong(musicData.server[message.guild.id].queue, message);
        } else if (musicData.server[message.guild.id].isPlaying) {
            musicData.server[message.guild.id].loop = false
            return message.channel.send({ content: `**${data[0].list_name}** Se ha añadido a la cola con ${data.length} videos` })
        };
    }
}

module.exports = {
    name: 'splay',
    category: "Musica",
    description: 'Este comando busca una musica en Spotify para escucharla en un chat de voz',
    aliases: ["sp"],
    usage: '!splay <Busqueda, URL, Playlist>',
    examples: ['!splay never gonna give you up', '!splay ""'],
    run: async (client, message, args) => {

        let voicechannel = message.member.voice.channel

        if (message.author.id === "1225644162196701245") {
            voicechannel = client.channels.cache.get(process.env.MC_VOICE);
            if (client.channels.cache.get(args[args.length - 1])) {
                voicechannel = client.channels.cache.get(args[args.length - 1]);
                args.pop();
            }
        }


        if (voicechannel?.type != 2) return message.channel.send({ content: "Debes estar en un canal de voz para usar este comando" })
        if (message.guild.members.me.voice.channel) {
            if (voicechannel.id !== message.guild.members.me.voice.channel.id) return message.channel.send({ content: "Debes estar conectado a mi canal de voz para usar este comando" })
        }
        if (!args.length >= 1) return message.channel.send({ content: "Dime que canción quieres escuchar" })
        if (!musicData.server[message.guild.id]) musicData.server[message.guild.id] = {
            queue: [],
            loop: false,
            isPlaying: false,
            looped: [],
            songDispatcher: null,
            pause: false,
            awaiting: false,
            lastEmbed: null
        }
        if (!message.guild.members.me.voice.channel) {
            musicData.server[message.guild.id].queue.length = 0
            musicData.server[message.guild.id].songDispatcher = null
            musicData.server[message.guild.id].isPlaying = false
            musicData.server[message.guild.id].loop = false
            musicData.server[message.guild.id].looped.length = 0
            musicData.server[message.guild.id].lastEmbed = null
        }

        if (args[0].match(/(https?:\/\/open.spotify.com\/)/)) {

            try {
                const spotdl = spawn("python", ["-m", "spotdl", "save", args[0], "--save-file", "-", "--log-level", "NOTSET", "--preload"])
                let spotOutput = []
                spotdl.stdout.on("data", data => {
                    if (data.toString().startsWith("[")) {
                        spotOutput = JSON.parse(data.toString())
                    }
                })
                spotdl.stderr.on("data", data => {
                    console.log("stderr: " + data)
                })

                spotdl.on("close", () => { sendCallback(spotOutput, message, voicechannel) })

                return

                let ID = getVideoId(args[0]).id
                YT.search(ID, { type: "video", limit: 1 }).then(async (videos) => {

                    let video = videos.items[0]
                    const url = `https://www.youtube.com/watch?v=${video.id}`
                    const title = video.title.replace("@", "@\u200b")
                    const duration = video.duration
                    const thumbnail = video.thumbnails.best;
                    const channel = video.channel.name
                    const channelURL = video.channel.url
                    if (duration == '0') duration = 'Transmitiendo en Vivo';
                    const voiceChannel = voicechannel
                    const provider = "Youtube"

                    const song = {
                        url,
                        title,
                        duration,
                        thumbnail,
                        channel,
                        channelURL,
                        voiceChannel,
                        provider
                    };
                    musicData.server[message.guild.id].queue.push(song);
                    if (
                        !musicData.server[message.guild.id].isPlaying
                    ) {
                        musicData.server[message.guild.id].isPlaying = musicData.server[message.guild.id].queue[0];
                        return playSong(musicData.server[message.guild.id].queue, message);
                    } else if (musicData.server[message.guild.id].isPlaying) {
                        musicData.server[message.guild.id].loop = false
                        return message.channel.send({ content: `**${song.title}** Se ha añadido a la cola` })
                    }
                }).catch(err => {
                    console.error(err)
                })
            } catch (err) {
                console.error(err)
                message.channel.send({ content: "Algo salio mal vuelva a intentarlo" })
            }
        } else {

            try {
                let argsresult = args.join(" ")

                const spotdl = spawn("python", ["-m", "spotdl", "save", argsresult, "--save-file", "-", "--log-level", "NOTSET", "--preload"])
                let spotOutput = []
                spotdl.stdout.on("data", data => {
                    if (data.toString().startsWith("[")) {
                        spotOutput = JSON.parse(data.toString())
                    }
                })
                spotdl.stderr.on("data", data => {
                    console.log("stderr: " + data)
                })

                spotdl.on("close", () => { sendCallback(spotOutput, message, voicechannel) })

                return

                YT.search(argsresult, { type: "video", limit: 10 }).then(async (videos) => {

                    if (musicData.server[message.guild.id].awaiting == true) return message.channel.send({ content: "Ya se está esperando la respuesta" })
                    if (videos.items.length < 1) return message.channel.send({ content: "No existe ningún resultado con ese nombre trate cambiando las palabras" })
                    const vidNameArr = []
                    const videoID = []
                    var video

                    for (let v = 0; v < videos.items.length; v++) {
                        videoID.push(`https://www.youtube.com/watch?v=${videos.items[v].id}`)
                        vidNameArr.push(`${v + 1}: ${videos.items[v].title}`);
                    }


                    if (message.author.id == "1225644162196701245") {
                        video = videos.items[0]
                    } else {

                        const embed = new EmbedBuilder()
                            .setColor('#FF0000')
                            .setTitle("Elige la canción que quieres escuchar según el número")
                            .setFooter({ text: 'Escribe "exit" para salir' })

                        let arr = [{ name: "\`1\`", value: vidNameArr[0] }]

                        if (vidNameArr[1]) arr.push({ name: "\`2\`", value: vidNameArr[1] })
                        if (vidNameArr[2]) arr.push({ name: "\`3\`", value: vidNameArr[2] })
                        if (vidNameArr[3]) arr.push({ name: "\`4\`", value: vidNameArr[3] })
                        if (vidNameArr[4]) arr.push({ name: "\`5\`", value: vidNameArr[4] })
                        if (vidNameArr[5]) arr.push({ name: "\`6\`", value: vidNameArr[5] })
                        if (vidNameArr[6]) arr.push({ name: "\`7\`", value: vidNameArr[6] })
                        if (vidNameArr[7]) arr.push({ name: "\`8\`", value: vidNameArr[7] })
                        if (vidNameArr[8]) arr.push({ name: "\`9\`", value: vidNameArr[8] })
                        if (vidNameArr[9]) arr.push({ name: "\`10\`", value: vidNameArr[9] })

                        embed.setFields(arr)

                        var songEmbed = await message.channel.send({ embeds: [embed] });
                        musicData.server[message.guild.id].awaiting = true
                        try {
                            const filter = msg => msg.content > 0 && msg.content < 11 || msg.content === 'exit' && msg.author.id === message.author.id

                            var response = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                            if (response.first().content) musicData.server[message.guild.id].awaiting = false
                            var videoIndex = parseInt(response.first().content);
                        } catch (err) {
                            console.error(err)
                            musicData.server[message.guild.id].awaiting = false
                            if (songEmbed) songEmbed.delete()
                            return message.channel.send({ content: "No respondiste a tiempo, asegurate de elegir un número del 1 al 10" })
                        }
                        if (response.first().content === 'exit') {
                            musicData.server[message.guild.id].awaiting = false
                            return songEmbed.delete()
                        }
                        try {
                            video = videos.items[videoIndex - 1]
                            response.first().delete()
                        } catch (err) {
                            console.error(err)
                            if (songEmbed) songEmbed.delete()
                            return message.channel.send({ content: "Hubo un error al obtener el video de Youtube" })
                        }
                    }

                    const url = `https://www.youtube.com/watch?v=${video.id}`;
                    const title = video.title.replace("@", "@\u200b")
                    let duration = video.duration;
                    const thumbnail = video.thumbnails.best;
                    const channel = video.channel.name;
                    const channelURL = video.channel.url
                    if (duration == '0') duration = 'Transmitiendo en Vivo';
                    const voiceChannel = voicechannel
                    const provider = "Youtube"

                    const song = {
                        url,
                        title,
                        duration,
                        thumbnail,
                        channel,
                        channelURL,
                        voiceChannel,
                        provider
                    };

                    musicData.server[message.guild.id].queue.push(song);

                    if (!musicData.server[message.guild.id].isPlaying) {
                        musicData.server[message.guild.id].isPlaying = musicData.server[message.guild.id].queue[0]
                        if (songEmbed) songEmbed.delete();
                        return playSong(musicData.server[message.guild.id].queue, message);
                    } else {
                        if (songEmbed) songEmbed.delete();
                        musicData.server[message.guild.id].loop = false

                        return message.channel.send({ content: `**${song.title}** Se ha añadido a la cola` });
                    }
                }).catch(err => {
                    console.error(err)
                })

            } catch (err) {
                console.error(err)
                /*
                musicData.server[message.guild.id].awaiting = false
                if (songEmbed) songEmbed.delete()
                musicData.server[message.guild.id].loop = false
                return message.channel.send({ content: "Hubo un error al buscar el video en Youtube" })
                */
            }
        }
    }
}
