const { EmbedBuilder } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice')
const Scl = require('soundcloud-scraper')
const SC = new Scl.Client()
const musicData = require('./musicData')
const ytdl = require('ytdl-core')

 async function playSong(queue, message) {
    if (!musicData.server[message.guild.id]){
        
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
    const connection = joinVoiceChannel({ channelId: message.member.voice.channelId, guildId: message.guild.id, adapterCreator: message.guild.voiceAdapterCreator })
    const player = createAudioPlayer()
    musicData.server[message.guild.id].songDispatcher = player

       if (queue[0].provider === "Youtube" || musicData.server[message.guild.id].looped[0]) {
       const stream = ytdl(queue[0].url, { filter: 'audioonly', quality: 'highestaudio' });
       const voice = createAudioResource(stream, { inputType: StreamType.Arbitrary });

       musicData.server[message.guild.id].songDispatcher.play(voice)

       connection.subscribe(musicData.server[message.guild.id].songDispatcher)
    
       musicData.server[message.guild.id].songDispatcher.on(AudioPlayerStatus.Playing, async () => {

            musicData.server[message.guild.id].pause = false

            if (musicData.server[message.guild.id].unPaused == true) {
            musicData.server[message.guild.id].unPaused = false

            } else if(musicData.server[message.guild.id].loop == false) {
            if (musicData.server[message.guild.id].lastEmbed) musicData.server[message.guild.id].lastEmbed.delete();
            
            const videoEmbed = new EmbedBuilder()
            .setAuthor({name: "Música", iconURL: message.author.displayAvatarURL({ size: 2048 })})
            .setThumbnail(queue[0].thumbnail)
            .setColor('#FF0000')
            .setFields([
                {
                    name: "Escuchando",
                    value: `[${queue[0].title}](${queue[0].url})`
                },
                {
                    name: "Duración",
                    value: `${queue[0].duration}`
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
            
            if (queue[1]) videoEmbed.addFields([{ name: 'Siguiente Canción', value: `[${queue[1].title}](${queue[1].url})`}]);
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

            } else if(musicData.server[message.guild.id].loop == false) {
            if (musicData.server[message.guild.id].lastEmbed) musicData.server[message.guild.id].lastEmbed.delete();
    
            const videoEmbed = new EmbedBuilder()
            .setAuthor({name: "Música", iconURL: message.author.displayAvatarURL({ size: 2048, type: "png", dynamic: true })})
            .setThumbnail(queue[0].thumbnail)
            .setColor('#F25B02')
            .setFields([
                {
                    name: "Escuchando",
                    value: `[${queue[0].title}](${queue[0].url})`
                },
                {
                    name: "Duración",
                    value: `${queue[0].duration}`.substring(0, 3)
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
            
            if (queue[1]) videoEmbed.addFields([{ name: 'Siguiente Canción', value: `[${queue[1].title}](${queue[1].url})`}]);
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
            }
            }
module.exports = {
    playSong
}
