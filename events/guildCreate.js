const { getGuild } = require('../cmds/Moderacion/models/functions')

module.exports = async guild => {
    let client = guild.client

    guild.members.fetch()
    const scount = client.guilds.cache.size
  getGuild(guild)
}