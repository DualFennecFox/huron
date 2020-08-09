const Discord = require('discord.js');
const fs = require('fs');
require('dotenv-flow').config();
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGOURI}/Guild`, { useNewUrlParser: true, useUnifiedTopology: true })
require('./util/eventLoader')(client);

client.categories = fs.readdirSync("./cmds/");

fs.readdir("./cmds/", (files) => {

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 
});

client.login(process.env.TOKEN);