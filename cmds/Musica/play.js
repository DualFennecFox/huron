const { EmbedBuilder } = require('discord.js');
const musicData = require("./requirements/musicData");
const { playSong } = require('./requirements/functions')
const { Client } = require('youtubei')
const getVideoId = require('get-video-id')
function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].link.includes(nameKey)) {
            return myArray[i];
        }
    }
  }

    module.exports = {
            name : 'play',
            category: "Musica",
            description : 'Este comando busca una musica en Youtube para escucharla en un chat de voz',
            usage: '!play <Busqueda, URL, Playlist>',
            examples: ['!play never gonna give you up', '!play ""'],
            run: async(client, message, args) => {   
                      
                    if (message.member.voice.channel?.type != 2) return message.channel.send({ content: "Debes estar en un canal de voz para usar este comando" })
                    if (message.guild.members.me.voice.channel) {
                        if (message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.channel.send({ content: "Debes estar conectado a mi canal de voz para usar este comando" })
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
                    const YT = new Client()

                    if (args[0].match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
                              try {
                                
                                YT.getPlaylist(args[0].slice(38), { limit: 0 }).then(playlist => {
                                    for (let i = 0; i < playlist.videos.length; i++) {
                                        musicData.server[message.guild.id].queue.push({
                                            url: `https://www.youtube.com/watch?v=${playlist.videos[i].id}`,
                                            title: playlist.videos[i].title.replace("@", "@\u200b"),
                                            duration: playlist.videos[i].duration,
                                            thumbnail: playlist.videos[i].thumbnail,
                                            channel: playlist.videos[i].channel.name,
                                            channelURL: playlist.videos[i].channel.url,
                                            voiceChannel: message.member.voice.channel,
                                            provider: "Youtube"
                                        });
                                    }
                                    
                                  if (!musicData.server[message.guild.id].isPlaying) {
                                      musicData.server[message.guild.id].isPlaying = playlist.videos[0];
                                      message.channel.send({ content: `Se han añadido a la cola **${playlist.videos.length}** canciones` })
                                      return playSong(musicData.server[message.guild.id].queue, message);
                                  } else if (musicData.server[message.guild.id].isPlaying) {
                                    musicData.server[message.guild.id].loop = false
                                      return message.channel.send({ content:`**${playlist.title}** Se ha añadido a la cola con ${playlist.videos.length} videos` })
                                  };
                              }).catch(err => {
                                console.error(err)
                            })
                            } catch (err) {
                                console.error(err)
                                return message.channel.send({ content: "Esta Playlist es privada o no existe" })
                            }       
                    }
            
                    else if (getVideoId(args[0])?.id && getVideoId(args[0])?.service === "youtube") {
                          try {

                            let ID = getVideoId(args[0]).id
                            YT.getVideo(ID).then(video => {
                            const url = `https://www.youtube.com/watch?v=${video.id}`
                            const title = video.title.replace("@", "@\u200b")
                            const duration = video.duration
                            const thumbnail = video.thumbnail;
                            const channel = video.channel.name
                            const channelURL = video.channel.url
                            if (duration == '0') duration = 'Transmitiendo en Vivo';
                            const voiceChannel = message.member.voice.channel
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

                    
                       YT.search(argsresult, { type: "video", limit: 10 }).then(async (videos) => {

                        if (musicData.server[message.guild.id].awaiting == true) return message.channel.send({ content: "Ya se está esperando la respuesta" })
                        if (videos.length < 1) return message.channel.send({ content: "No existe ningún resultado con ese nombre trate cambiando las palabras" })
                        const vidNameArr = []
                        const videoID = []

                        for (let v = 0; v < videos.length; v++) {
                             videoID.push(`https://www.youtube.com/watch?v=${videos[v].id}`)
                             vidNameArr.push(`${v + 1}: ${videos[v].title}`);
                        }
            
                          const embed = new EmbedBuilder()
                          .setColor('#FF0000')
                          .setTitle("Elige la canción que quieres escuchar según el número")
                          .setFooter({ text: 'Escribe "exit" para salir' })
                          
                          let arr = [{ name: "\`1\`", value: vidNameArr[0] }]

                          if (vidNameArr[1]) arr.push({ name: "\`2\`", value: vidNameArr[1]})
                          if (vidNameArr[2]) arr.push({ name: "\`3\`", value: vidNameArr[2]})
                          if (vidNameArr[3]) arr.push({ name: "\`4\`", value: vidNameArr[3]})
                          if (vidNameArr[4]) arr.push({ name: "\`5\`", value: vidNameArr[4]})
                          if (vidNameArr[5]) arr.push({ name: "\`6\`", value: vidNameArr[5]})
                          if (vidNameArr[6]) arr.push({ name: "\`7\`", value: vidNameArr[6]})
                          if (vidNameArr[7]) arr.push({ name: "\`8\`", value: vidNameArr[7]})
                          if (vidNameArr[8]) arr.push({ name: "\`9\`", value: vidNameArr[8]})
                          if (vidNameArr[9]) arr.push({ name: "\`10\`", value: vidNameArr[9]})

                          console.log(arr)
                          embed.setFields(arr)

                          var songEmbed = await message.channel.send({ embeds: [embed] });
                          musicData.server[message.guild.id].awaiting = true
                          try {
                              const filter = msg => msg.content > 0 && msg.content < 11 || msg.content === 'exit' && msg.author.id === message.author.id
                              
                              var response = await message.channel.awaitMessages({filter, max: 1, time: 30000, errors: ['time']})
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
                                var video = videos[videoIndex - 1]  
                                response.first().delete()     
                              } catch (err) {
                                  console.error(err)
                                  if (songEmbed) songEmbed.delete()
                                  return message.channel.send({ content: "Hubo un error al obtener el video de Youtube" })
                              }       

                          const url = `https://www.youtube.com/watch?v=${video.id}`;
                          const title = video.title.replace("@", "@\u200b")
                          let duration = video.duration;
                          const thumbnail = video.thumbnail;
                          const channel = video.channel.name;
                            const channelURL = video.channel.url
                            if (duration == '0') duration = 'Transmitiendo en Vivo';
                            const voiceChannel = message.member.voice.channel
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
                            } else if (musicData.server[message.guild.id].isPlaying) {
                               if (songEmbed) songEmbed.delete();
                               musicData.server[message.guild.id].loop = false
            
                                return message.channel.send({ content: `**${song.title}** Se ha añadido a la cola` });
                            }
                        }).catch(err => {
                            console.error(err)
                        })

                        } catch (err) {
                            console.error(err)
                            musicData.server[message.guild.id].awaiting = false
                            if (songEmbed) songEmbed.delete()
                            musicData.server[message.guild.id].loop = false
                            return message.channel.send({ content: "Hubo un error al buscar el video en Youtube" })
                        }
                    }
                }
            }
