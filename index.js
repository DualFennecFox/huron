const Discord = require('discord.js');
const fs = require('fs');
require('dotenv-flow').config();
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.log = new Discord.Collection();
const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGOURI}/Guild`, { useNewUrlParser: true, useUnifiedTopology: true })
require('./util/eventLoader')(client);

client.categories = fs.readdirSync("./cmds/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 
["logs"].forEach(handler => {
    require(`./handlers/${handler}`)(client)
})
client.on('roleUpdate', (oldRole, newRole) => {
  let log = await newRole.guild.fetchAuditLogs({ limit: 5, type: "ROLE_UPDATE" })

  let roleLog = log.entries.filter(l => l.target === newRole.id ).array()[0]

  roleLog.changes.filter(c => c.new).join(", ")
roleLog.changes.keys()
  roleLog.changes.filter(c => c.key)
})

client.on('message', message => {
  args = message.content.slice(1).trim().split(/ +/g)
})
client.login(process.env.TOKEN);