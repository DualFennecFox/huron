const Discord = require('discord.js');
const fs = require('fs');
require('dotenv-flow').config();
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const mongoose = require("mongoose");
const ytdl = require('ytdl-core');
const Youtube = require("simple-youtube-api");
youtube = new Youtube(process.env.YOUTUBE_API_KEY)
const musicData = require("./cmds/Musica/requirements/musicData")
const Guild = require('./cmds/Moderacion/models/Guild')
const config = require('./cmds/Moderacion/models/config');
const { getGuild, updateGuild, createGuild } = require('./cmds/Moderacion/models/functions');
mongoose.connect(`${process.env.MONGOURI}/Guild`, { useNewUrlParser: true, useUnifiedTopology: true })

let prefix;
const token = process.env.TOKEN;
const owner = process.env.OWNER

var opts = {
  maxResults: 10,
  key: process.env.YOUTUBE_API_KEY
}

client.categories = fs.readdirSync("./cmds/");


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
  if (message.channel.type === "dm") return;
  getGuild(message.guild).then(() => {
    Guild.findOne({ guildID: message.guild.id }).then((result) => {
      prefix = result.prefix
     }).then(() => {
    if (message.author.bot) return;
    
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;

    if (message.content === "Reset Status") {
      if (message.author.id !== owner) return
      
      const scount = client.guilds.cache.size
      client.user.setPresence({
        status: "online",
        activity: {
            name: `Estoy en ${scount} Servidores!`,
            type: "WATCHING",
            url: "https://www.twitch.tv/unfirulais"
        }
    }); 
    }
    if (message.content === "<@728100449047019534>" || message.content === "<@!728100449047019534>") {
     message.channel.send(`Mi prefix en este server es ${prefix}, si es la primera vez que me usa escriba ${prefix}help`)
   }
 
    if (!message.content.startsWith(prefix)) return;

     if (client.commands.has(cmd)) {
 
       command = client.commands.get(cmd);
     } else {
       command = client.commands.get(client.aliases.get(cmd));
     }
        
       if (command) command.run(client, message, args, prefix);
  });
  })
   });

client.on('guildCreate', async gData => {
  const scount = client.guilds.cache.size
  client.user.setPresence({
    status: "online",
    activity: {
        name: `Estoy en ${scount} Servidores!`,
        type: "WATCHING",
        url: "https://www.twitch.tv/unfirulais"
    }
})
getGuild(gData)
})
client.on('guildDelete', async gData => {
const scount = client.guilds.cache.size
client.user.setPresence({
  status: "online",
  activity: {
      name: `Estoy en ${scount} Servidores!`,
      type: "WATCHING",
      url: "https://www.twitch.tv/unfirulais"
  }
})
let data = Guild.findOne({ guildID: gData.id }).then((result) => {
  if (!result) return;
  else return result.remove()
})
});

client.on('guildMemberAdd', member => {
  Guild.findOne({ guildID: member.guild.id }).then(doc => {
  if (!doc) return
  if (!doc.JoinBool) return
  if (doc.JoinBool == false) return
  if (!doc.JoinMsg) return
  if (!doc.JoinMsg.includes("{user}")) return
  if (!doc.WelcomeChannel) return
  let Channel = member.guild.channels.cache.get(doc.WelcomeChannel)
  if (!Channel) return
  if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return
  
  let msg = doc.LeaveMsg.replace("{user}", member).replace("{server}", member.guild.name).replace("{username}", member.user.tag).replace("{owner}", member.guild.owner.user.tag)
 
 Channel.send(msg)
}).catch(err => {
  console.error(err)
})
 })

client.on('guildMemberRemove', member => {
  Guild.findOne({ guildID: member.guild.id }).then(doc => {
    if (!doc) return
    if (doc.LeaveBool == false) return
    if (!doc.LeaveMsg) return
    if (!doc.LeaveMsg.includes("{user}")) return
    if (!doc.LeaveChannel) return
    let Channel = member.guild.channels.cache.get(doc.LeaveChannel)
    if (!Channel) return
    if (!Channel.permissionsFor(member.guild.me).has("SEND_MESSAGES")) return

    let msg = doc.LeaveMsg.replace("{user}", member).replace("{server}", member.guild.name).replace("{username}", member.user.tag).replace("{owner}", member.guild.owner.user.tag)

    Channel.send(msg)
  }).catch(err => {
    console.error(err)
  })
})


client.login(process.env.TOKEN);