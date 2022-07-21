module.exports = async client => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(async guild => {

      await guild.members.fetch()
    })

    client.user.setPresence({
      status: "online",
      activities: [{
          name: ``,
          type: "PLAYING",
          url: "https://twitch.tv/dualfennecfox"
      }],
      status: "online"
  }); 
}