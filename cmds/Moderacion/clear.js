const Discord = require('discord.js');

    module.exports  = {
    name : 'clear',
    category: "Moderacion",
    description : 'Este comando borra un número de mensajes seleccionados por el usuario',
    aliases: ['Clear', 'CLEAR'],
    usage: '!clear',
    examples: ['!clear 50'],
    run: async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No tengo permisos para borrar mensajes!");
    if(!args[0]) return message.channel.send("Dime cuantos mensajes quieres borrar!");
    let messagesDeleted = await clearChannel(channel)

      message.channel.send(`Se han borrado ${messagesDeleted} mensages`)
    }
    }

    async function clearChannel(channel, n = 0, old = false) {
      let collected = await channel.messages.fetch();
      if (collected.size > 0) {
        if (old) {
          for (let msg of collected.array()) {
            await msg.delete({timeout: 5000});
            n++;
          }
        } else {
          let deleted = await channel.bulkDelete(100, true);
          if (deleted.size < collected.size) old = true;
          n += deleted;
        }
    
        return n + await clearChannel(channel, old);
      } else return 0;
    }