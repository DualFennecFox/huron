const { EmbedBuilder } = require('discord.js');

module.exports = {
  name : 'server-icon',
  description : 'Este comando envia el icono del servidor con distintos formatos',
  category: "Info",
  aliases: ["servericon"],
  usage: `!server-icon`,
  run: async (client, message, args) => {
    
    if (!message.guild.iconURL()) return message.channel.send({ content: "Este servidor no tiene ningún icono"})

    const embed = new EmbedBuilder()
    .setAuthor({ name: `Icono de ${message.guild.name}` })
    .setFields({
      name: 'Formato de Imagen', 
      value: `[png](${message.guild.iconURL({ extension: "png", forceStatic: true, size: 2048})}) | [jpg](${message.guild.iconURL({ extension: "jpg", forceStatic: true, size: 2048})}) | [webp](${message.guild.iconURL({extension: "webp", forceStatic: true, size: 2048})})`})
	.setTimestamp()
	.setImage(message.guild.iconURL({ size: 2048}))
    .setColor('Random')
    message.channel.send({ embeds: [embed] })
    .catch(err => {
      console.log(err);
    })
}
}
