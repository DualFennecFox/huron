module.exports = async client => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.get("736200583320567820").members.fetch()

    client.user.setPresence({
      status: "online",
      activity: {
          name: `Trabajando`,
          type: "PLAYING",
          url: "https://www.twitch.tv/unfirulais"
      }
  }); 
}