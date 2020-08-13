const Discord = require('discord.js')
const musicData = require('./musicData')
const ytdl = require('ytdl-core')

  function playSong(queue, message) {
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
    message.member.voice.channel
    .join()
    .then(connection => {
       const dispatcher = connection
       .play(ytdl(queue[0].url, {filter: 'audioonly' }, {highWaterMark: 50, volume: false}))
        
        .on('start', () => {
            musicData.server[message.guild.id].songDispatcher = dispatcher
            musicData.server[message.guild.id].pause = false

            if(musicData.server[message.guild.id].loop == false) {
            if (musicData.server[message.guild.id].lastEmbed) musicData.server[message.guild.id].lastEmbed.delete();
            
            const videoEmbed = new Discord.MessageEmbed()
            .setThumbnail(queue[0].thumbnail)
            .setColor('#FF0000')
            .addField('Escuchando', `[${queue[0].title}](${queue[0].url})`)
            .addField('Duración', queue[0].duration)
            .addField('Canal', `[${queue[0].channel}](${queue[0].channelURL})`)
            let url = queue[0].url
            const loopURL = {
                url
            };
            musicData.server[message.guild.id].looped.push(loopURL)
            
            if (queue[1]) videoEmbed.addField('Siguiente Canción', `[${queue[1].title}](${queue[1].url})`);
            message.channel.send(videoEmbed).then(embed => {
            musicData.server[message.guild.id].lastEmbed = embed
            })
            musicData.server[message.guild.id].queue.shift();
            }
        })
        .on('finish', () => {
         if (musicData.server[message.guild.id].loop == true) { 
             playSong(musicData.server[message.guild.id].looped, message)
            
        } else if (musicData.server[message.guild.id].queue.length >= 1) {
                musicData.server[message.guild.id].looped.shift();
                playSong(musicData.server[message.guild.id].queue, message)
        } else {
                musicData.server[message.guild.id].isPlaying = false
                musicData.server[message.guild.id].looped.length = 0
                message.channel.send("Se han terminado todas las canciones")
            }
            })
        .on('error', e => {
            message.channel.send('No se puede escuchar esa canción');
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
    }).catch(e => {
        console.error(e)
        return message.member.voice.channel.leave();
    })
}
module.exports = {
    playSong
}