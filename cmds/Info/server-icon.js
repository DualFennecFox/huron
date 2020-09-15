const Discord = require('discord.js');

module.exports = {
  name : 'server-icon',
  description : 'Este comando envia el icono del servidor con distintos formatos',
  category: "Info",
  aliases: ["servericon"],
  usage: `!server-icon`,
  run: async (client, message, args) => {
 
    const embed = new Discord.MessageEmbed()
    .setAuthor(`Icono de ${message.guild.name}`)
    .setTitle('')
    .addField('Formato de Imagen', `[png](${message.guild.iconURL({ format: "png", size: 2048})}) | [jpg](${message.guild.iconURL({ format: "jpg", size: 2048})}) | [webm](${message.guild.iconURL({size: 2048})})`)
	.setTimestamp()
	.setImage(message.guild.iconURL({ format: "png", dynamic: true, size: 2048}))
    .setColor('RANDOM')
    message.channel.send({ embed })
    .catch(err => {
      console.log(err);
    })
}
}