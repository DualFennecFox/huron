const Discord = require('discord.js');
const fs = require('fs');
require('dotenv/config');
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.fieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json')
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const scount = client.guilds.cache.size
let prefix;
const token = process.env.TOKEN;
const owner = process.env.OWNER

client.categories = fs.readdirSync("./cmds/");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})


let db = admin.firestore();


["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
    
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    status: "online",
    activity: {
        name: `Estoy en ${scount} Servidores!`,
        type: "WATCHING"
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
 
   let message_array = message.content.split(" ");
   let command = message_array[0];
   let args = message_array.slice(1);
   const cmd = args.shift().toLowerCase();
 
   if (!command.startsWith(prefix)) return;

   if (client.commands.get(command.slice(prefix.length))){
       let command = client.commands.get(cmd);
       if(!command) command = client.commands.get(client.aliases.get(cmd))
           if (command){
               command.run(client,message,args,db,prefix);
           }
 }
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
})
client.on('guildDelete', async gData => {
db.collection("guilds").doc(gData.id).delete().then(function() {
  console.log("Document successfully deleted!");
}).catch(function(error) {
  console.error("Error removing document: ", error);
})
});

client.login(process.env.TOKEN);