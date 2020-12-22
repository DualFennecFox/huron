const Discord = require('discord.js');
const soundcloud = require('soundcloud-scraper')
const SC = new soundcloud.Client(process.env.SOUNDCLOUD_API_KEY)
const musicData = require("./requirements/musicData");
const { playSong } = require('./requirements/functions')
const getVideoId = require('get-video-id')
function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].link.includes(nameKey)) {
            return myArray[i];
        }
    }
  }

    module.exports = {
            name : 'scplay',
            category: "Musica",
            description : 'Este comando busca una musica en SoundCloud para escucharla en un chat de voz',
            usage: '!scplay <Busqueda, URL, Playlist>',
            examples: ['!scplay Super-Canción', '!scplay ""'],
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

                    if (args[0].match(/https{0,1}:\/\/w{0,3}\.*soundcloud\.com\/([A-Za-z0-9_-]+)\/sets\/([A-Za-z0-9_-]+)[^< ]*/)) {
                              try {
                                
                                SC.getPlaylist(args[0], { removeUnknown: true }).then(playlist => {
                                    for (let i = 0; i < playlist.videos.length; i++) {
                                        musicData.server[message.guild.id].queue.push({
                                            url: playlist.tracks[i].trackURL,
                                            title: playlist.tracks[i].title,
                                            duration: playlist.tracks[i].duration,
                                            thumbnail: playlist.tracks[i].thumbnail,
                                            channel: playlist.tracks[i].author.name,
                                            channelURL: playlist.tracks[i].author.url,
                                            voiceChannel: message.member.voice.channel,
                                            provider: "SoundCloud",
                                            SC
                                        });
                                    }
                                    
                                  if (musicData.server[message.guild.id].isPlaying == false) {
                                      musicData.server[message.guild.id].isPlaying = true;
                                      message.channel.send(`Se han añadido a la cola **${playlist.tracks.length}** canciones`)
                                      return playSong(musicData.server[message.guild.id].queue, message);
                                  } else if (musicData.server[message.guild.id].isPlaying == true) {
                                    musicData.server[message.guild.id].loop = false
                                      return message.channel.send(`**${playlist.title}** Se ha añadido a la cola con ${playlist.tracks.length} videos`)
                                  };
                              }).catch(err => {
                                console.error(err)
                            })
                            } catch (err) {
                                console.error(err)
                                return message.channel.send("Esta Playlist es privada o no existe")
                            }       
                    }
            
                    else if (args[0].match(/((https:\/\/)|(http:\/\/)|(www.)|(m\.)|(\s))+(soundcloud.com\/)+[a-zA-Z0-9\-\.]+(\/)+[a-zA-Z0-9\-\.]+/)) {
                          try {

                            SC.getSongInfo(args[0]).then(video => {
                            const url = video.url
                            const title = video.title
                            const duration = video.duration
                            const thumbnail = video.thumbnail;
                            const channel = video.author.username
                            const channelURL = video.author.url
                            const voiceChannel = message.member.voice.channel
                            const provider = "SoundCloud"
                            
                            const song = {
                                url,
                                title,
                                duration,
                                thumbnail,
                                channel,
                                channelURL,
                                voiceChannel,
                                provider,
                                SC
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

                    
                       SC.search(argsresult, "track").then(async (videos) => {

                        if (musicData.server[message.guild.id].awaiting == true) return message.channel.send("Ya se está esperando la respuesta")
                        const vidNameArr = []
                        const videoID = []

                        for (let v = 0; v < videos.length; v++) {
                             videoID.push(videos[v].url)
                             vidNameArr.push(`${v + 1}: ${videos[v].name}`);
                        }

                        vidNameArr.push('exit');
            
                          const embed = new Discord.MessageEmbed()
                          .setColor('#F25B02')
                          .setTitle("Elige la canción que quieres escuchar según el número")
                          if (vidNameArr[0]) embed.addField("\`1\`", vidNameArr[0])
                          if (vidNameArr[1]) embed.addField("\`2\`", vidNameArr[1])
                          if (vidNameArr[2]) embed.addField("\`3\`", vidNameArr[2])
                          if (vidNameArr[3]) embed.addField("\`4\`", vidNameArr[3])
                          if (vidNameArr[4]) embed.addField("\`5\`", vidNameArr[4])
                          if (vidNameArr[5]) embed.addField("\`6\`", vidNameArr[5])
                          if (vidNameArr[6]) embed.addField("\`7\`", vidNameArr[6])
                          if (vidNameArr[7]) embed.addField("\`8\`", vidNameArr[7])
                          if (vidNameArr[8]) embed.addField("\`9\`", vidNameArr[8])
                          if (vidNameArr[9]) embed.addField("\`10\`", vidNameArr[9])
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
                                response.first().delete()     
                              } catch (err) {
                                  console.error(err)
                                  if (songEmbed) songEmbed.delete()
                                  return message.channel.send("Hubo un error al obtener la canción")
                              }       

                          SC.getSongInfo(video.url).then(video => {
                          const url = video.url;
                          const title = video.title
                          let duration = video.duration;
                          const thumbnail = video.thumbnail;
                          const channel = video.author.username;
                            const channelURL = video.author.url
                            const voiceChannel = message.member.voice.channel
                            const provider = "SoundCloud"

                            const song = {
                                url,
                                title,
                                duration,
                                thumbnail,
                                channel,
                                channelURL,
                                voiceChannel,
                                provider,
                                SC
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
                    }).catch(err => {
                        console.error(err)
                    })

                        } catch (err) {
                            console.error(err)
                            musicData.server[message.guild.id].awaiting = false
                            if (songEmbed) songEmbed.delete()
                            musicData.server[message.guild.id].loop = false
                            return message.channel.send("Hubo un error al buscar la canción")
                        }
                    }
                }
            }