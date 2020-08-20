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

client.login(process.env.TOKEN);