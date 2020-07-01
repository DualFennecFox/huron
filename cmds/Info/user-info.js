const Discord = require("discord.js");

module.exports = {
    name : 'user-info',
    category: "Info",
    description : 'Este comando muestra la información del usuario, su creación, el id, sus roles, Etc...',
    aliases: ['User-info', 'USER-INFO', 'userinfo'],
    usage: '!user-info',
    examples: ['!user-info', '!user-info @Firulais'],
    run: async (client , message, args) => {
    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
        };
    let user = message.mentions.users.first() || message.author
    let memberMention = message.mentions.members.first() || message.member;

    let myInfo = new Discord.MessageEmbed()
        .setAuthor(user.username, user.displayAvatarURL())
        .setColor('RANDOM')
        .addField("Nombre de Usuario", user.username, true)
        .addField("Discriminador", user.discriminator, true)
        .addField("Usuario", user.tag, true)    
        .addField("Creado A las", `${user.createdAt.toUTCString().substr(0, 16)} (${checkDays(user.createdAt)})`, true)
        .addField("ID", user.id, true)
        .addField("Roles", memberMention.roles.cache.size, true)
        .setThumbnail(user.displayAvatarURL())
    message.channel.send(myInfo)
    .catch(err => {
        console.log(err);
        })
    }
}