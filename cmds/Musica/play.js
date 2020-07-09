const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const Youtube = require('simple-youtube-api');
youtube = new Youtube(process.env.YOUTUBE_API_KEY)


    module.exports = {
            name : 'play',
            category: "Musica",
            aliases: ['Play', 'PLAY'],
            description : 'Este comando busca una musica en Youtube para escucharla en un chat de voz',
            usage: '!play',
            examples: ['!play Musica', '!play "URL de YT"'],
            run: async(client, message, args) => {
                    let musicData = {
                        queue: [],
                        isPlaying: false,
                      };
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
                     function playSong(queue, message) {
                        let voiceChannel;
                        message.member.voice.channel
                        .join()
                        .then(async connection => {
                            const dispatcher = connection
                            .play(await ytdl(queue[0].url), {type: 'opus' }, {highWaterMark: 50, volume: false})
                        
                        .on('start', () => {
                            musicData.isPlaying = true;
            
                            const videoEmbed = new Discord.MessageEmbed()
                            .setThumbnail(queue[0].thumbnail)
                            .setColor('#FF0000')
                            .addField('Escuchando', `[${queue[0].title}](${queue[0].url})`)
                            .addField('Duración', queue[0].duration);
                            
                            if (queue[1]) videoEmbed.addField('Siguiente Canción', `[${queue[1].title}](${queue[1].url})`);
                            message.channel.send(videoEmbed);
                            return queue.shift();
                        })
                        .on('finish', () => {
                            if(!queue[0]) return message.member.voice.channel.leave();
                            if (queue.length >= 1) {
                                
                            return playSong(queue, message);
                                
                                
                            } else {
                                musicData.isPlaying = false;
                                return message.member.voice.channel.leave();
                            }
                        })
                        .on('error', e => {
                            message.channel.send('No se puede escuchar esa canción');
                            musicData.queue.length = 0;
                            musicData.isPlaying = false;
                            musicData.nowPlaying = null;
                            console.error(e);
                            return message.member.voice.channel.leave();
                        });
                        })    
                        .catch(e => {
                            console.error(e)
                            return message.member.voice.channel.leave();
                        })    
                      } 
                      
                    if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
            
                      if (args[0].match(/^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/)) {
                          
                          const url = args[0];
                              args[0] = args[0]
                              .replace(/(>|<)/gi, '')
                              .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                            const video = await youtube.getVideoByID(args[0]);
                            const title = video.title;
                            let duration = formatDuration(video.duration);
                            const thumbnail = video.thumbnails.high.url;
                            if (duration == '00:00') duration = 'Transmitiendo en Vivo';
                            const voiceChannel = message.member.voice.channel
                            
                            const song = {
                                url,
                                title,
                                duration,
                                thumbnail,
                                voiceChannel
                            };
                            musicData.queue.push(song);
                            if (
                                musicData.isPlaying == false ||
                                typeof musicData.isPlaying == 'undefined'
                            ) {
                                musicData.isPlaying == true;
                                return playSong(musicData.queue, message);
                            } else if (musicData.isPlaying == true) {
                                return message.channel.send(`**${song.title}** Se ha añadido a la cola`)
                            }
                      }
                          const videos = await youtube.searchVideos(args, 10);
                          if (videos.length < 10) {
                              return message.channel.send("Muy pocos videos tienen ese nombre asegurate de haberlo escrito bien")
                          }
                          const vidNameArr = []
                          const videoID = []

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
                          let songEmbed = await message.channel.send({ embed });
                              let response = await message.channel.awaitMessages(
                                  msg => (msg.content > 0 && msg.content < 11) || msg.content === 'exit', 
                                  
                                   
                                  {
                                      max: 1,
                                      maxProcessed: 1,
                                      time: 60000,
                                      errors: ['time']
                                  }
                                )                                

                                if (response.first().content === "exit") return songEmbed.delete()
                                let videoIndex = parseInt(response.first().content);
                                let video = await youtube.getVideo(videoID[videoIndex - 1])                 

                          const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                          const title = video.title;
                          let duration = formatDuration(video.duration);
                          const thumbnail = video.thumbnails.high.url;         
                            if (duration == '00:00') duration = 'Transmitiendo en Vivo';
                            const voiceChannel = message.member.voice.channel
                            const song = {
                                url,
                                title,
                                duration,
                                thumbnail,
                                voiceChannel
                            };
                            musicData.queue.push(song);
            
                            if(musicData.isPlaying == false) {
                                musicData.isPlaying = true;
                                songEmbed.delete();
                                playSong(musicData.queue, message);
                            } else if (musicData.isPlaying == true) {
                                songEmbed.delete();
            
                                return message.channel.send(`${song.title} Se ha añadido a la cola`);
                            }  
                        }
                }