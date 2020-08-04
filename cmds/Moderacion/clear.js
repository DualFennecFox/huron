const Discord = require('discord.js');
const { parse } = require('dotenv-flow');

    module.exports  = {
    name : 'clear',
    category: "Moderacion",
    description : 'Este comando borra un número de mensajes seleccionados por el usuario',
    aliases: ['Clear', 'CLEAR', 'purge', 'Purge', 'PURGE'],
    usage: '!clear',
    examples: ['!clear 50'],
    run: async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES") || !message.guild.owner) return message.channel.send("No tienes permisos para usar este comando!").then(message => message.delete({timeout: 5000})).catch(err => console.error(err))
    if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No tengo permisos para borrar mensajes!").then(message => message.delete({timeout: 5000})).catch(err => console.error(err))
    let amount = parseInt(args[0]);
    if (isNaN(amount)) return message.channel.send("Dime cuantos mensajes quieres borrar!").then(message => message.delete({timeout: 5000})).catch(err => console.error(err))
    else if (amount <= 1 || amount > 100) {
      return message.channel.send('Debes elegir un número entre 1 y 100');
    }
    if (message) message.delete()
    message.channel.messages.fetch({ limit: amount })
    .then(messages => {
      message.channel.bulkDelete(messages, true);

    messagesDeleted = messages.array().length;
    message.channel.send(`Se han borrado ${messagesDeleted} mensajes`).then(message => message.delete({timeout: 5000}))
    }).catch(err => {
      message.channel.send("No se han podido borrar los mensajes").then(message => message.delete({timeout: 5000}))
      console.error(err);
    });
}
    }