module.exports = async client => {
    console.log(`Logged in as ${client.user.tag}!`);
    const scount = client.guilds.cache.size

    client.user.setPresence({
      status: "online",
      activity: {
          name: `Estoy en ${scount} Servidores!`,
          type: "WATCHING",
          url: "https://www.twitch.tv/unfirulais"
      }
  }); 
}