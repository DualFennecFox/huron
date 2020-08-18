const Discord = require('discord.js');
const { getUser } = require('../Moderacion/models/functions')

module.exports = {
  name : 'avatar',
  description : 'Se envia la imagen del avatar del usuario o del usuario mencionado al canal',
  category: "Info",
  usage: `!avatar <Usuario>`,
  examples: ['!avatar @Wumpus', '!avatar 12345678987654321'],
  run: async (client, message, args, prefix, contentPrefix) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (contentPrefix !== prefix) user = getUser(args[0], client)
  
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