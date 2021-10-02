const Discord = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, 
StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice')

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
       const voice = createAudioResource(ytdl(queue[0].url, {filter: 'audioonly', quality: 'highestaudio' }), { inlineVolume: false })
       musicData.server[message.guild.id].songDispatcher.play(voice)

       connection.subscribe(musicData.server[message.guild.id].songDispatcher)
    
       musicData.server[message.guild.id].songDispatcher.on(AudioPlayerStatus.Playing, async () => {

            musicData.server[message.guild.id].pause = false

            if (musicData.server[message.guild.id].unPaused == true) {
            musicData.server[message.guild.id].unPaused == false
            let playing = musicData.server[message.guild.id].isPlaying[0]

            const videoEmbed = new Discord.MessageEmbed()
            .setAuthor("Música", message.author.displayAvatarURL({ size: 2048, type: "png", dynamic: true }))
            .setThumbnail(playing[0].thumbnail)
            .setColor('#FF0000')
            .addField('Escuchando', `[${playing[0].title}](${playing[0].url})`)
            .addField('Duración', `${playing[0].duration}`)
            .addField('Canal', `[${playing[0].channel}](${playing[0].channelURL})`)
            let url = playing[0].url
            const loopURL = {
                url
            };
            } else if(musicData.server[message.guild.id].loop == false) {
            if (musicData.server[message.guild.id].lastEmbed) musicData.server[message.guild.id].lastEmbed.delete();
            
            const videoEmbed = new Discord.MessageEmbed()
            .setAuthor("Música", message.author.displayAvatarURL({ size: 2048, type: "png", dynamic: true }))
            .setThumbnail(queue[0].thumbnail)
            .setColor('#FF0000')
            .addField('Escuchando', `[${queue[0].title}](${queue[0].url})`)
            .addField('Duración', `${queue[0].duration}`)
            .addField('Canal', `[${queue[0].channel}](${queue[0].channelURL})`)
            let url = queue[0].url
            const loopURL = {
                url
            };
            musicData.server[message.guild.id].looped.push(loopURL)
            
            if (queue[1]) videoEmbed.addField('Siguiente Canción', `[${queue[1].title}](${queue[1].url})`);
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
      /* else if (queue[0].provider === "SoundCloud" || musicData.server[message.guild.id].looped[0]) {

        let song = await queue[0].SC.getSongInfo(queue[0].url)
        dispatcher.play(await song.downloadProgressive())

        .on('start', async () => {
            musicData.server[message.guild.id].songDispatcher = dispatcher
            musicData.server[message.guild.id].pause = false

            if(musicData.server[message.guild.id].loop == false) {
            if (musicData.server[message.guild.id].lastEmbed) musicData.server[message.guild.id].lastEmbed.delete();
            
            const videoEmbed = new Discord.MessageEmbed()
            .setAuthor("Música", message.author.displayAvatarURL({ size: 2048, type: "png", dynamic: true }))
            .setThumbnail(queue[0].thumbnail)
            .setColor('#F25B02')
            .addField('Escuchando', `[${queue[0].title}](${queue[0].url})`)
            .addField('Duración', `${queue[0].duration}`.substring(0, 3))
            .addField('Canal', `[${queue[0].channel}](${queue[0].channelURL})`)
            let url = queue[0].url
            const loopURL = {
                url
            };
            musicData.server[message.guild.id].looped.push(loopURL)
            
            if (queue[1]) videoEmbed.addField('Siguiente Canción', `[${queue[1].title}](${queue[1].url})`);
            let embed = await message.channel.send({ embeds: [videoEmbed] })
            musicData.server[message.guild.id].lastEmbed = embed
            musicData.server[message.guild.id].queue.shift();
            }
        })
        .on('finish', async () => {
            if (musicData.server[message.guild.id].loop == true) { 
                playSong(musicData.server[message.guild.id].looped, message)
               
           } else if (musicData.server[message.guild.id].queue.length >= 1) {
                   musicData.server[message.guild.id].looped.shift();
                   playSong(musicData.server[message.guild.id].queue, message)
           } else {
                   musicData.server[message.guild.id].isPlaying = false
                   musicData.server[message.guild.id].looped.length = 0
                   message.channel.send({ content: "Se han terminado todas las canciones"})
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
               return message.member.voice.channel.leave();
               })
              } */
    
}
module.exports = {
    playSong
}
