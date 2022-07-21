const { EmbedBuilder } = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')
const { perms } = require('../cmds/Moderacion/models/functions')

module.exports = async emoji => {

    Guild.findOne({ guildID: emoji.guild.id }).then(async doc => {
      if (!doc) return
      if (doc.log.emojiCreate == true) {
        if (!doc.LogChannel) return
        let Channel = emoji.guild.channels.cache.get(doc.LogChannel)
        if (!Channel) return
        if (!Channel.permissionsFor(emoji.guild.me).has(perms.send_messages)) return
        
        let author = await emoji.fetchAuthor()
  
          let animated = ""
          if (emoji.animated == true) animated = `https://cdn.discordapp.com/emojis/${emoji.id}.gif`
          else animated = `https://cdn.discordapp.com/emojis/${emoji.id}.png`
        const embed = new EmbedBuilder()
        .setAuthor({ name: "Emoji Creado" })
        .setColor("#FF0000")
        .setDescription(`<:${emoji.name}:${emoji.id}> | ${emoji.name}\n\nID: ${emoji.id}`)
        .setThumbnail(animated)
        .setFooter({ text: `Por: ${author.username} | ${author.id}` });
  
        Channel.send({ embeds: [embed] })
    }
    }).catch(err => {
      console.error(err)
    })
  }