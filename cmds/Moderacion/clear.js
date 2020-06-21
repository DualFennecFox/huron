const Discord = require('discord.js');

    module.exports  = {
    name : 'clear',
    category: "Moderacion",
    description : 'Este comando borra un número de mensajes seleccionados por el usuario',
    aliases: ['Clear', 'CLEAR'],
    usage: '!clear',
    examples: ['!clear 50'],
    run: async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No tienes permisos para usar este comando!");
    if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No tengo permisos para borrar mensajes!");
    if(!args[0]) return message.channel.send("Dime cuantos mensajes quieres borrar!");
    message.channel.bulkDelete(args[0]).then(() => {
        message.channel.send(`Borrados ${args[0]} mensajes`).then(message => message.delete(5000));
    })
    }
}