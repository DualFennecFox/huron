const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async (oldEmoji, newEmoji) => {

    Guild.findOne({ guildID: newEmoji.guild.id }).then(doc => {
      if (!doc) return
      if (doc.log.emojiUpdate == true) {
        if (!doc.LogChannel) return
        let Channel = newEmoji.guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return
        
        if (oldEmoji.name === newEmoji.name) return
        newEmoji.fetchAuthor().then(author => {
  
          let animated = ""
          if (newEmoji.animated == true) animated = `https://cdn.discordapp.com/emojis/${newEmoji.id}.gif`
          else animated = `https://cdn.discordapp.com/emojis/${newEmoji.id}.png`
        const embed = new Discord.MessageEmbed()
        .setAuthor("Emoji Actualizado")
        .setColor("#FF0000")
        .setDescription(`<:${newEmoji.name}:${newEmoji.id}> Ha sido Renombrado\n\n**De:** ${oldEmoji.name}\n**A:** ${newEmoji.name}`)
        .setThumbnail(animated)
        .setFooter(`Por: ${author.username} | ${author.id}`);
  
        Channel.send({ embed })
      }).catch(err => {
        console.error(err)
      })
    }
    }).catch(err => {
      console.error(err)
    })
  }