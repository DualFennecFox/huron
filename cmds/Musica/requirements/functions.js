const { EmbedBuilder } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, getVoiceConnection, VoiceConnectionStatus, entersState } = require('@discordjs/voice')
const Scl = require('soundcloud-scraper')
const SC = new Scl.Client()
const musicData = require('./musicData')
const ytdl = require('youtube-dl-exec')

function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

async function playSong(queue, message) {
    if (!musicData.server[message.guild.id]) {

        musicData.server[message.guild.id] = {
            queue: [],
            loop: false,
            isPlaying: false,
            looped: [],
            songDispatcher: null,
            pause: false,
            unPaused: false,
            awaiting: false,
            lastEmbed: null
        }
    }

    let shouldsend = true;
    let voicechannel = message.member.voice.channelId;

    if (message.author.id === "1225644162196701245") {
        voicechannel = process.env.MC_VOICE;
    }

    const connection = joinVoiceChannel({ channelId: voicechannel, guildId: message.guild.id, adapterCreator: message.guild.voiceAdapterCreator })
    const player = createAudioPlayer()
    musicData.server[message.guild.id].songDispatcher = player

    if (queue[0].provider === "Youtube" || musicData.server[message.guild.id].looped[0]) {

        const stream = ytdl.exec(queue[0].url, { format: "bestaudio", output: "-", cookies: "cookies.txt" });
        const voice = createAudioResource(stream.stdout, { inputType: StreamType.Arbitrary });

        musicData.server[message.guild.id].songDispatcher.play(voice)

        const subscription = connection.subscribe(musicData.server[message.guild.id].songDispatcher)

        musicData.server[message.guild.id].songDispatcher.on(AudioPlayerStatus.Playing, async () => {

            musicData.server[message.guild.id].pause = false

            if (musicData.server[message.guild.id].unPaused == true) {
                musicData.server[message.guild.id].unPaused = false
            }

            if (queue[0]?.title) {
                if (musicData.server[message.guild.id].loop == false) {
                    if (musicData.server[message.guild.id].lastEmbed) musicData.server[message.guild.id].lastEmbed.delete();


                    const videoEmbed = new EmbedBuilder()
                        .setAuthor({ name: "Música", iconURL: message.author.displayAvatarURL({ size: 2048 }) })
                        .setThumbnail(queue[0]?.thumbnail)
                        .setColor('#FF0000')
                        .setFields([
                            {
                                name: "Escuchando",
                                value: `[${queue[0].title}](${queue[0].url})`
                            },
                            {
                                name: "Duración",
                                value: `${fmtMSS(queue[0].duration)}`
                            },
                            {
                                name: "Canal",
                                value: `[${queue[0].channel}](${queue[0].channelURL})`
                            }
                        ])

                    let url = queue[0].url
                    const loopURL = {
                        url
                    };
                    musicData.server[message.guild.id].looped.push(loopURL)

                    if (queue[1]) videoEmbed.addFields([{ name: 'Siguiente Canción', value: `[${queue[1].title}](${queue[1].url})` }]);
                    let embed = await message.channel.send({ embeds: [videoEmbed] })
                    musicData.server[message.guild.id].isPlaying = queue[0]
                    musicData.server[message.guild.id].queue.shift();
                    musicData.server[message.guild.id].lastEmbed = embed
                }
            }
        })
            .on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                    // Seems to be reconnecting to a new channel - ignore disconnect
                    shouldsend = false;
                } catch (error) {
                    // Seems to be a real disconnect which SHOULDN'T be recovered from
                    connection.destroy();
                }
            })
            .on(AudioPlayerStatus.Idle, async () => {

                if (musicData.server[message.guild.id].unPaused == true) return
                if (musicData.server[message.guild.id].loop == true) {
                    playSong(musicData.server[message.guild.id].looped, message)

                } else if (musicData.server[message.guild.id].queue.length >= 1) {
                    musicData.server[message.guild.id].looped.shift();

                    playSong(musicData.server[message.guild.id].queue, message)
                } else {
                    musicData.server[message.guild.id].isPlaying = false

                    musicData.server[message.guild.id].looped.length = 0
                    message.channel.send({ content: "Se han terminado todas las canciones" })

                    if (musicData.server[message.guild.id].pause == false && !musicData.server[message.guild.id].isPlaying) {

                        subscription.unsubscribe()
                        setTimeout(() => {
                            if (musicData.server[message.guild.id].pause == false && !musicData.server[message.guild.id].isPlaying) {
                                getVoiceConnection(message.guild.id)?.destroy()
                            }
                        }, 60000)
                    }
                }
            })
            .on('error', async e => {
                message.channel.send({ content: 'No se puede escuchar esa canción' });
                musicData.server[message.guild.id].queue.length = 0;
                musicData.server[message.guild.id].isPlaying = false;
                musicData.server[message.guild.id].pause = false
                musicData.server[message.guild.id].loop = false
                musicData.server[message.guild.id].looped.length = 0
                musicData.server[message.guild.id].songDispatcher = null
                musicData.server[message.guild.id].lastEmbed = null
                console.error(e);
                return connection.destroy()
            })
    }
    else if (queue[0].provider === "SoundCloud" || musicData.server[message.guild.id].looped[0]) {

        let song = await queue[0].SC.getSongInfo(queue[0].url)
        let stream = await song.downloadProgressive()
        let voice = createAudioResource(stream)

        musicData.server[message.guild.id].songDispatcher.play(voice)

        connection.subscribe(musicData.server[message.guild.id].songDispatcher)

        musicData.server[message.guild.id].songDispatcher.on(AudioPlayerStatus.Playing, async () => {

            musicData.server[message.guild.id].pause = false

            if (musicData.server[message.guild.id].unPaused == true) {
                musicData.server[message.guild.id].unPaused = false

            } else if (musicData.server[message.guild.id].loop == false) {
                if (musicData.server[message.guild.id].lastEmbed) musicData.server[message.guild.id].lastEmbed.delete();

                const videoEmbed = new EmbedBuilder()
                    .setAuthor({ name: "Música", iconURL: message.author.displayAvatarURL({ size: 2048, type: "png", dynamic: true }) })
                    .setThumbnail(queue[0]?.thumbnail)
                    .setColor('#F25B02')
                    .setFields([
                        {
                            name: "Escuchando",
                            value: `[${queue[0].title}](${queue[0].url})`
                        },
                        {
                            name: "Duración",
                            value: `${millisToMinutesAndSeconds(queue[0].duration)}`
                        },
                        {
                            name: "Canal",
                            value: `[${queue[0].channel}](${queue[0].channelURL})`
                        }
                    ])

                let url = queue[0].url
                const loopURL = {
                    url
                };
                musicData.server[message.guild.id].looped.push(loopURL)

                if (queue[1]) videoEmbed.addFields([{ name: 'Siguiente Canción', value: `[${queue[1].title}](${queue[1].url})` }]);
                let embed = await message.channel.send({ embeds: [videoEmbed] })
                musicData.server[message.guild.id].isPlaying = queue[0]
                musicData.server[message.guild.id].queue.shift();
                musicData.server[message.guild.id].lastEmbed = embed

            }
        })
            .on(AudioPlayerStatus.Idle, async () => {

                if (musicData.server[message.guild.id].unPaused == true) return
                if (musicData.server[message.guild.id].loop == true) {
                    playSong(musicData.server[message.guild.id].looped, message)

                } else if (musicData.server[message.guild.id].queue.length >= 1) {
                    musicData.server[message.guild.id].looped.shift();

                    playSong(musicData.server[message.guild.id].queue, message)
                } else {
                    musicData.server[message.guild.id].isPlaying = false

                    musicData.server[message.guild.id].looped.length = 0
                    message.channel.send({ content: "Se han terminado todas las canciones" })

                    if (musicData.server[message.guild.id].pause == false && !musicData.server[message.guild.id].isPlaying) {

                        setTimeout(() => {
                            if (musicData.server[message.guild.id].pause == false && !musicData.server[message.guild.id].isPlaying) {
                                getVoiceConnection(message.guild.id)?.destroy()
                            }
                        }, 60000)
                    }
                }
            })
    } else if (queue[0].provider === "Spotify" || musicData.server[message.guild.id].looped[0]) {

        const stream = ytdl.exec(queue[0].download, { format: "bestaudio", output: "-", cookies: "cookies.txt" });
        const voice = createAudioResource(stream.stdout, { inputType: StreamType.Arbitrary });

        musicData.server[message.guild.id].songDispatcher.play(voice)

        const subscription = connection.subscribe(musicData.server[message.guild.id].songDispatcher)

        musicData.server[message.guild.id].songDispatcher.on(AudioPlayerStatus.Playing, async () => {

            musicData.server[message.guild.id].pause = false

            if (musicData.server[message.guild.id].unPaused == true) {
                musicData.server[message.guild.id].unPaused = false
            }

            if (queue[0]?.title) {
                if (musicData.server[message.guild.id].loop == false) {
                    if (musicData.server[message.guild.id].lastEmbed) musicData.server[message.guild.id].lastEmbed.delete();


                    const videoEmbed = new EmbedBuilder()
                        .setAuthor({ name: "Música", iconURL: message.author.displayAvatarURL({ size: 2048 }) })
                        .setThumbnail(queue[0]?.thumbnail)
                        .setColor('#1DB954')
                        .setFields([
                            {
                                name: "Escuchando",
                                value: `[${queue[0].title}](${queue[0].url})`
                            },
                            {
                                name: "Duración",
                                value: `${fmtMSS(queue[0].duration)}`
                            },
                            {
                                name: "Artista",
                                value: `${queue[0].channel}`
                            }
                        ])

                    let url = queue[0].url
                    const loopURL = {
                        url
                    };
                    musicData.server[message.guild.id].looped.push(loopURL)

                    if (queue[1]) videoEmbed.addFields([{ name: 'Siguiente Canción', value: `[${queue[1].title}](${queue[1].url})` }]);
                    let embed = await message.channel.send({ embeds: [videoEmbed] })
                    musicData.server[message.guild.id].isPlaying = queue[0]
                    musicData.server[message.guild.id].queue.shift();
                    musicData.server[message.guild.id].lastEmbed = embed
                }
            }
        })
            .on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                    // Seems to be reconnecting to a new channel - ignore disconnect
                    shouldsend = false;
                } catch (error) {
                    // Seems to be a real disconnect which SHOULDN'T be recovered from
                    connection.destroy();
                }
            })
            .on(AudioPlayerStatus.Idle, async () => {

                if (musicData.server[message.guild.id].unPaused == true) return
                if (musicData.server[message.guild.id].loop == true) {
                    playSong(musicData.server[message.guild.id].looped, message)

                } else if (musicData.server[message.guild.id].queue.length >= 1) {
                    musicData.server[message.guild.id].looped.shift();

                    playSong(musicData.server[message.guild.id].queue, message)
                } else {
                    musicData.server[message.guild.id].isPlaying = false

                    musicData.server[message.guild.id].looped.length = 0
                    message.channel.send({ content: "Se han terminado todas las canciones" })

                    if (musicData.server[message.guild.id].pause == false && !musicData.server[message.guild.id].isPlaying) {

                        subscription.unsubscribe()
                        setTimeout(() => {
                            if (musicData.server[message.guild.id].pause == false && !musicData.server[message.guild.id].isPlaying) {
                                getVoiceConnection(message.guild.id)?.destroy()
                            }
                        }, 60000)
                    }
                }
            })
            .on('error', async e => {
                message.channel.send({ content: 'No se puede escuchar esa canción' });
                musicData.server[message.guild.id].queue.length = 0;
                musicData.server[message.guild.id].isPlaying = false;
                musicData.server[message.guild.id].pause = false
                musicData.server[message.guild.id].loop = false
                musicData.server[message.guild.id].looped.length = 0
                musicData.server[message.guild.id].songDispatcher = null
                musicData.server[message.guild.id].lastEmbed = null
                console.error(e);
                return connection.destroy()
            })
    }
}
module.exports = {
    playSong
}
