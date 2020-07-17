const Discord = require('discord.js');

module.exports = {
  name : 'avatar',
  description : 'Se envia la imagen del avatar del usuario o del usuario mencionado al canal',
  category: "Info",
  aliases: ['Avatar', 'AVATAR'],
  usage: `!avatar`,
  examples: ['!avatar', '!avatar @Firulais'],
  run: async (client, message, args) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!message.guild.member(user)) user = message.author
    if(!user) user = message.author;
    const embed = new Discord.MessageEmbed()
    .setAuthor(`Avatar de ${user.tag}`)
    .setTitle('')
    .addField('Formato de Imagen', `[png](${user.displayAvatarURL({ format: "png", size: 2048})}) | [jpg](${user.displayAvatarURL({ format: "jpg", size: 2048})}) | [webm](${user.displayAvatarURL({size: 2048})})`)
		.setTimestamp()
		.setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048}))
    .setColor('RANDOM')
    message.channel.send({ embed })
    .catch(err => {
      console.log(err);
    })
}
}