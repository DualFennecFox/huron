const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    let beant = message.guild.emojis.cache.first();
    
    var bean = message.guild.emojis.cache.find(emoji => emoji.name == beant);
	// By guild id 
	if(message.guild.id) {
	if(bean) {
    		message.channel.send(`<:${bean}:${bean.id}>`)
            }
        }
    }

module.exports.help = {
    name : 'emoji',
    description : 'El bot envia un mensaje escrito por un usuario, también puedes elegir un canal a donde enviarlo Ej: `!say Hola Mundo`, `!say #canal Hola Mundo`',
    aliases: ['jumbo']
}