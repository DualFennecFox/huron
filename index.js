const Discord = require('discord.js');
const fs = require('fs');
require('dotenv/config');
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json')
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const mongoose = require("mongoose");

let prefix;
const token = process.env.TOKEN;
const owner = process.env.OWNER

client.categories = fs.readdirSync("./cmds/");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

let db = admin.firestore();

fs.readdir("./cmds/", (files) => {


["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
});
    
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const scount = client.guilds.cache.size
  client.user.setPresence({
    status: "online",
    activity: {
        name: `Estoy en ${scount} Servidores!`,
        type: "WATCHING",
        url: "https://www.twitch.tv/unfirulais"
    }
}); 
});

client.on('message', (message) => {
  db.collection('guilds').doc(message.guild.id).get().then((q) => {
    if (q.exists){
      prefix = q.data().prefix; 
    }
  }).then(() => {

  
    
   if (message.channel.type === "dm") return;
   if (message.author.bot) return;
   
   let args = message.content.slice(prefix.length).trim().split(/ +/g);
   let cmd = args.shift().toLowerCase();
   let command;

   if (message.content === "<@728100449047019534>" || message.content === "<@!728100449047019534>") {
    message.channel.send(`Mi prefix en este server es ${prefix}, si es la primera vez que me usa escriba ${prefix}help`)
  }
  
   if (!message.content.startsWith(prefix)) return;

    if (client.commands.has(cmd)) {

      command = client.commands.get(cmd);
    } else {
      command = client.commands.get(client.aliases.get(cmd));
    }
       
      if (command) command.run(client, message, args, db, prefix);
  })
});

client.on('guildCreate', async gData => {
  db.collection('guilds').doc(gData.id).set({
    'guildID' : gData.id,
    'guildName' : gData.name,
    'guildOwner' : gData.owner.user.username,
    'guildOwnerID' : gData.owner.id,
    'guildMemberCount' : gData.memberCount,
    'prefix' : '!'
  });
  const scount = client.guilds.cache.size
client.user.setPresence({
  status: "online",
  activity: {
      name: `Estoy en ${scount} Servidores!`,
      type: "STREAMING",
      url: "https://www.twitch.tv/unfirulais"
  }
})
})
client.on('guildDelete', async gData => {
db.collection("guilds").doc(gData.id).delete().then(function() {
  console.log("Document successfully deleted!");
}).catch(function(error) {
  console.error("Error removing document: ", error);
})
const scount = client.guilds.cache.size
client.user.setPresence({
  status: "online",
  activity: {
      name: `Estoy en ${scount} Servidores!`,
      type: "STREAMING",
      url: "https://www.twitch.tv/unfirulais"
  }
})
});

client.login(process.env.TOKEN);