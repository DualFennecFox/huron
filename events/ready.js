const DBL = require("dblapi.js");
const { status } = require("../cmds/Moderacion/models/functions");

module.exports = async client => {
    const dbl = new DBL(process.env.DBL, client)
    console.log(`Logged in as ${client.user.tag}!`);
    const scount = client.guilds.cache.size
    dbl.postStats(scount)

  const ucount = client.users.cache.size

  let presences = [`Estoy en ${scount} Servidores!`, `${ucount} Usuarios!`]



  setInterval(() => {

    let presence = presences[Math.floor(Math.random() * (presences.length - 1) + 1)];
    
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

  client.user.setPresence({
    status: "online",
    activity: {
        name: presence,
        type: "LISTENING",
        url: "https://www.twitch.tv/unfirulais"
    }
  });
};
}, 15000); 
}