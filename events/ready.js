const DBL = require("dblapi.js");
const { status } = require("../cmds/Moderacion/models/functions");

module.exports = async client => {
    const dbl = new DBL(process.env.DBL, client)
    console.log(`Logged in as ${client.user.tag}!`);
    const scount = client.guilds.cache.size
    dbl.postStats(scount)

  const ucount = client.users.cache.size

  let presences = [`Estoy en ${scount} Servidores!`, `${ucount} Usuarios!`]

  client.user.setStatus("online")

  setTimeout(() => {

    client.user.setActivity({
        name: presences[0],
        type: "WATCHING",
        url: "https://www.twitch.tv/unfirulais"
    })
}, 15000);

client.user.setActivity({
  name: presences[1],
  type: "WATCHING",
  url: "https://www.twitch.tv/unfirulais"
}) 
}