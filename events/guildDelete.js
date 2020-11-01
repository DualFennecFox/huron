const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async guild => {
    let client = guild.client
    const scount = client.guilds.cache.size
    client.user.setPresence({
      status: "online",
      activity: {
          name: `Estoy en ${scount} Servidores!`,
          type: "WATCHING",
          url: "https://www.twitch.tv/unfirulais"
      }
    })
    Guild.findOne({ guildID: guild.id }).then((result) => {
      if (!result) return;
      else return result.remove()
    }).catch(err => {
      console.error(err)
    })
    }