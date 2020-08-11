const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const musicData = require("./requirements/musicData");
const { playSong } = require('./requirements/functions')
const ytpl = require('ytpl')
const ytsr = require('ytsr')
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
            aliases: ['Play', 'PLAY'],
            description : 'Este comando busca una musica en Youtube para escucharla en un chat de voz',
            usage: '!play',
            examples: ['!play Musica', '!play "URL de YT"'],
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
                                ytpl(args[0], { limit: Infinity }).then(playlist => {
                                    for (let i = 0; i < playlist.items.length; i++) {
                                        musicData.server[message.guild.id].queue.push({
                                            url: playlist.items[i].url_simple,
                                            title: playlist.items[i].title,
                                            duration: playlist.items[i].duration,
                                            thumbnail: playlist.items[i].thumbnail,
                                            channel: playlist.items[i].author.name,
                                            channelURL: playlist.items[i].author.ref,
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
                          const url = args[0];
                            let ID = getVideoId(args[0]).id
                            ytsr(ID, { limit: 10 }).then(toSearch => {
                            let video = search(ID, toSearch.items)
                            const title = video.title
                            const duration = video.duration
                            const thumbnail = video.thumbnail;
                            const channel = video.author.name
                            const channelURL = video.author.ref
                            if (duration == '00:00') duration = 'Transmitiendo en Vivo';
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
                        
                     ytsr.getFilters(argsresult).then(filters => {
                      let filter = filters.get('Type').find(o => o.name === 'Video');
                        var options = {
                            limit: 10,
                            nextpageRef: filter.ref
                        }
                    
                       ytsr(filter, options).then(async (videos) => {
                        if (videos.items.length < 10) {
                            return message.channel.send("Muy pocos videos tienen ese nombre asegurate de haberlo escrito bien")
                        }
                        if (musicData.server[message.guild.id].awaiting == true) return message.channel.send("Ya se está esperando la respuesta")
                        const vidNameArr = []
                        const videoID = []

                        for (let v = 0; v < videos.items.length; v++) {
                             videoID.push(videos.items[v].link)
                             vidNameArr.push(`${v + 1}: ${videos.items[v].title}`);
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
                                var video = videos.items[videoIndex - 1]       
                              } catch (err) {
                                  console.error(err)
                                  if (songEmbed) songEmbed.delete()
                                  return message.channel.send("Hubo un error al obtener el video de Youtube")
                              }       

                          const url = video.link;
                          const title = video.title
                          let duration = video.duration;
                          const thumbnail = video.thumbnail;
                          const channel = video.author.name;
                            const channelURL = video.author.ref
                            if (duration == '00:00') duration = 'Transmitiendo en Vivo';
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