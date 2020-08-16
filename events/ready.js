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

  var postData = querystring.stringify({
    "guildCount": scount
  })

  var request = {
    'host':`bots.ondiscord.xyz`,
    'path': `/bot-api/bots/${client.user.id}/guilds`,
    'method': "POST",
    'auth': process.env.BOTS_ON_DISCORD,
    headers: {
      "Content_Type": "application/json"
    }
  }
    let req = http.request(request, function (result) {
      result.on('error', err => {
        console.log("Hubo un error al subir los servidores a Bots on Discord: " + err)
      })
      result.on('data', chunk => {
        console.log(`Posted: ${chunk}`)
      })
    })

    req.write(postData);
    req.end();
}