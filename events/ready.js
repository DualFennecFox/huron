module.exports = async client => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(guild => {

      await guild.members.fetch()
    })

    client.user.setPresence({
      status: "online",
      activity: {
          name: `Trabajando`,
          type: "PLAYING",
          url: "https://www.twitch.tv/unfirulais"
      }
  }); 
}