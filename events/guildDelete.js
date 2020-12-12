const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async guild => {
    let client = guild.client
    const scount = client.guilds.cache.size
    Guild.findOne({ guildID: guild.id }).then((result) => {
      if (!result) return;
      else return result.remove()
    }).catch(err => {
      console.error(err)
    })
    }