const Discord = require("discord.js");

module.exports = {
    name : 'emoji',
    category: "Info",
    description : 'Muestra un rol que haya sido usado en el servidor como una imagen',
    aliases: ['jumbo'],
    usage: '!emoji <Emoji>',
    examples: ['!emoji :super-wumpus:', '!emoji 12345678987654321'],
    run: async (client , message, args) => {

        if (message.guild.id === "736200583320567820") return message.channel.send("Este comando esta deshabilitado en el servidor")

        if(!args[0]) return message.channel.send("Debes usar un emoji para poder mostrarlo")

        let emoji = await message.guild.emojis.cache.find(em => `<:${em.name}:${em.id}>` === args[0] || `<a:${em.name}:${em.id}>` === args[0] || em.id === args[0])
        if (!emoji) return message.channel.send("Ese no parece ser un emoji valido")

    const embed = new Discord.MessageEmbed()
        .setAuthor(`Emoji ${emoji.name}`)
        .addField('Link de Formato', `[png](https://cdn.discordapp.com/emojis/${emoji.id}.png) | [jpg](https://cdn.discordapp.com/emojis/${emoji.id}.jpg)`)
		.setTimestamp()
		.setImage(emoji.url)
        .setColor('RANDOM')
    message.channel.send({ embed })
    .catch(err => {
      console.log(err);
  })
    }
}