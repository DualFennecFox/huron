const { perms } = require("./models/functions")   
   
   module.exports  = {
    name : 'clear',
    category: "Moderacion",
    description : 'Este comando borra un número de mensajes seleccionados por el usuario',
    aliases: ['purge'],
    usage: '!clear <Número del 1 al 100>',
    examples: ['!clear 50'],
    run: async (client, message, args) => {
    if(!message.member.permissions.has(perms.manage_messages)) return message.channel.send({ content: "No tienes permisos para usar este comando!"}).then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
    if(!message.guild.me.permissions.has(perms.manage_messages)) return message.channel.send({ content: "No tengo permisos para borrar mensajes!"}).then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
    let amount = parseInt(args[0]);
    if (isNaN(amount)) return message.channel.send({ content: "Dime cuantos mensajes quieres borrar!"}).then(message => setTimeout(() => message.delete(), 5000)).catch(err => console.error(err))
    else if (amount <= 1 || amount > 100) {
      return message.channel.send({ content: 'Debes elegir un número entre 1 y 100'});
    }
    if (message) message.delete()
    message.channel.messages.fetch({ limit: amount }).then(messages => {
      message.channel.bulkDelete(messages, true);

    messagesDeleted = messages.array().length;
    message.channel.send({ content: `Se han borrado ${messagesDeleted} mensajes`}).then(message => setTimeout(() => message.delete(), 5000))
    }).catch(err => {
      message.channel.send({ content: "No se han podido borrar los mensajes"}).then(message => setTimeout(() => message.delete(), 5000))
      console.error(err);
    });
}
    }