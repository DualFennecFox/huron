const Discord = require("discord.js");

module.exports = {
    name : 'user-info',
    category: "Info",
    description : 'Este comando muestra la información del usuario, su creación, el id, sus roles, Etc... \nSi quiere ver los roles del usuario escriba "roles", "r" o "role", despues del comando o usuario mencionado',
    aliases: ['User-info', 'USER-INFO', 'userinfo'],
    usage: '!user-info',
    examples: ['!user-info', '!user-info @Firulais', '!userinfo roles @Firulais', '!userinfo @Firulais roles'],
    run: async (client , message, args) => {
    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
        };
    let user = message.mentions.users.first() || message.author
    let memberMention = message.mentions.members.first() || message.member;
    let rolesOfTheMember = memberMention.roles.cache.filter(r => r.name !== '@everyone').map(role => `<@&${role.id}>`).join('\n')
    if(args[0]) { 
        return getargs(args[0] === 'roles' || 'role' || 'r')
    }

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
function getargs(client, message, input)
    let embed = new Discord.MessageEmbed()
    message.channel.send(embed.setColor("RANDOM").setDescription(rolesOfTheMember).setAuthor(`Roles de ${user.username}`, user.displayAvatarURL()).setThumbnail(user.displayAvatarURL()))
    return;
    }
}