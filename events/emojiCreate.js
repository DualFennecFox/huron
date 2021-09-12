const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async emoji => {

    Guild.findOne({ guildID: emoji.guild.id }).then(doc => {
      if (!doc) return
      if (doc.log.emojiCreate == true) {
        if (!doc.LogChannel) return
        let Channel = emoji.guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(emoji.guild.me).has("SEND_MESSAGES")) return
        
        emoji.fetchAuthor().then(author => {
  
          let animated = ""
          if (emoji.animated == true) animated = `https://cdn.discordapp.com/emojis/${emoji.id}.gif`
          else animated = `https://cdn.discordapp.com/emojis/${emoji.id}.png`
        const embed = new Discord.MessageEmbed()
        .setAuthor("Emoji Creado")
        .setColor("#FF0000")
        .setDescription(`<:${emoji.name}:${emoji.id}> | ${emoji.name}\n\nID: ${emoji.id}`)
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