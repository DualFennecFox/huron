const DBL = require("dblapi.js");
const { getGuild } = require('../cmds/Moderacion/models/functions')

module.exports = async guild => {
    let client = guild.client
    const dbl = new DBL(process.env.DBL, client)
    const scount = client.guilds.cache.size
    dbl.postStats(client.guilds.cache.size)
    client.user.setPresence({
      status: "online",
      activity: {
          name: `Estoy en ${scount} Servidores!`,
          type: "WATCHING",
          url: "https://www.twitch.tv/unfirulais"
      }
  })
  getGuild(guild)
}