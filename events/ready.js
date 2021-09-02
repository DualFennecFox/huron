module.exports = async client => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(async guild => {

      await guild.members.fetch()
    })

    client.user.setPresence({
      status: "online",
      activities: [{
          name: `Trabajando`,
          type: "PLAYING",
          url: "https://trovo.live/DualFennecFox"
      }]
  }); 
}