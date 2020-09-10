const DBL = require("dblapi.js");
const { status } = require("../cmds/Moderacion/models/functions");

module.exports = async client => {
    const dbl = new DBL(process.env.DBL, client)
    console.log(`Logged in as ${client.user.tag}!`);
    const scount = client.guilds.cache.size
    dbl.postStats(scount)

    status(client)
}