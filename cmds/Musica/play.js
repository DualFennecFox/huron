const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
youtube = new Youtube(process.env.YOUTUBE_API_KEY)
const musicData = require("./requirements/musicData");
const loop = require('./loop');
function playSong(queue, message) {
    if (!musicData.server[message.guild.id]) musicData.server[message.guild.id] = {
        queue: [],
        loop: false,
        isPlaying: false,
        looped: [],
        songDispatcher: null,
        pause: false,
        awaiting: false
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
            message.channel.send(videoEmbed);
            musicData.server[message.guild.id].queue.shift();
            }
        })
        .on('disconnect', () => {
            musicData.server[message.guild.id].queue.length = 0
            musicData.server[message.guild.id].looped.length = 0
            musicData.server[message.guild.id].isPlaying = false
            musicData.server[message.guild.id].pause = false
            musicData.server[message.guild.id].loop = false
            musicData.server[message.guild.id].songDispatcher = null
        })
        .on('finish', () => {
         if (musicData.server[message.guild.id].loop == true) { 
             playSong(musicData.server[message.guild.id].looped, message)
            
        } else if (musicData.server[message.guild.id].queue.length >= 1) {
                playSong(musicData.server[message.guild.id].queue, message)
        } else {
                musicData.server[message.guild.id].isPlaying = false
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
            console.error(e);
            return message.member.voice.channel.leave();
            })
    }).catch(e => {
        console.error(e)
        return message.member.voice.channel.leave();
    })
}
    module.exports = {
            name : 'play',
            category: "Musica",
            aliases: ['Play', 'PLAY'],
            description : 'Este comando busca una musica en Youtube para escucharla en un chat de voz',
            usage: '!play',
            examples: ['!play Musica', '!play "URL de YT"'],
            playSong,
            run: async(client, message, args) => {    
                
                     function formatDuration(durationObj) {
                        const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
                          durationObj.minutes ? durationObj.minutes : '00'
                        }:${
                          durationObj.seconds < 10
                            ? '0' + durationObj.seconds
                            : durationObj.seconds
                            ? durationObj.seconds
                            : '00'
                        }`;
                        return duration;
                      }
                    
                      
                    if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                    if (message.guild.me.voice.channel) {
                        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                        }
                    if (!musicData.server[message.guild.id]) musicData.server[message.guild.id] = {
                        queue: [],
                        loop: false,
                        isPlaying: false,
                        looped: [],
                        songDispatcher: null,
                        pause: false,
                        awaiting: false
                    }
                    if (!message.guild.me.voice.channel) {
                        musicData.server[message.guild.id].queue.length = 0
                        musicData.server[message.guild.id].songDispatcher = null
                        musicData.server[message.guild.id].isPlaying = false
                        musicData.server[message.guild.id].loop = false
                        musicData.server[message.guild.id].looped.length = 0
                    }

                    if (args[0].match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
                              try {
                              const playlist = await youtube.getPlaylist(args[0])
                              const videosObj = await playlist.getVideos();
            
                              for (let i = 0; i < videosObj.length; i++) {
                                  const video = await videosObj[i].fetch();
            
                                  const url = `https://www.youtube.com/watch?v=${playlist.id}`;
                                  const channelURL =  `https://www.youtube.com/channel/${video.channel.id}`
                                  const title = video.title;
                                  let duration = formatDuration(video.duration);
                                const thumbnail = video.thumbnails.high.url;         
                                if (duration == '00:00') duration = 'Transmitiendo en Vivo';
                                const voiceChannel = message.member.voice.channel
                                const channel = video.channel.title
                                const song = {
                                url,
                                title,
                                duration,
                                thumbnail,
                                voiceChannel,
                                channel,
                                channelURL
                                };
                                  
                                  musicData.server[message.guild.id].queue.push(song)
                                
                            
                                  if (musicData.server[message.guild.id].isPlaying == false) {
                                      musicData.server[message.guild.id].isPlaying = true;
                                      return playSong(musicData.server[message.guild.id].queue, message);
                                  } else if (musicData.server[message.guild.id].isPlaying == true) {
                                      return message.channel.send(`**${playlist.title}** Se ha añadido a la cola`)
                                  };
                              }
                      } catch (err) {
                          console.error(err)
                          return message.channel.send("Esta Playlist es privada o no existe")
                      }
                    }
            
                      if (args[0].match(/^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/)) {
                          try {
                          const url = args[0];
                              args[0] = args[0]
                              .replace(/(>|<)/gi, '')
                              .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                              const video = await youtube.getVideoByID(args[0]);
                              const channelURL =  `https://www.youtube.com/channel/${video.channel.id}`
                              const title = video.title;
                              let duration = formatDuration(video.duration);
                              const thumbnail = video.thumbnails.high.url;         
                                if (duration == '00:00') duration = 'Transmitiendo en Vivo';
                                const voiceChannel = message.member.voice.channel
                                const channel = video.channel.title
                                const song = {
                                    url,
                                    title,
                                    duration,
                                    thumbnail,
                                    voiceChannel,
                                    channel,
                                    channelURL
                                };
                            musicData.server[message.guild.id].queue.push(song);
                            if (
                                 musicData.server[message.guild.id].isPlaying == false
                            ) {
                               musicData.server[message.guild.id].isPlaying = true;
                                return playSong(musicData.server[message.guild.id].queue, message);
                            } else if (musicData.server[message.guild.id].isPlaying == true) {
                                return message.channel.send(`**${song.title}** Se ha añadido a la cola`)
                            }
                      } catch (err) {
                          console.error(err)
                          message.channel.send("Algo salio mal vuelva a intentarlo")
                      }
                    }
                    try {
                          const videos = await youtube.searchVideos(args, 10);
                          if (videos.length < 10) {
                              return message.channel.send("Muy pocos videos tienen ese nombre asegurate de haberlo escrito bien")
                          }
                          if (musicData.server[message.guild.id].awaiting == true) return message.channel.send("Ya se está esperando la respuesta")
                          const vidNameArr = []
                          const videoID = []
                          musicData.server[message.guild.id].awaiting = true
                          for (let v = 0; v < videos.length; v++) {
                              videoID.push(`https://www.youtube.com/watch?v=${videos[v].id}`)
                          }
            
                          for (let i = 0; i < videos.length; i++) {
                          vidNameArr.push(`${i + 1}: ${videos[i].title}`);
                          }
                          vidNameArr.push('exit');
            
                          const embed = new Discord.MessageEmbed()
                          .setColor('#FF0000')
                          .setTitle("Elige la canción que quieres escuchar según el número")
                          .addField("\`1\`", vidNameArr[0])
                          .addField("\`2\`", vidNameArr[1])
                          .addField("\`3\`", vidNameArr[2])
                          .addField("\`4\`", vidNameArr[3])
                          .addField("\`5\`", vidNameArr[4])
                          .addField("\`6\`", vidNameArr[5])
                          .addField("\`7\`", vidNameArr[6])
                          .addField("\`8\`", vidNameArr[7])
                          .addField("\`9\`", vidNameArr[8])
                          .addField("\`10\`", vidNameArr[9])
                          .setFooter('Escribe "exit" para salir')
                          var songEmbed = await message.channel.send({ embed });
                          try {
                              var response = await message.channel.awaitMessages(msg => (msg.content > 0 && msg.content < 11 || msg.content === 'exit') && msg.author.id === message.author.id, {max: 1, time: 60000, errors: ['time']})
                              if (response.first().content) musicData.server[message.guild.id].awaiting = false
                              var videoIndex = parseInt(response.first().content);
                              } catch (err) {
                                  console.error(err)
                                  musicData.server[message.guild.id].awaiting = false
                                 if (songEmbed) songEmbed.delete()
                                 return message.channel.send("No respondiste a tiempo, asegurate de elegir un número del 1 al 10")
                              }
                              if (response.first().content === 'exit') {
                                musicData.server[message.guild.id].awaiting = false
                                  return songEmbed.delete() 
                              }
                              try {
                                var video = await youtube.getVideo(videoID[videoIndex - 1])       
                              } catch (err) {
                                  musicData.server[message.guild.id].awaiting = true
                                  console.error(err)
                                  if (songEmbed) songEmbed.delete()
                                  return message.channel.send("Hubo un error al obtener el video de Youtube")
                              }       

                          const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                          const channelURL =  `https://www.youtube.com/channel/${video.channel.id}`
                          const title = video.title;
                          let duration = formatDuration(video.duration);
                          const thumbnail = video.thumbnails.high.url;         
                            if (duration == '00:00') duration = 'Transmitiendo en Vivo';
                            const voiceChannel = message.member.voice.channel
                            const channel = video.channel.title
                            const song = {
                                url,
                                title,
                                duration,
                                thumbnail,
                                voiceChannel,
                                channel,
                                channelURL
                            };
                            musicData.server[message.guild.id].queue.push(song);
            
                            if (musicData.server[message.guild.id].isPlaying == false) {
                             musicData.server[message.guild.id].isPlaying = true
                               if (songEmbed) songEmbed.delete();
                               return playSong(musicData.server[message.guild.id].queue, message);
                            } else if (musicData.server[message.guild.id].isPlaying == true) {
                               if (songEmbed) songEmbed.delete();
            
                                return message.channel.send(`**${song.title}** Se ha añadido a la cola`);
                            }  
                        } catch (err) {
                            console.error(err)
                            musicData.server[message.guild.id].awaiting = false
                            if (songEmbed) songEmbed.delete()
                            musicData.server[message.guild.id].loop = false
                            return message.channel.send("Hubo un error al buscar el video en Youtube")
                        }
                        
            }
        }
