const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const musicData = require("./requirements/musicData");
const { playSong } = require('./requirements/functions')
const ytpl = require('ytpl')
const ytsr = require('ytsr')
const YT = require('scrape-yt')
const getVideoId = require('get-video-id')
function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].link.includes(nameKey)) {
            return myArray[i];
        }
    }
  }

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

    module.exports = {
            name : 'play',
            category: "Musica",
            description : 'Este comando busca una musica en Youtube para escucharla en un chat de voz',
            usage: '!play <Busqueda, URL, Playlist>',
            examples: ['!play Super-Canción', '!play ""'],
            run: async(client, message, args) => {   
                      
                    if (!message.member.voice.channel) return message.channel.send("Debes estar en un canal de voz para usar este comando")
                    if (message.guild.me.voice.channel) {
                        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send("Debes estar conectado a mi canal de voz para usar este comando")
                        }
                    if (!args.length >= 1) return message.channel.send("Dime que canción quieres escuchar")
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
                    if (!message.guild.me.voice.channel) {
                        musicData.server[message.guild.id].queue.length = 0
                        musicData.server[message.guild.id].songDispatcher = null
                        musicData.server[message.guild.id].isPlaying = false
                        musicData.server[message.guild.id].loop = false
                        musicData.server[message.guild.id].looped.length = 0
                        musicData.server[message.guild.id].lastEmbed = null
                    }

                    if (args[0].match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
                              try {
                                
                                YT.getPlaylist(args[0].slice(38), { limit: Infinity }).then(playlist => {
                                    for (let i = 0; i < playlist.videos.length; i++) {
                                        musicData.server[message.guild.id].queue.push({
                                            url: `https://www.youtube.com/watch?v=${playlist.videos[i].id}`,
                                            title: playlist.videos[i].title,
                                            duration: playlist.videos[i].duration,
                                            thumbnail: playlist.videos[i].thumbnail,
                                            channel: playlist.videos[i].channel.name,
                                            channelURL: playlist.videos[i].channel.url,
                                            voiceChannel: message.member.voice.channel
                                        });
                                    }
                                    
                                  if (musicData.server[message.guild.id].isPlaying == false) {
                                      musicData.server[message.guild.id].isPlaying = true;
                                      message.channel.send(`Se han añadido a la cola **${playlist.items.length}** canciones`)
                                      return playSong(musicData.server[message.guild.id].queue, message);
                                  } else if (musicData.server[message.guild.id].isPlaying == true) {
                                    musicData.server[message.guild.id].loop = false
                                      return message.channel.send(`**${playlist.title}** Se ha añadido a la cola con ${playlist.items.length} videos`)
                                  };
                              }).catch(err => {
                                console.error(err)
                            })
                            } catch (err) {
                                console.error(err)
                                return message.channel.send("Esta Playlist es privada o no existe")
                            }       
                    }
            
                    else if (args[0].match(/^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/)) {
                          try {

                            let ID = getVideoId(args[0]).id
                            YT.getVideo(ID).then(video => {
                            const url = `https://www.youtube.com/watch?v=${video.id}`
                            const title = video.title
                            const duration = video.duration
                            const thumbnail = video.thumbnail;
                            const channel = video.channel.name
                            const channelURL = video.channel.url
                            if (duration == '0') duration = 'Transmitiendo en Vivo';
                            const voiceChannel = message.member.voice.channel
                            
                            const song = {
                                url,
                                title,
                                duration,
                                thumbnail,
                                channel,
                                channelURL,
                                voiceChannel
                            };
                            musicData.server[message.guild.id].queue.push(song);
                            if (
                                 musicData.server[message.guild.id].isPlaying == false
                            ) {
                               musicData.server[message.guild.id].isPlaying = true;
                                return playSong(musicData.server[message.guild.id].queue, message);
                            } else if (musicData.server[message.guild.id].isPlaying == true) {
                                musicData.server[message.guild.id].loop = false
                                return message.channel.send(`**${song.title}** Se ha añadido a la cola`)
                            }
                        }).catch(err => {
                            console.error(err)
                        })
                      } catch (err) {
                          console.error(err)
                          message.channel.send("Algo salio mal vuelva a intentarlo")
                      }
                    } else {
                    try {
                        let argsresult = args.join(" ")

                    
                       YT.search(argsresult, { type: "video", limit: 10 }).then(async (videos) => {
                        if (videos.length < 10) {
                            return message.channel.send("Muy pocos videos tienen ese nombre asegurate de haberlo escrito bien")
                        }
                        if (musicData.server[message.guild.id].awaiting == true) return message.channel.send("Ya se está esperando la respuesta")
                        const vidNameArr = []
                        const videoID = []

                        for (let v = 0; v < videos.length; v++) {
                             videoID.push(`https://www.youtube.com/watch?v=${videos[v].id}`)
                             vidNameArr.push(`${v + 1}: ${videos[v].title}`);
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
                          musicData.server[message.guild.id].awaiting = true
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
                                var video = videos[videoIndex - 1]       
                              } catch (err) {
                                  console.error(err)
                                  if (songEmbed) songEmbed.delete()
                                  return message.channel.send("Hubo un error al obtener el video de Youtube")
                              }       

                          const url = `https://www.youtube.com/watch?v=${video.id}`;
                          const title = video.title
                          let duration = video.duration;
                          const thumbnail = video.thumbnail;
                          const channel = video.channel.name;
                            const channelURL = video.channel.url
                            if (duration == '0') duration = 'Transmitiendo en Vivo';
                            const voiceChannel = message.member.voice.channel
                            const song = {
                                url,
                                title,
                                duration,
                                thumbnail,
                                channel,
                                channelURL,
                                voiceChannel
                            };
                            
                            musicData.server[message.guild.id].queue.push(song);
            
                            if (musicData.server[message.guild.id].isPlaying == false) {
                             musicData.server[message.guild.id].isPlaying = true
                               if (songEmbed) songEmbed.delete();
                               return playSong(musicData.server[message.guild.id].queue, message);
                            } else if (musicData.server[message.guild.id].isPlaying == true) {
                               if (songEmbed) songEmbed.delete();
                               musicData.server[message.guild.id].loop = false
            
                                return message.channel.send(`**${song.title}** Se ha añadido a la cola`);
                            }
                        }).catch(err => {
                            console.error(err)
                        })

                        } catch (err) {
                            console.error(err)
                            musicData.server[message.guild.id].awaiting = false
                            if (songEmbed) songEmbed.delete()
                            musicData.server[message.guild.id].loop = false
                            return message.channel.send("Hubo un error al buscar el video en Youtube")
                        }
                    }
                }
            }