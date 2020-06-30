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
    const amount = parseInt(args[0]) + 1;
    if (isNaN(amount)) return message.channel.send("Dime cuantos mensajes quieres borrar!");
    else if (amount <= 1 || amount > 100) {
      return message.channel.send('Debes elegir un número entre 1 y 100');
    }
    message.channel.messages.fetch({ limit: amount })
    .then(messages => {
      message.channel.bulkDelete(messages, true);

    messagesDeleted = messages.array().length;
    message.channel.send(`Se han borrado ${messagesDeleted} mensajes`).then(message => message.delete({timeout: 5000}))
    })
    .catch(err => {
      message.channel.send("No se han podido borrar los mensajes").then(message => message.delete({timeout: 5000}))
      console.log(err);
    });
}
    }