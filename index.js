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

client.on('guildMemberAdd', async member => {

    let verifrole = member.guild.roles.cache.get("743567666907840674")
    let membeRole = member.guild.roles.cache.get("745635603638386700")

    member.roles.add(verifrole.id)
    member.roles.add(membeRole.id)
})

client.on("messageReactionRemove", (reaction, user) => {

    if (reaction.emoji.name !== "✅") return
    if (reaction.message.id !== "745768389083004949") return

    let us = reaction.message.guild.member(user).roles.remo

        let role = reaction.message.guild.roles.cache.find(r => r.id === "743567666907840674")

        us.roles.remove(role.id)

client.login(process.env.TOKEN);