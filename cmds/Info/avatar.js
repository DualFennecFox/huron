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
    
    if (user) {
    if (!message.guild.members.cache.get(user.id)) user = message.author 
    } else if (!user) user = message.author;
    
    const embed = new Discord.EmbedBuilder()
    .setAuthor({name: `Avatar de ${user.tag}`}) 
    .setFields([{name: 'Formato de Imagen', value: `[png](${user.displayAvatarURL(
        { extension: "png", forceStatic: true, size: 2048})}) | [jpg](${user.displayAvatarURL({ extension: "jpg", forceStatic: true, size: 2048})}) | [webp](${user.displayAvatarURL({ extension: "webp", forceStatic: true, size: 2048})})`}])
		.setTimestamp()
		.setImage(user.displayAvatarURL({ size: 2048}))
    .setColor('Random')
    message.channel.send({ embeds: [embed] })
    .catch(err => {
      console.log(err);
    })
}
}