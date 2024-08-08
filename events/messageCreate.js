const Guild = require('../cmds/Moderacion/models/Guild')

module.exports = async message => {
  let client = message.client
  if (message.author.bot && message.author.id != "1225644162196701245") return;
  
    if (message.channel.type === "dm") return
      
    if (!message.channel.permissionsFor(message.guild.members.me).has("SEND_MESSAGES")) return


      let prefixes;
      let contentPrefix;
      let prefix;
      let currentmsg;
      currentmsg = message.content

      if (message.author.id === "1225644162196701245" && message.embeds[0]?.description != null) {
        currentmsg = message.embeds[0]?.description
      }


      const owner = process.env.OWNER
      
      Guild.findOne({ guildID: message.guild.id }).then(async result => {
       if (result) {
         prefixes = [result.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`]
         prefix = result.prefix
       }
       else {
         prefixes = ["!", `<@${client.user.id}>`, `<@!${client.user.id}>`]
         prefix = "!"
       } 
      
      for (const thePrefix of prefixes) {
        if (currentmsg.startsWith(thePrefix)) contentPrefix = thePrefix
      }
      if (!contentPrefix) return;

      let args = currentmsg.slice(contentPrefix.length).trim().split(/ +/g);
      let cmd = args.shift().toLowerCase();
      let command;
  
      if (currentmsg === "Reset Status") {
        if (message.author.id != owner) return
        
        const scount = client.guilds.cache.size
        client.user.setPresence({
          status: "online",
          activities: [{
              name: `Estoy en ${scount} Servidores!`,
              type: "PLAYING",
              url: "https://trovo.live/DualFennecFox"
          }]
      });  
      }
      if (currentmsg === `<@${client.user.id}>` || currentmsg === `<@!${client.user.id}>`) {
       message.channel.send(`Mi prefix en este server es ${prefix} o una mención, si es la primera vez que me usa escriba ${prefix}help.`)
     }
     
     if (!currentmsg.startsWith(contentPrefix)) return;
  
       if (client.commands.has(cmd)) {

         command = client.commands.get(cmd);
       } else {
         command = client.commands.get(client.aliases.get(cmd));
       }
         if (command) {
          if (command.category === "owner" && message.author.id !== process.env.OWNER) return

           command.run(client, message, args, prefix, contentPrefix);
         }
         }).catch(err => {

          console.error(err)
         })
         }
