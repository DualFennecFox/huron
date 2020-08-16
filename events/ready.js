const DBL = require("dblapi.js");
const http = require('http');
const querystring = require('querystring');

module.exports = async client => {
    const dbl = new DBL(process.env.DBL, client)
    console.log(`Logged in as ${client.user.tag}!`);
    const scount = client.guilds.cache.size
    dbl.postStats(scount)

    client.user.setPresence({
      status: "online",
      activity: {
          name: `Estoy en ${scount} Servidores!`,
          type: "WATCHING",
          url: "https://www.twitch.tv/unfirulais"
      }
  }); 
}