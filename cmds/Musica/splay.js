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
            message.channel.send({ content: `**${data[0].list_name}** Se ha añadido a la cola con ${data.length} canciones` })
            return playSong(musicData.server[message.guild.id].queue, message);
        } else if (musicData.server[message.guild.id].isPlaying) {
            musicData.server[message.guild.id].loop = false
            return message.channel.send({ content: `**${data[0].list_name}** Se ha añadido a la cola con ${data.length} canciones` })
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
                const spotdl = spawn("./spotdl", ["save", args[0], "--save-file", "-", "--log-level", "NOTSET", "--preload"])
                let spotOutput = []
                let msg = await message.channel.send({ content: "Buscando sus canciones en Spotify..." })
                spotdl.stdout.on("data", data => {
                    if (data.toString().startsWith("[")) {
                        spotOutput = JSON.parse(data.toString())
                        if (msg) msg.delete()
                        sendCallback(spotOutput, message, voicechannel)
                    }
                })
                spotdl.stderr.on("data", data => {
                    console.log("stderr: " + data)
                    message.channel.send({ content: "Hubo un error al buscar sus canciones" })
                })

            } catch (err) {
                console.error(err)
                message.channel.send({ content: "Algo salio mal vuelva a intentarlo" })
            }
        } else {

            try {
                let argsresult = args.join(" ")

                const spotdl = spawn("./spotdl", ["save", argsresult, "--save-file", "-", "--log-level", "NOTSET", "--preload"])
                let spotOutput = []
                let msg = message.channel.send({ content: "Buscando sus canciones en Spotify..." })
                spotdl.stdout.on("data", data => {
                    if (data.toString().startsWith("[")) {
                        spotOutput = JSON.parse(data.toString())
                        if (msg) msg.delete()
                        sendCallback(spotOutput, message, voicechannel)
                    }
                })
                spotdl.stderr.on("data", data => {
                    console.log("stderr: " + data)
                    if (msg) msg.delete()
                    message.channel.send({ content: "Hubo un error al buscar sus canciones" })
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
