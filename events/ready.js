const DBL = require("dblapi.js");
const { status } = require("../cmds/Moderacion/models/functions");

module.exports = async client => {
    const dbl = new DBL(process.env.DBL, client)
    console.log(`Logged in as ${client.user.tag}!`);
    const scount = client.guilds.cache.size
    dbl.postStats(scount)

    let scount = client.guilds.cache.size
  let ucount = client.users.cache.size

  let presences = [`Estoy en ${scount} Servidores!`, `${ucount} Usuarios!`]

  let presence = presences[0]

  let first = true

  setInterval(() => {

    if (first === false) {
      presence = presences[1]
      first = true
    }

  if (presence === presences[0]) {
  client.user.setPresence({
    status: "online",
    activity: {
        name: presence,
        type: "WATCHING",
        url: "https://www.twitch.tv/unfirulais"
    }
  });
}
else if (presence === presences[1]) {
  first = false
  client.user.setPresence({
    status: "online",
    activity: {
        name: presence,
        type: "LISTENING",
        url: "https://www.twitch.tv/unfirulais"
    }
  });
};
}, 30000); 
}