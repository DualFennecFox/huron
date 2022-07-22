const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv-flow').config();
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildBans, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMessageReactions, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates],
    partials: [Partials.Channel] });

client.commands = new Collection();
client.aliases = new Collection();
client.log = new Collection();
client.configs = new Collection();
const { connect } = require("mongoose");

connect(`${process.env.MONGOURI}/Guild`, { useNewUrlParser: true, useUnifiedTopology: true })
require('./util/eventLoader')(client);

client.categories = fs.readdirSync("./cmds/");

["command", "logs", "configs"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 

client.login(process.env.TOKEN);