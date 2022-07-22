module.exports = async client => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(async guild => {

      await guild.members.fetch()
    })

    client.user.setPresence({
      activities: [{
          name: `Cope`,
          type: 0,
          url: "https://twitch.tv/dualfennecfox"
      }],
      status: "online"
  }); 
}