const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async message => {
    if (message.channel.type === "dm") return;
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
      let client = message.client

      let prefixes;
      let contentPrefix;
      let prefix;
      const token = process.env.TOKEN
      const owner = process.env.OWNER
      
      Guild.findOne({ guildID: message.guild.id }).then((result) => {
       if (result) {
         prefixes = [result.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`]
         prefix = result.prefix
       }
       else {
         prefixes = ["!", `<@${client.user.id}>`, `<@!${client.user.id}>`]
         prefix = "!"
       } 
       }).then(() => {
      if (message.author.bot) return;
      
      for (const thePrefix of prefixes) {
        if (message.content.startsWith(thePrefix)) contentPrefix = thePrefix
      }
      if (!contentPrefix) return;

      let args = message.content.slice(contentPrefix.length).trim().split(/ +/g);
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
      if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
       message.channel.send(`Mi prefix en este server es ${prefix} o una mención, si es la primera vez que me usa escriba ${prefix}help.`)
     }
     
     if (!message.content.startsWith(contentPrefix)) return;
  
       if (client.commands.has(cmd)) {

         command = client.commands.get(cmd);
       } else {
         command = client.commands.get(client.aliases.get(cmd));
       }
         if (command) command.run(client, message, args, prefix, contentPrefix);
    }).catch(err => {
      console.error(err)
    })
     }