const Discord = require('discord.js')
const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async message => {
    if (message.channel.type === "dm") return;
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
      let client = message.client

      let prefix;
      const token = process.env.TOKEN
      const owner = process.env.OWNER
      
      Guild.findOne({ guildID: message.guild.id }).then((result) => {
       if (result) prefix = result.prefix
       else prefix = '!'
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
      message.guild.members.cache.filter(user => user.user.bot !== user.user.id).map(member => `<@!<${member.id}>`)
         command = client.commands.get(cmd);
       } else {
         command = client.commands.get(client.aliases.get(cmd));
       }
         if (command) command.run(client, message, args, prefix);
    }).catch(err => {
      console.error(err)
    })
     }